// Bu dosya, İçerik Moderasyon Politikası sayfasını oluşturur.
// AdSense uyumlu moderasyon kuralları, kullanıcı yorumları politikaları ve şikayet sürecini içerir.
// Mistik tarot temasına uygun, i18n destekli, modern ve profesyonel bir arayüz sunar.

'use client';

import React from 'react';
import {
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBan,
  FaFlag,
  FaUserShield,
} from 'react-icons/fa';
import BottomNavigation from '@/features/shared/layout/BottomNavigation';
import { useTranslations } from '@/hooks/useTranslations';

export default function ModerationPolicy() {
  const { t } = useTranslations();

  return (
    <div className='min-h-screen bg-cosmic-black'>
      {/* Mystical Background Effects */}
      <div className='absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-purple-800/20'></div>
      <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent'></div>

      <main className='relative z-10 max-w-4xl mx-auto px-4 py-12'>
        {/* Header Section */}
        <section className='mb-12 text-center'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full mb-6 backdrop-blur-sm border border-purple-500/30'>
            <FaShieldAlt className='w-10 h-10 text-purple-300' />
          </div>
          <h1 className='text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-golden-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent'>
            {t(
              'footer.legalPages.moderationPolicy.title',
              'İçerik Moderasyon Politikası'
            )}
          </h1>
          <p className='text-cosmic-300 max-w-2xl mx-auto leading-relaxed'>
            {t(
              'footer.legalPages.moderationPolicy.subtitle',
              'Güvenli ve saygılı bir topluluk oluşturmak için içerik standartlarımız'
            )}
          </p>
        </section>

        {/* Content Sections */}
        <div className='space-y-8'>
          {/* Our Commitment */}
          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg'>
                <FaUserShield className='w-5 h-5 text-purple-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'footer.legalPages.moderationPolicy.commitment.title',
                  'Taahhüdümüz'
                )}
              </h2>
            </div>
            <div className='text-cosmic-200 leading-relaxed space-y-3'>
              <p>
                {t(
                  'footer.legalPages.moderationPolicy.commitment.content1',
                  'Büşbüşkimki olarak, tüm kullanıcılarımız için güvenli, saygılı ve kapsayıcı bir ortam sağlamayı taahhüt ediyoruz. İçerik moderasyon politikamız, topluluk standartlarımızı korumak ve olumlu bir deneyim sunmak için tasarlanmıştır.'
                )}
              </p>
              <p>
                {t(
                  'footer.legalPages.moderationPolicy.commitment.content2',
                  'Bu politika, Google AdSense Program Politikaları ve yerel yasalara tam uyum sağlamak için oluşturulmuştur.'
                )}
              </p>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg'>
                <FaCheckCircle className='w-5 h-5 text-green-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'footer.legalPages.moderationPolicy.acceptable.title',
                  'Kabul Edilebilir Kullanım'
                )}
              </h2>
            </div>
            <div className='bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20'>
              <p className='text-cosmic-200 mb-3'>
                {t(
                  'footer.legalPages.moderationPolicy.acceptable.intro',
                  'Platformumuzda aşağıdaki içerikler ve davranışlar kabul edilebilir:'
                )}
              </p>
              <ul className='space-y-2 text-cosmic-200'>
                <li className='flex items-start gap-2'>
                  <FaCheckCircle className='w-4 h-4 text-green-400 flex-shrink-0 mt-1' />
                  <span>
                    {t(
                      'footer.legalPages.moderationPolicy.acceptable.item1',
                      'Saygılı ve yapıcı yorumlar ve tartışmalar'
                    )}
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <FaCheckCircle className='w-4 h-4 text-green-400 flex-shrink-0 mt-1' />
                  <span>
                    {t(
                      'footer.legalPages.moderationPolicy.acceptable.item2',
                      'Kişisel deneyimlerin ve düşüncelerin paylaşımı'
                    )}
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <FaCheckCircle className='w-4 h-4 text-green-400 flex-shrink-0 mt-1' />
                  <span>
                    {t(
                      'footer.legalPages.moderationPolicy.acceptable.item3',
                      'Yapıcı geri bildirim ve öneriler'
                    )}
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <FaCheckCircle className='w-4 h-4 text-green-400 flex-shrink-0 mt-1' />
                  <span>
                    {t(
                      'footer.legalPages.moderationPolicy.acceptable.item4',
                      'Eğitici ve bilgilendirici içerik paylaşımı'
                    )}
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Prohibited Content */}
          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg'>
                <FaBan className='w-5 h-5 text-red-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'footer.legalPages.moderationPolicy.prohibited.title',
                  'Yasaklı İçerik'
                )}
              </h2>
            </div>
            <div className='bg-gradient-to-r from-red-500/10 to-pink-500/10 p-4 rounded-lg border border-red-500/20'>
              <p className='text-cosmic-200 mb-3 font-medium'>
                {t(
                  'footer.legalPages.moderationPolicy.prohibited.intro',
                  'Aşağıdaki içerik türleri kesinlikle yasaktır ve kaldırılacaktır:'
                )}
              </p>
              <ul className='space-y-2 text-cosmic-200'>
                <li className='flex items-start gap-2'>
                  <FaBan className='w-4 h-4 text-red-400 flex-shrink-0 mt-1' />
                  <span>
                    {t(
                      'footer.legalPages.moderationPolicy.prohibited.item1',
                      'Nefret söylemi, ayrımcılık veya taciz içeren içerikler'
                    )}
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <FaBan className='w-4 h-4 text-red-400 flex-shrink-0 mt-1' />
                  <span>
                    {t(
                      'footer.legalPages.moderationPolicy.prohibited.item2',
                      'Pornografik, müstehcen veya cinsel içerikli materyaller'
                    )}
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <FaBan className='w-4 h-4 text-red-400 flex-shrink-0 mt-1' />
                  <span>
                    {t(
                      'footer.legalPages.moderationPolicy.prohibited.item3',
                      'Şiddet, tehdit veya zararlı davranışları teşvik eden içerikler'
                    )}
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <FaBan className='w-4 h-4 text-red-400 flex-shrink-0 mt-1' />
                  <span>
                    {t(
                      'footer.legalPages.moderationPolicy.prohibited.item4',
                      'Spam, phishing veya dolandırıcılık amaçlı içerikler'
                    )}
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <FaBan className='w-4 h-4 text-red-400 flex-shrink-0 mt-1' />
                  <span>
                    {t(
                      'footer.legalPages.moderationPolicy.prohibited.item5',
                      'Telif hakkı ihlali içeren materyaller'
                    )}
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <FaBan className='w-4 h-4 text-red-400 flex-shrink-0 mt-1' />
                  <span>
                    {t(
                      'footer.legalPages.moderationPolicy.prohibited.item6',
                      'Yasa dışı faaliyetleri teşvik eden veya bunlarla ilgili içerikler'
                    )}
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <FaBan className='w-4 h-4 text-red-400 flex-shrink-0 mt-1' />
                  <span>
                    {t(
                      'footer.legalPages.moderationPolicy.prohibited.item7',
                      'Kişisel bilgilerin izinsiz paylaşımı (doxxing)'
                    )}
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <FaBan className='w-4 h-4 text-red-400 flex-shrink-0 mt-1' />
                  <span>
                    {t(
                      'footer.legalPages.moderationPolicy.prohibited.item8',
                      'Yanıltıcı veya sahte bilgiler (misinformation)'
                    )}
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Comment Policy */}
          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg'>
                <FaExclamationTriangle className='w-5 h-5 text-blue-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'footer.legalPages.moderationPolicy.comments.title',
                  'Yorum Politikası'
                )}
              </h2>
            </div>
            <div className='text-cosmic-200 leading-relaxed space-y-3'>
              <p>
                {t(
                  'footer.legalPages.moderationPolicy.comments.content1',
                  'Kullanıcı yorumları, topluluk deneyimimizin önemli bir parçasıdır. Ancak, tüm yorumlar yayınlanmadan önce moderasyon sürecinden geçebilir.'
                )}
              </p>
              <div className='bg-purple-900/20 p-4 rounded-lg border border-purple-500/20 space-y-2'>
                <h3 className='font-bold text-purple-300 mb-2'>
                  {t(
                    'footer.legalPages.moderationPolicy.comments.guidelines',
                    'Yorum Kuralları:'
                  )}
                </h3>
                <ul className='space-y-1 text-sm'>
                  <li>
                    •{' '}
                    {t(
                      'footer.legalPages.moderationPolicy.comments.rule1',
                      'Yorumlar saygılı ve yapıcı olmalıdır'
                    )}
                  </li>
                  <li>
                    •{' '}
                    {t(
                      'footer.legalPages.moderationPolicy.comments.rule2',
                      'Kişisel saldırılar yasaktır'
                    )}
                  </li>
                  <li>
                    •{' '}
                    {t(
                      'footer.legalPages.moderationPolicy.comments.rule3',
                      'Spam veya reklam içerikli yorumlar kaldırılacaktır'
                    )}
                  </li>
                  <li>
                    •{' '}
                    {t(
                      'footer.legalPages.moderationPolicy.comments.rule4',
                      'Konuyla ilgili olmayan yorumlar moderatörler tarafından silinebilir'
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Reporting Procedure */}
          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg'>
                <FaFlag className='w-5 h-5 text-amber-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'footer.legalPages.moderationPolicy.reporting.title',
                  'Şikayet ve Bildirim Süreci'
                )}
              </h2>
            </div>
            <div className='text-cosmic-200 leading-relaxed space-y-3'>
              <p>
                {t(
                  'footer.legalPages.moderationPolicy.reporting.intro',
                  'Uygunsuz içerik gördüğünüzde, lütfen aşağıdaki adımları takip ederek bildirin:'
                )}
              </p>
              <div className='bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 rounded-lg border border-amber-500/20 space-y-3'>
                <div className='flex items-start gap-3'>
                  <div className='w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0'>
                    <span className='text-amber-300 font-bold'>1</span>
                  </div>
                  <div>
                    <h4 className='font-bold text-amber-200 mb-1'>
                      {t(
                        'footer.legalPages.moderationPolicy.reporting.step1Title',
                        'İçeriği İşaretleyin'
                      )}
                    </h4>
                    <p className='text-sm'>
                      {t(
                        'footer.legalPages.moderationPolicy.reporting.step1Content',
                        'Uygunsuz içeriğin yanındaki "Bildir" butonuna tıklayın.'
                      )}
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0'>
                    <span className='text-amber-300 font-bold'>2</span>
                  </div>
                  <div>
                    <h4 className='font-bold text-amber-200 mb-1'>
                      {t(
                        'footer.legalPages.moderationPolicy.reporting.step2Title',
                        'Neden Belirtin'
                      )}
                    </h4>
                    <p className='text-sm'>
                      {t(
                        'footer.legalPages.moderationPolicy.reporting.step2Content',
                        'İçeriğin neden uygunsuz olduğunu açıklayan bir kategori seçin.'
                      )}
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0'>
                    <span className='text-amber-300 font-bold'>3</span>
                  </div>
                  <div>
                    <h4 className='font-bold text-amber-200 mb-1'>
                      {t(
                        'footer.legalPages.moderationPolicy.reporting.step3Title',
                        'İnceleme Süreci'
                      )}
                    </h4>
                    <p className='text-sm'>
                      {t(
                        'footer.legalPages.moderationPolicy.reporting.step3Content',
                        'Moderasyon ekibimiz 24-48 saat içinde şikayetinizi inceleyecektir.'
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <p className='text-sm text-cosmic-300'>
                {t(
                  'footer.legalPages.moderationPolicy.reporting.contact',
                  'Acil durumlar veya ciddi ihlaller için: info@busbuskimki.com'
                )}
              </p>
            </div>
          </section>

          {/* Enforcement */}
          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg'>
                <FaShieldAlt className='w-5 h-5 text-purple-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t(
                  'footer.legalPages.moderationPolicy.enforcement.title',
                  'Yaptırımlar'
                )}
              </h2>
            </div>
            <div className='text-cosmic-200 leading-relaxed space-y-3'>
              <p>
                {t(
                  'footer.legalPages.moderationPolicy.enforcement.intro',
                  'Moderasyon politikasını ihlal eden kullanıcılara aşağıdaki yaptırımlar uygulanabilir:'
                )}
              </p>
              <ul className='space-y-2'>
                <li className='flex items-start gap-2'>
                  <span className='text-purple-400'>•</span>
                  <span>
                    <strong className='text-purple-300'>
                      {t(
                        'footer.legalPages.moderationPolicy.enforcement.warning',
                        'Uyarı:'
                      )}
                    </strong>{' '}
                    {t(
                      'footer.legalPages.moderationPolicy.enforcement.warningDesc',
                      'İlk ihlallerde resmi uyarı'
                    )}
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-purple-400'>•</span>
                  <span>
                    <strong className='text-purple-300'>
                      {t(
                        'footer.legalPages.moderationPolicy.enforcement.suspension',
                        'Geçici Askıya Alma:'
                      )}
                    </strong>{' '}
                    {t(
                      'footer.legalPages.moderationPolicy.enforcement.suspensionDesc',
                      'Tekrarlanan ihlallerde hesap geçici olarak askıya alınır'
                    )}
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-purple-400'>•</span>
                  <span>
                    <strong className='text-purple-300'>
                      {t(
                        'footer.legalPages.moderationPolicy.enforcement.ban',
                        'Kalıcı Yasaklama:'
                      )}
                    </strong>{' '}
                    {t(
                      'footer.legalPages.moderationPolicy.enforcement.banDesc',
                      'Ciddi veya sürekli ihlallerde hesap kalıcı olarak kapatılır'
                    )}
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Updates */}
          <section className='card p-6 hover-lift'>
            <div className='text-cosmic-200 text-sm leading-relaxed space-y-2'>
              <p>
                <strong className='text-golden-300'>
                  {t(
                    'footer.legalPages.moderationPolicy.updates.title',
                    'Politika Güncellemeleri:'
                  )}
                </strong>{' '}
                {t(
                  'footer.legalPages.moderationPolicy.updates.content',
                  'Bu moderasyon politikası, gerektiğinde güncellenebilir. Önemli değişiklikler kullanıcılara bildirilecektir.'
                )}
              </p>
              <p className='text-cosmic-300'>
                {t(
                  'footer.legalPages.moderationPolicy.updates.lastUpdate',
                  'Son güncelleme: 29 Ekim 2025'
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
