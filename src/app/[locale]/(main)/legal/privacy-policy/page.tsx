// Bu dosya, Karadağ PDPL uyumlu güncel Gizlilik Politikası sayfasını oluşturur.
// Kullanıcıların kişisel verilerinin işlenmesi, hakları ve güvenliği hakkında detaylı bilgi sunar.
// Mistik tarot temasına uygun, modern ve profesyonel bir arayüz sağlar.

'use client';

import React from 'react';
import {
  FaShieldAlt,
  FaLock,
  FaUserShield,
  FaEye,
  FaDatabase,
  FaGavel,
  FaCheckCircle,
} from 'react-icons/fa';
import BottomNavigation from '@/features/shared/layout/BottomNavigation';
import { useTranslations } from '@/hooks/useTranslations';

export default function PrivacyPolicy() {
  const { t } = useTranslations();

  return (
    <div className='min-h-screen bg-cosmic-black'>
      {/* Mystical Background Effects */}
      <div className='absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-purple-800/20'></div>
      <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent'></div>

      <main className='relative z-10 max-w-4xl mx-auto px-4 py-12'>
        {/* Header Section with Mystical Design */}
        <section className='mb-12 text-center'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full mb-6 backdrop-blur-sm border border-purple-500/30'>
            <FaShieldAlt className='w-10 h-10 text-purple-300' />
          </div>
          <h1 className='text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-golden-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent'>
            {t('blog.footer.legalPages.privacyPolicy.title')}
          </h1>
          <div className='flex items-center justify-center space-x-4 text-sm text-cosmic-300 mb-2'>
            <div className='flex items-center space-x-2'>
              <FaGavel className='w-4 h-4 text-golden-400' />
              <span>
                {t('blog.footer.legalPages.privacyPolicy.montenegroCompliant')}
              </span>
            </div>
            <div className='w-1 h-1 bg-cosmic-400 rounded-full'></div>
            <div className='flex items-center space-x-2'>
              <FaCheckCircle className='w-4 h-4 text-green-400' />
              <span>
                {t('blog.footer.legalPages.privacyPolicy.lastUpdated')}
              </span>
            </div>
          </div>
          <p className='text-cosmic-300 max-w-2xl mx-auto leading-relaxed'>
            {t('blog.footer.legalPages.privacyPolicy.subtitle')}
          </p>
        </section>

        {/* Content Sections with Card-like Design */}
        <div className='space-y-8'>
          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg'>
                <FaEye className='w-5 h-5 text-purple-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.introduction.title'
                )}
              </h2>
            </div>
            <p className='text-cosmic-200 leading-relaxed'>
              {t(
                'blog.footer.legalPages.privacyPolicy.sections.introduction.content'
              )}
            </p>
          </section>

          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg'>
                <FaGavel className='w-5 h-5 text-purple-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t('blog.footer.legalPages.privacyPolicy.sections.scope.title')}
              </h2>
            </div>
            <p className='text-cosmic-200 leading-relaxed'>
              {t('blog.footer.legalPages.privacyPolicy.sections.scope.content')}
            </p>
          </section>

          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg'>
                <FaDatabase className='w-5 h-5 text-purple-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.dataCollection.title'
                )}
              </h2>
            </div>
            <div className='space-y-4'>
              <div className='bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-4 rounded-lg border border-purple-500/20'>
                <h3 className='text-lg font-semibold text-golden-300 mb-2 flex items-center'>
                  <FaUserShield className='w-4 h-4 mr-2' />
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.dataCollection.personalData.title'
                  )}
                </h3>
                <p className='text-cosmic-200'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.dataCollection.personalData.content'
                  )}
                </p>
              </div>
              <div className='bg-gradient-to-r from-red-500/10 to-pink-500/10 p-4 rounded-lg border border-red-500/20'>
                <h3 className='text-lg font-semibold text-red-300 mb-2 flex items-center'>
                  <FaLock className='w-4 h-4 mr-2' />
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.dataCollection.sensitiveData.title'
                  )}
                </h3>
                <p className='text-cosmic-200'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.dataCollection.sensitiveData.content'
                  )}
                </p>
              </div>
              <div className='bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 rounded-lg border border-indigo-500/20'>
                <h3 className='text-lg font-semibold text-indigo-300 mb-2 flex items-center'>
                  <FaShieldAlt className='w-4 h-4 mr-2' />
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.dataCollection.metaPixel.title'
                  )}
                </h3>
                <p className='text-cosmic-200'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.dataCollection.metaPixel.content'
                  )}
                </p>
              </div>
            </div>
          </section>

          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg'>
                <FaCheckCircle className='w-5 h-5 text-purple-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.processingConditions.title'
                )}
              </h2>
            </div>
            <p className='text-cosmic-200 leading-relaxed mb-4'>
              {t(
                'blog.footer.legalPages.privacyPolicy.sections.processingConditions.content'
              )}
            </p>
            <div className='space-y-3'>
              {t(
                'blog.footer.legalPages.privacyPolicy.sections.processingConditions.conditions',
                ''
              )
                .split(',')
                .map((condition, index) => (
                  <div key={index} className='flex items-start space-x-3'>
                    <div className='w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold'>
                      {index + 1}
                    </div>
                    <p className='text-cosmic-200'>{condition.trim()}</p>
                  </div>
                ))}
            </div>
            <div className='mt-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20'>
              <p className='text-cosmic-200'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.processingConditions.additionalSecurity'
                )}
              </p>
            </div>
          </section>

          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg'>
                <FaUserShield className='w-5 h-5 text-purple-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.dataController.title'
                )}
              </h2>
            </div>
            <div className='space-y-4'>
              <div className='bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20'>
                <p className='text-cosmic-200'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.dataController.registration'
                  )}
                </p>
              </div>
              <div className='bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-4 rounded-lg border border-yellow-500/20'>
                <p className='text-cosmic-200'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.dataController.dpo'
                  )}
                </p>
              </div>
            </div>
          </section>

          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg'>
                <FaLock className='w-5 h-5 text-purple-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.security.title'
                )}
              </h2>
            </div>
            <div className='grid md:grid-cols-3 gap-4'>
              <div className='bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20 text-center'>
                <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <FaLock className='w-6 h-6 text-white' />
                </div>
                <h3 className='text-lg font-semibold text-green-300 mb-2'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.security.encryption.title'
                  )}
                </h3>
                <p className='text-cosmic-200 text-sm'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.security.encryption.content'
                  )}
                </p>
              </div>
              <div className='bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20 text-center'>
                <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <FaUserShield className='w-6 h-6 text-white' />
                </div>
                <h3 className='text-lg font-semibold text-blue-300 mb-2'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.security.training.title'
                  )}
                </h3>
                <p className='text-cosmic-200 text-sm'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.security.training.content'
                  )}
                </p>
              </div>
              <div className='bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-4 rounded-lg border border-purple-500/20 text-center'>
                <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <FaCheckCircle className='w-6 h-6 text-white' />
                </div>
                <h3 className='text-lg font-semibold text-purple-300 mb-2'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.security.audit.title'
                  )}
                </h3>
                <p className='text-cosmic-200 text-sm'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.security.audit.content'
                  )}
                </p>
              </div>
            </div>
          </section>

          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg'>
                <FaShieldAlt className='w-5 h-5 text-red-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.dataBreach.title'
                )}
              </h2>
            </div>
            <div className='space-y-4'>
              <div className='bg-gradient-to-r from-red-500/10 to-pink-500/10 p-4 rounded-lg border border-red-500/20'>
                <h3 className='text-lg font-semibold text-red-300 mb-2 flex items-center'>
                  <FaCheckCircle className='w-4 h-4 mr-2' />
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.dataBreach.seventyTwoHour.title'
                  )}
                </h3>
                <p className='text-cosmic-200'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.dataBreach.seventyTwoHour.content'
                  )}
                </p>
              </div>
              <div className='bg-gradient-to-r from-orange-500/10 to-yellow-500/10 p-4 rounded-lg border border-orange-500/20'>
                <h3 className='text-lg font-semibold text-orange-300 mb-2 flex items-center'>
                  <FaUserShield className='w-4 h-4 mr-2' />
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.dataBreach.userNotification.title'
                  )}
                </h3>
                <p className='text-cosmic-200'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.dataBreach.userNotification.content'
                  )}
                </p>
              </div>
            </div>
          </section>

          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg'>
                <FaUserShield className='w-5 h-5 text-purple-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.userRights.title'
                )}
              </h2>
            </div>
            <p className='text-cosmic-200 leading-relaxed mb-6'>
              {t(
                'blog.footer.legalPages.privacyPolicy.sections.userRights.content'
              )}
            </p>
            <div className='grid md:grid-cols-2 gap-4 mb-6'>
              <div className='bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20'>
                <h3 className='text-lg font-semibold text-green-300 mb-2 flex items-center'>
                  <FaCheckCircle className='w-4 h-4 mr-2' />
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.userRights.basicRights.title'
                  )}
                </h3>
                <ul className='text-cosmic-200 space-y-1'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.userRights.basicRights.rights',
                    ''
                  )
                    .split(',')
                    .map((right, index) => (
                      <li key={index}>• {right.trim()}</li>
                    ))}
                </ul>
              </div>
              <div className='bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20'>
                <h3 className='text-lg font-semibold text-blue-300 mb-2 flex items-center'>
                  <FaShieldAlt className='w-4 h-4 mr-2' />
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.userRights.advancedRights.title'
                  )}
                </h3>
                <ul className='text-cosmic-200 space-y-1'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.userRights.advancedRights.rights',
                    ''
                  )
                    .split(',')
                    .map((right, index) => (
                      <li key={index}>• {right.trim()}</li>
                    ))}
                </ul>
              </div>
            </div>
            <div className='bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-4 rounded-lg border border-purple-500/20'>
              <p className='text-cosmic-200'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.userRights.application'
                )}
              </p>
            </div>
          </section>

          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg'>
                <FaDatabase className='w-5 h-5 text-purple-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.internationalTransfers.title'
                )}
              </h2>
            </div>
            <div className='space-y-4'>
              <div className='bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20'>
                <h3 className='text-lg font-semibold text-blue-300 mb-2 flex items-center'>
                  <FaCheckCircle className='w-4 h-4 mr-2' />
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.internationalTransfers.azlpApproval.title'
                  )}
                </h3>
                <p className='text-cosmic-200'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.internationalTransfers.azlpApproval.content'
                  )}
                </p>
              </div>
              <div className='bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20'>
                <h3 className='text-lg font-semibold text-green-300 mb-2 flex items-center'>
                  <FaShieldAlt className='w-4 h-4 mr-2' />
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.internationalTransfers.exceptions.title'
                  )}
                </h3>
                <p className='text-cosmic-200'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.internationalTransfers.exceptions.content'
                  )}
                </p>
              </div>
            </div>
          </section>

          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg'>
                <FaLock className='w-5 h-5 text-purple-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.dataRetention.title'
                )}
              </h2>
            </div>
            <div className='bg-gradient-to-r from-red-500/10 to-pink-500/10 p-4 rounded-lg border border-red-500/20'>
              <p className='text-cosmic-200'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.dataRetention.content'
                )}
              </p>
            </div>
          </section>

          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg'>
                <FaEye className='w-5 h-5 text-purple-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.cookies.title'
                )}
              </h2>
            </div>
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20'>
                <h3 className='text-lg font-semibold text-blue-300 mb-2 flex items-center'>
                  <FaCheckCircle className='w-4 h-4 mr-2' />
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.cookies.cookiePreferences.title'
                  )}
                </h3>
                <p className='text-cosmic-200 text-sm'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.cookies.cookiePreferences.content'
                  )}
                </p>
              </div>
              <div className='bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20'>
                <h3 className='text-lg font-semibold text-green-300 mb-2 flex items-center'>
                  <FaShieldAlt className='w-4 h-4 mr-2' />
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.cookies.information.title'
                  )}
                </h3>
                <p className='text-cosmic-200 text-sm'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.cookies.information.content'
                  )}
                </p>
              </div>
            </div>
          </section>

          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg'>
                <FaCheckCircle className='w-5 h-5 text-purple-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.changes.title'
                )}
              </h2>
            </div>
            <div className='bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20'>
              <p className='text-cosmic-200'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.changes.content'
                )}
              </p>
            </div>
          </section>

          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg'>
                <FaUserShield className='w-5 h-5 text-purple-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.contact.title'
                )}
              </h2>
            </div>
            <div className='bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-6 rounded-lg border border-purple-500/20'>
              <div className='grid md:grid-cols-3 gap-6'>
                <div className='text-center'>
                  <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                    <FaUserShield className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='text-lg font-semibold text-blue-300 mb-2'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.contact.email.title'
                    )}
                  </h3>
                  <a
                    href='mailto:info@busbuskinki.com'
                    className='text-golden-400 hover:text-golden-300 underline transition-colors'
                  >
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.contact.email.address'
                    )}
                  </a>
                </div>
                <div className='text-center'>
                  <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                    <FaShieldAlt className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='text-lg font-semibold text-green-300 mb-2'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.contact.address.title'
                    )}
                  </h3>
                  <p className='text-cosmic-200'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.contact.address.location'
                    )}
                  </p>
                </div>
                <div className='text-center'>
                  <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                    <FaGavel className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='text-lg font-semibold text-purple-300 mb-2'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.contact.dataController.title'
                    )}
                  </h3>
                  <p className='text-cosmic-200 text-sm'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.contact.dataController.name'
                    )}
                  </p>
                  <p className='text-cosmic-200 text-sm'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.contact.dataController.registration'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className='card p-6 hover-lift border-2 border-blue-500/30'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg'>
                <FaShieldAlt className='w-5 h-5 text-blue-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.title'
                )}
              </h2>
            </div>
            <p className='text-cosmic-200 leading-relaxed mb-6'>
              {t(
                'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.intro'
              )}
            </p>

            {/* Erişilen Veriler */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold text-golden-300 mb-3 flex items-center'>
                <FaDatabase className='w-5 h-5 mr-2' />
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.accessedData.title'
                )}
              </h3>
              <p className='text-cosmic-200 mb-4'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.accessedData.description'
                )}
              </p>
              <div className='space-y-3'>
                <div className='bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20'>
                  <h4 className='text-lg font-semibold text-blue-300 mb-2'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.accessedData.items.email.title'
                    )}
                  </h4>
                  <p className='text-cosmic-200 text-sm'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.accessedData.items.email.description'
                    )}
                  </p>
                </div>
                <div className='bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-4 rounded-lg border border-purple-500/20'>
                  <h4 className='text-lg font-semibold text-purple-300 mb-2'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.accessedData.items.profile.title'
                    )}
                  </h4>
                  <p className='text-cosmic-200 text-sm'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.accessedData.items.profile.description'
                    )}
                  </p>
                </div>
                <div className='bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20'>
                  <h4 className='text-lg font-semibold text-green-300 mb-2'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.accessedData.items.userId.title'
                    )}
                  </h4>
                  <p className='text-cosmic-200 text-sm'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.accessedData.items.userId.description'
                    )}
                  </p>
                </div>
              </div>
              <div className='mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20'>
                <p className='text-cosmic-200 text-sm'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.accessedData.scope'
                  )}
                </p>
              </div>
            </div>

            {/* Veri Kullanımı */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold text-golden-300 mb-3 flex items-center'>
                <FaCheckCircle className='w-5 h-5 mr-2' />
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataUsage.title'
                )}
              </h3>
              <p className='text-cosmic-200 mb-4'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataUsage.description'
                )}
              </p>
              <div className='grid md:grid-cols-2 gap-4 mb-4'>
                <div className='bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20'>
                  <h4 className='text-lg font-semibold text-blue-300 mb-2'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataUsage.purposes.authentication.title'
                    )}
                  </h4>
                  <p className='text-cosmic-200 text-sm'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataUsage.purposes.authentication.description'
                    )}
                  </p>
                </div>
                <div className='bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-4 rounded-lg border border-purple-500/20'>
                  <h4 className='text-lg font-semibold text-purple-300 mb-2'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataUsage.purposes.personalization.title'
                    )}
                  </h4>
                  <p className='text-cosmic-200 text-sm'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataUsage.purposes.personalization.description'
                    )}
                  </p>
                </div>
                <div className='bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20'>
                  <h4 className='text-lg font-semibold text-green-300 mb-2'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataUsage.purposes.communication.title'
                    )}
                  </h4>
                  <p className='text-cosmic-200 text-sm'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataUsage.purposes.communication.description'
                    )}
                  </p>
                </div>
                <div className='bg-gradient-to-r from-orange-500/10 to-yellow-500/10 p-4 rounded-lg border border-orange-500/20'>
                  <h4 className='text-lg font-semibold text-orange-300 mb-2'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataUsage.purposes.serviceProvision.title'
                    )}
                  </h4>
                  <p className='text-cosmic-200 text-sm'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataUsage.purposes.serviceProvision.description'
                    )}
                  </p>
                </div>
              </div>
              <div className='p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg border border-red-500/20'>
                <p className='text-cosmic-200 font-semibold'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataUsage.noCommercialUse'
                  )}
                </p>
              </div>
            </div>

            {/* Veri Depolama ve Güvenlik */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold text-golden-300 mb-3 flex items-center'>
                <FaLock className='w-5 h-5 mr-2' />
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataStorage.title'
                )}
              </h3>
              <p className='text-cosmic-200 mb-4'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataStorage.description'
                )}
              </p>
              <div className='grid md:grid-cols-2 gap-4 mb-4'>
                <div className='bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20'>
                  <p className='text-cosmic-200'>
                    <FaCheckCircle className='inline w-4 h-4 mr-2 text-green-300' />
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataStorage.security.encryption'
                    )}
                  </p>
                </div>
                <div className='bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20'>
                  <p className='text-cosmic-200'>
                    <FaCheckCircle className='inline w-4 h-4 mr-2 text-blue-300' />
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataStorage.security.access'
                    )}
                  </p>
                </div>
                <div className='bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-4 rounded-lg border border-purple-500/20'>
                  <p className='text-cosmic-200'>
                    <FaCheckCircle className='inline w-4 h-4 mr-2 text-purple-300' />
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataStorage.security.protection'
                    )}
                  </p>
                </div>
                <div className='bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-4 rounded-lg border border-yellow-500/20'>
                  <p className='text-cosmic-200'>
                    <FaCheckCircle className='inline w-4 h-4 mr-2 text-yellow-300' />
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataStorage.security.infrastructure'
                    )}
                  </p>
                </div>
              </div>
              <div className='p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20'>
                <p className='text-cosmic-200'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataStorage.retention'
                  )}
                </p>
              </div>
            </div>

            {/* Üçüncü Taraf Veri Paylaşımı */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold text-golden-300 mb-3 flex items-center'>
                <FaUserShield className='w-5 h-5 mr-2' />
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataSharing.title'
                )}
              </h3>
              <p className='text-cosmic-200 mb-4'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataSharing.description'
                )}
              </p>
              <div className='space-y-3'>
                <div className='bg-gradient-to-r from-red-500/10 to-pink-500/10 p-4 rounded-lg border border-red-500/20'>
                  <p className='text-cosmic-200'>
                    <strong className='text-red-300'>
                      {
                        t(
                          'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataSharing.exceptions.legal'
                        ).split(':')[0]
                      }
                      :
                    </strong>{' '}
                    {
                      t(
                        'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataSharing.exceptions.legal'
                      ).split(':')[1]
                    }
                  </p>
                </div>
                <div className='bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20'>
                  <p className='text-cosmic-200'>
                    <strong className='text-green-300'>
                      {
                        t(
                          'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataSharing.exceptions.consent'
                        ).split(':')[0]
                      }
                      :
                    </strong>{' '}
                    {
                      t(
                        'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataSharing.exceptions.consent'
                      ).split(':')[1]
                    }
                  </p>
                </div>
                <div className='bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20'>
                  <p className='text-cosmic-200'>
                    <strong className='text-blue-300'>
                      {
                        t(
                          'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataSharing.exceptions.serviceProviders'
                        ).split(':')[0]
                      }
                      :
                    </strong>{' '}
                    {
                      t(
                        'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.dataSharing.exceptions.serviceProviders'
                      ).split(':')[1]
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Kullanıcı Hakları */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold text-golden-300 mb-3 flex items-center'>
                <FaCheckCircle className='w-5 h-5 mr-2' />
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.userRights.title'
                )}
              </h3>
              <p className='text-cosmic-200 mb-4'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.userRights.description'
                )}
              </p>
              <div className='grid md:grid-cols-2 gap-3 mb-4'>
                <div className='bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-3 rounded-lg border border-purple-500/20'>
                  <p className='text-cosmic-200 text-sm'>
                    <FaCheckCircle className='inline w-3 h-3 mr-2 text-purple-300' />
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.userRights.rights.access'
                    )}
                  </p>
                </div>
                <div className='bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-3 rounded-lg border border-blue-500/20'>
                  <p className='text-cosmic-200 text-sm'>
                    <FaCheckCircle className='inline w-3 h-3 mr-2 text-blue-300' />
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.userRights.rights.correction'
                    )}
                  </p>
                </div>
                <div className='bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3 rounded-lg border border-green-500/20'>
                  <p className='text-cosmic-200 text-sm'>
                    <FaCheckCircle className='inline w-3 h-3 mr-2 text-green-300' />
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.userRights.rights.deletion'
                    )}
                  </p>
                </div>
                <div className='bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-3 rounded-lg border border-yellow-500/20'>
                  <p className='text-cosmic-200 text-sm'>
                    <FaCheckCircle className='inline w-3 h-3 mr-2 text-yellow-300' />
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.userRights.rights.revoke'
                    )}
                  </p>
                </div>
                <div className='bg-gradient-to-r from-red-500/10 to-pink-500/10 p-3 rounded-lg border border-red-500/20'>
                  <p className='text-cosmic-200 text-sm'>
                    <FaCheckCircle className='inline w-3 h-3 mr-2 text-red-300' />
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.userRights.rights.export'
                    )}
                  </p>
                </div>
              </div>
              <div className='p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg border border-indigo-500/20'>
                <p className='text-cosmic-200 text-sm'>
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.userRights.contact'
                  )}
                </p>
              </div>
            </div>

            {/* Google API Uyumluluğu */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold text-golden-300 mb-3 flex items-center'>
                <FaGavel className='w-5 h-5 mr-2' />
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.googleCompliance.title'
                )}
              </h3>
              <p className='text-cosmic-200 mb-4'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.googleCompliance.description'
                )}
              </p>
              <div className='space-y-3 mb-4'>
                <div className='flex items-start space-x-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20'>
                  <FaCheckCircle className='w-5 h-5 text-green-300 flex-shrink-0 mt-1' />
                  <p className='text-cosmic-200'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.googleCompliance.policies.limitedUse'
                    )}
                  </p>
                </div>
                <div className='flex items-start space-x-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20'>
                  <FaCheckCircle className='w-5 h-5 text-blue-300 flex-shrink-0 mt-1' />
                  <p className='text-cosmic-200'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.googleCompliance.policies.noSale'
                    )}
                  </p>
                </div>
                <div className='flex items-start space-x-3 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-4 rounded-lg border border-purple-500/20'>
                  <FaCheckCircle className='w-5 h-5 text-purple-300 flex-shrink-0 mt-1' />
                  <p className='text-cosmic-200'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.googleCompliance.policies.noAdvertising'
                    )}
                  </p>
                </div>
                <div className='flex items-start space-x-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-4 rounded-lg border border-yellow-500/20'>
                  <FaCheckCircle className='w-5 h-5 text-yellow-300 flex-shrink-0 mt-1' />
                  <p className='text-cosmic-200'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.googleCompliance.policies.humanReview'
                    )}
                  </p>
                </div>
                <div className='flex items-start space-x-3 bg-gradient-to-r from-red-500/10 to-pink-500/10 p-4 rounded-lg border border-red-500/20'>
                  <FaCheckCircle className='w-5 h-5 text-red-300 flex-shrink-0 mt-1' />
                  <p className='text-cosmic-200'>
                    {t(
                      'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.googleCompliance.policies.secureTransfer'
                    )}
                  </p>
                </div>
              </div>
              <div className='bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 rounded-lg border border-indigo-500/20'>
                <p className='text-cosmic-200 text-sm mb-2'>
                  <strong className='text-golden-300'>
                    {
                      t(
                        'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.googleCompliance.policies.limitedUse'
                      ).split(':')[0]
                    }
                    :
                  </strong>
                </p>
                <a
                  href='https://developers.google.com/terms/api-services-user-data-policy'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-300 hover:text-blue-200 underline block mb-1'
                >
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.googleCompliance.links.userDataPolicy'
                  )}
                </a>
                <a
                  href='https://developers.google.com/terms'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-300 hover:text-blue-200 underline block'
                >
                  {t(
                    'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.googleCompliance.links.termsOfService'
                  )}
                </a>
              </div>
            </div>

            {/* Güncellemeler */}
            <div className='p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20'>
              <p className='text-cosmic-200 text-sm italic'>
                {t(
                  'blog.footer.legalPages.privacyPolicy.sections.googleOAuth.updates'
                )}
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
// Burada backend'e bağlanılacak alanlar için ileride entegrasyon notu eklenebilir.
