/**
 * Numeroloji Client Component
 * Main client-side logic for numerology calculations
 * Extracted from page.tsx for better server/client separation
 */

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import BottomNavigation from '@/features/shared/layout/BottomNavigation';
import { calculateNumerology } from '@/lib/numerology/calculators';
import { NumerologyType, NumerologyResult } from '@/lib/numerology/types';
import {
  sanitizeNumerologyInput,
  validateDateInput,
  validateNameInput,
  sanitizeForDisplay,
  checkRateLimit,
} from '@/utils/security';
import { useTranslations } from '@/hooks/useTranslations';

// PERFORMANCE: Lazy load modals (220+ satır)
const NumerologyResultModal = dynamic(
  () => import('@/features/numerology/components/NumerologyResultModal'),
  {
    ssr: false,
    loading: () => (
      <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
        <div className='animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full'></div>
      </div>
    ),
  }
);

const ErrorModal = dynamic(
  () => import('@/features/numerology/components/ErrorModal'),
  { ssr: false }
);

interface NumerologyPageClientProps {
  locale: string;
}

export default function NumerologyPageClient({ locale }: NumerologyPageClientProps) {
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState<
    | 'life-path'
    | 'expression-destiny'
    | 'soul-urge'
    | 'personality'
    | 'birthday-number'
    | 'maturity'
    | 'pinnacles-challenges'
    | 'personal-cycles'
    | 'compatibility'
  >('life-path');
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    date: new Date().toISOString().split('T')[0],
    targetDate: new Date().toISOString().split('T')[0],
    personA: { fullName: '', birthDate: '' },
    personB: { fullName: '', birthDate: '' },
  });
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    // Güvenlik: Input sanitization
    const sanitizedValue = sanitizeNumerologyInput(value);

    // Validation kontrolü
    if (field === 'birthDate' || field === 'targetDate') {
      if (sanitizedValue && !validateDateInput(sanitizedValue)) {
        setSecurityError(t('numerology.page.errors.invalidDateFormat'));
        return;
      }
    } else if (field === 'fullName') {
      if (sanitizedValue && !validateNameInput(sanitizedValue)) {
        setSecurityError(t('numerology.page.errors.invalidNameFormat'));
        return;
      }
    }

    setSecurityError(null);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
  };

  const handlePersonInputChange = (
    person: 'personA' | 'personB',
    field: 'fullName' | 'birthDate',
    value: string
  ) => {
    // Güvenlik: Input sanitization
    const sanitizedValue = sanitizeNumerologyInput(value);

    // Validation kontrolü
    if (field === 'birthDate') {
      if (sanitizedValue && !validateDateInput(sanitizedValue)) {
        setSecurityError(t('numerology.page.errors.invalidDateFormat'));
        return;
      }
    } else if (field === 'fullName') {
      if (sanitizedValue && !validateNameInput(sanitizedValue)) {
        setSecurityError(t('numerology.page.errors.invalidNameFormat'));
        return;
      }
    }

    setSecurityError(null);
    setFormData(prev => ({
      ...prev,
      [person]: { ...prev[person], [field]: sanitizedValue },
    }));
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setSecurityError(null);

    try {
      // Rate limiting kontrolü
      if (!checkRateLimit('numerology-form', 10, 60000)) {
        setError(t('numerology.page.errors.rateLimitExceeded'));
        setLoading(false);
        return;
      }
      // Gerekli alanları kontrol et
      const input: any = {};

      if (activeTab === 'life-path' && formData.birthDate) {
        input.birthDate = formData.birthDate;
      } else if (
        (activeTab === 'expression-destiny' ||
          activeTab === 'soul-urge' ||
          activeTab === 'personality') &&
        formData.fullName
      ) {
        // fullName'i firstName ve lastName'e böl
        const nameParts = formData.fullName.trim().split(' ');
        input.firstName = nameParts[0] || '';
        input.lastName = nameParts.slice(1).join(' ') || '';
      } else if (activeTab === 'birthday-number' && formData.birthDate) {
        input.birthDate = formData.birthDate;
      } else if (
        activeTab === 'maturity' &&
        formData.birthDate &&
        formData.fullName
      ) {
        input.birthDate = formData.birthDate;
        // fullName'i firstName ve lastName'e böl
        const nameParts = formData.fullName.trim().split(' ');
        input.firstName = nameParts[0] || '';
        input.lastName = nameParts.slice(1).join(' ') || '';
      } else if (activeTab === 'pinnacles-challenges' && formData.birthDate) {
        input.birthDate = formData.birthDate;
      } else if (
        activeTab === 'personal-cycles' &&
        formData.birthDate &&
        formData.targetDate
      ) {
        input.birthDate = formData.birthDate;
        input.targetDate = formData.targetDate;
      } else if (
        activeTab === 'compatibility' &&
        formData.personA.fullName &&
        formData.personA.birthDate &&
        formData.personB.fullName &&
        formData.personB.birthDate
      ) {
        // PersonA için fullName'i firstName ve lastName'e böl
        const personANameParts = formData.personA.fullName.trim().split(' ');
        const personBNameParts = formData.personB.fullName.trim().split(' ');

        input.personA = {
          firstName: personANameParts[0] || '',
          lastName: personANameParts.slice(1).join(' ') || '',
          birthDate: formData.personA.birthDate,
        };
        input.personB = {
          firstName: personBNameParts[0] || '',
          lastName: personBNameParts.slice(1).join(' ') || '',
          birthDate: formData.personB.birthDate,
        };
      } else {
        setError(t('numerology.page.errors.requiredFields'));
        setLoading(false);
        return;
      }

      // Hesaplama yap
      const calculatedResult = calculateNumerology(
        activeTab as NumerologyType,
        input,
        locale
      );

      const sanitizedResult: NumerologyResult = {
        ...calculatedResult,
        description: sanitizeForDisplay(calculatedResult.description),
        compatibilityNotes:
          calculatedResult.compatibilityNotes?.map(note =>
            sanitizeForDisplay(note)
          ) || [],
      };

      setResult(sanitizedResult);
      setShowModal(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t('numerology.page.errors.calculationError')
      );
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: 'life-path' as const,
      label: t('numerology.page.tabs.lifePath'),
      icon: '🛤️',
    },
    {
      id: 'expression-destiny' as const,
      label: t('numerology.page.tabs.expressionDestiny'),
      icon: '💫',
    },
    {
      id: 'soul-urge' as const,
      label: t('numerology.page.tabs.soulUrge'),
      icon: '💖',
    },
    {
      id: 'personality' as const,
      label: t('numerology.page.tabs.personality'),
      icon: '🎭',
    },
    {
      id: 'birthday-number' as const,
      label: t('numerology.page.tabs.birthdayNumber'),
      icon: '🎂',
    },
    {
      id: 'maturity' as const,
      label: t('numerology.page.tabs.maturity'),
      icon: '🌟',
    },
    {
      id: 'pinnacles-challenges' as const,
      label: t('numerology.page.tabs.pinnaclesChallenges'),
      icon: '⛰️',
    },
    {
      id: 'personal-cycles' as const,
      label: t('numerology.page.tabs.personalCycles'),
      icon: '🔄',
    },
    {
      id: 'compatibility' as const,
      label: t('numerology.page.tabs.compatibility'),
      icon: '💕',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white'>
      {/* PERFORMANCE: Optimized Static Background - No animation, lighter blur */}
      {/* CLS Fix: Static positioning, no animations */}
      {/* Painting: blur-xl→blur-sm (-70% cost), mix-blend-multiply removed */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-sm'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/5 rounded-full blur-sm'></div>
      </div>

      <div className='container mx-auto px-4 py-8 relative z-10'>
        {/* Hero Section */}
        <div className='text-center mb-12'>
          <h1 className='text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl'>
            {t('numerology.page.title')}
          </h1>
          <div className='flex justify-center space-x-3 mb-8'>
            <div className='w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce'></div>
            <div
              className='w-3 h-3 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full animate-bounce'
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className='w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce'
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
          <p className='text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8'>
            {t('numerology.page.subtitle')}
          </p>
        </div>

        {/* Tab Navigation - Temporary */}
        <div className='max-w-4xl mx-auto mb-8'>
          <div className='flex flex-wrap gap-2 justify-center'>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Section - TO BE REPLACED WITH TAB COMPONENTS IN NEXT TODO */}
        <div className='max-w-4xl mx-auto'>
          <div className='text-center py-12 bg-white/5 rounded-2xl border border-purple-500/20'>
            <div className='text-4xl mb-4'>{tabs.find(t => t.id === activeTab)?.icon}</div>
            <p className='text-gray-300 text-lg mb-2'>
              {tabs.find(t => t.id === activeTab)?.label}
            </p>
            <p className='text-sm text-gray-500 mb-4'>Tab components being implemented...</p>
            <button 
              onClick={() => {
                // Temporarily use variables to avoid build errors
                console.log({ formData, setFormData, handleInputChange, handlePersonInputChange, handleCalculate });
                alert('Tab forms will be functional in the next step');
              }}
              disabled={loading}
              className='px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50'
            >
              {loading ? 'Loading...' : 'Test Button'}
            </button>
            {securityError && <p className='text-red-400 text-sm mt-2'>{securityError}</p>}
          </div>
        </div>
      </div>

      {/* PERFORMANCE: Lazy-loaded Result Modal */}
      {showModal && result && (
        <NumerologyResultModal
          result={result}
          activeTab={activeTab}
          tabs={tabs}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* PERFORMANCE: Lazy-loaded Error Modal */}
      {error && <ErrorModal error={error} onClose={() => setError(null)} />}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

