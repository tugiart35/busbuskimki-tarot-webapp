'use client';

import Link from 'next/link';
import { Gift } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { useAuth } from '@/hooks/auth/useAuth';

interface WelcomeBonusBannerProps {
  locale: string;
}

export function WelcomeBonusBanner({ locale }: WelcomeBonusBannerProps) {
  const { t } = useTranslations();
  const { isAuthenticated, loading } = useAuth();

  // Sadece giriş yapmamış kullanıcılara göster
  if (loading || isAuthenticated) {
    return null;
  }

  return (
    <div className='flex justify-center px-4 pt-6 pb-2'>
      <Link href={`/${locale}/auth`}>
        <div className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm font-medium shadow-lg hover:shadow-xl transition-shadow cursor-pointer'>
          <Gift className='w-4 h-4' />
          <span>
            {t('homepage.welcomeBonus.title', 'Yeni Üyelere Özel 15 Kredi')}
          </span>
        </div>
      </Link>
    </div>
  );
}
