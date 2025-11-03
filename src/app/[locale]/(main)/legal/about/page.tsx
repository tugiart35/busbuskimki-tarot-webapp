'use client';

import React from 'react';
import {
  FaHeart,
  FaEye,
  FaStar,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaLightbulb,
  FaGem,
  FaHandsHelping,
  FaUniversalAccess,
  FaUsers,
  FaGraduationCap,
} from 'react-icons/fa';
import BottomNavigation from '@/features/shared/layout/BottomNavigation';
import { useTranslations } from '@/hooks/useTranslations';

export default function About() {
  const { t } = useTranslations();

  return (
    <div className='min-h-screen bg-cosmic-black'>
      {/* Mystical Background Effects */}
      <div className='absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-purple-800/20'></div>
      <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent'></div>

      <main className='relative z-10 max-w-5xl mx-auto px-4 py-12 sm:py-16'>
        {/* Hero Section */}
        <section className='mb-16 text-center'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full mb-6 backdrop-blur-sm border border-purple-500/30 animate-pulse'>
            <FaStar className='w-10 h-10 text-purple-300' />
          </div>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-golden-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent'>
            {t('aboutPage.hero.title')}
          </h1>
          <p className='text-lg md:text-xl text-cosmic-300 max-w-3xl mx-auto leading-relaxed'>
            {t('aboutPage.hero.subtitle')}
          </p>
        </section>

        {/* Educational Notice - ADSENSE UYUMLU */}
        <section className='mb-12'>
          <div className='card p-6 md:p-8 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-amber-500/30'>
            <div className='flex items-start space-x-4'>
              <div className='text-4xl flex-shrink-0'>
                {t('aboutPage.educationalNote.icon')}
              </div>
              <div>
                <h2 className='text-2xl font-bold text-amber-300 mb-3'>
                  {t('aboutPage.educationalNote.title')}
                </h2>
                <p className='text-cosmic-200 leading-relaxed text-base md:text-lg'>
                  {t('aboutPage.educationalNote.content')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Grid */}
        <div className='grid md:grid-cols-2 gap-8 mb-12'>
          {/* Mission */}
          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg'>
                <FaHeart className='w-6 h-6 text-purple-300' />
              </div>
              <h2 className='text-2xl md:text-3xl font-bold text-golden-300'>
                {t('aboutPage.mission.title')}
              </h2>
            </div>
            <p className='text-cosmic-200 leading-relaxed'>
              {t('aboutPage.mission.content')}
            </p>
          </section>

          {/* Vision */}
          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg'>
                <FaEye className='w-6 h-6 text-indigo-300' />
              </div>
              <h2 className='text-2xl md:text-3xl font-bold text-golden-300'>
                {t('aboutPage.vision.title')}
              </h2>
            </div>
            <p className='text-cosmic-200 leading-relaxed'>
              {t('aboutPage.vision.content')}
            </p>
          </section>
        </div>

        {/* Values Section */}
        <section className='mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent'>
            {t('aboutPage.values.title')}
          </h2>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {/* Education */}
            <div className='card p-6 text-center hover-lift'>
              <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FaGraduationCap className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-lg font-semibold text-blue-300 mb-2'>
                {t('aboutPage.values.education.title')}
              </h3>
              <p className='text-sm text-cosmic-200'>
                {t('aboutPage.values.education.description')}
              </p>
            </div>

            {/* Transparency */}
            <div className='card p-6 text-center hover-lift'>
              <div className='w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FaLightbulb className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-lg font-semibold text-emerald-300 mb-2'>
                {t('aboutPage.values.transparency.title')}
              </h3>
              <p className='text-sm text-cosmic-200'>
                {t('aboutPage.values.transparency.description')}
              </p>
            </div>

            {/* Quality */}
            <div className='card p-6 text-center hover-lift'>
              <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FaGem className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-lg font-semibold text-purple-300 mb-2'>
                {t('aboutPage.values.quality.title')}
              </h3>
              <p className='text-sm text-cosmic-200'>
                {t('aboutPage.values.quality.description')}
              </p>
            </div>

            {/* Accessibility */}
            <div className='card p-6 text-center hover-lift'>
              <div className='w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FaUniversalAccess className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-lg font-semibold text-orange-300 mb-2'>
                {t('aboutPage.values.accessibility.title')}
              </h3>
              <p className='text-sm text-cosmic-200'>
                {t('aboutPage.values.accessibility.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Platform Info */}
        <section className='mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-golden-400 to-amber-300 bg-clip-text text-transparent'>
            {t('aboutPage.platform.title')}
          </h2>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='card p-6 text-center'>
              <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FaShieldAlt className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-lg font-semibold text-purple-300 mb-2'>Platform</h3>
              <p className='text-cosmic-200'>{t('aboutPage.platform.name')}</p>
            </div>

            <div className='card p-6 text-center'>
              <div className='w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FaMapMarkerAlt className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-lg font-semibold text-green-300 mb-2'>
                Location
              </h3>
              <p className='text-cosmic-200'>{t('aboutPage.platform.location')}</p>
            </div>

            <div className='card p-6 text-center'>
              <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FaEnvelope className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-lg font-semibold text-blue-300 mb-2'>
                {t('aboutPage.contact.title')}
              </h3>
              <a
                href={`mailto:${t('aboutPage.platform.email')}`}
                className='text-golden-400 hover:text-golden-300 underline transition-colors text-sm'
              >
                {t('aboutPage.platform.email')}
              </a>
            </div>

            <div className='card p-6 text-center'>
              <div className='w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FaStar className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-lg font-semibold text-amber-300 mb-2'>
                Established
              </h3>
              <p className='text-cosmic-200'>{t('aboutPage.platform.established')}</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className='mb-12'>
          <div className='card p-8 bg-gradient-to-r from-purple-500/10 to-indigo-500/10'>
            <div className='flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6'>
              <div className='p-4 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full'>
                <FaUsers className='w-12 h-12 text-purple-300' />
              </div>
              <div className='text-center md:text-left'>
                <h2 className='text-2xl md:text-3xl font-bold text-golden-300 mb-3'>
                  {t('aboutPage.team.title')}
                </h2>
                <p className='text-cosmic-200 leading-relaxed'>
                  {t('aboutPage.team.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className='text-center'>
          <div className='card p-8 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-2 border-purple-500/30'>
            <FaHandsHelping className='w-16 h-16 text-purple-300 mx-auto mb-4' />
            <h2 className='text-2xl md:text-3xl font-bold text-golden-300 mb-3'>
              {t('aboutPage.contact.title')}
            </h2>
            <p className='text-cosmic-200 mb-6 max-w-2xl mx-auto'>
              {t('aboutPage.contact.description')}
            </p>
            <a
              href={`mailto:${t('aboutPage.platform.email')}`}
              className='inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-lg'
            >
              {t('aboutPage.platform.email')}
            </a>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
