'use client';

import { useState } from 'react';
import { CardContent } from '@/types/tarot-cards';

interface CardCTAProps {
  content: CardContent;
  locale: 'tr' | 'en' | 'sr';
}

export function CardCTA({ content, locale }: CardCTAProps) {
  const { cta } = content;
  const [isSaved, setIsSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Track clicks (gelecekte Google Analytics/Plausible entegrasyonu)
  const trackClick = (action: string, label: string) => {
    console.log(`📊 Analytics Event: ${action} - ${label}`);
    // TODO: await analytics.track(action, { label, cardId: content.cardId });
  };

  // Kartı kaydet (localStorage)
  const handleSaveCard = () => {
    const savedCards = JSON.parse(
      localStorage.getItem('savedCards') || '[]'
    );
    
    if (isSaved) {
      // Kaldır
      const filtered = savedCards.filter((id: string) => id !== content.cardId);
      localStorage.setItem('savedCards', JSON.stringify(filtered));
      setIsSaved(false);
      trackClick('card_unsaved', content.name);
    } else {
      // Ekle
      savedCards.push(content.cardId);
      localStorage.setItem('savedCards', JSON.stringify(savedCards));
      setIsSaved(true);
      trackClick('card_saved', content.name);
    }
  };

  // Paylaşım fonksiyonları
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `${content.name} Tarot Kartı - Büşbüşkimki`;

  const shareOnTwitter = () => {
    trackClick('share_twitter', content.name);
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareTitle
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnFacebook = () => {
    trackClick('share_facebook', content.name);
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    trackClick('share_whatsapp', content.name);
    const url = `https://wa.me/?text=${encodeURIComponent(
      `${shareTitle} ${shareUrl}`
    )}`;
    window.open(url, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      trackClick('share_copy_link', content.name);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Default CTA metinleri - eğer JSON'da yoksa
  const defaultCTA = {
    main:
      locale === 'tr'
        ? 'Kartınızı Çekin ve Keşfedin'
        : locale === 'en'
          ? 'Draw Your Card and Discover'
          : 'Izvuci Svoju Kartu i Otkrij',
    micro:
      locale === 'tr'
        ? 'Ücretsiz tarot okuması ile kendi kartlarınızı çekin ve geleceğinizi keşfedin'
        : locale === 'en'
          ? 'Draw your own cards with a free tarot reading and discover your future'
          : 'Izvuci svoje karte besplatnim tarot čitanjem i otkrij svoju budućnost',
  };

  const ctaMain = cta?.main || defaultCTA.main;
  const ctaMicro = cta?.micro || defaultCTA.micro;

  const getSaveText = () => {
    if (isSaved) {
      return locale === 'tr' ? 'Kaydedildi' : locale === 'en' ? 'Saved' : 'Sačuvano';
    }
    return locale === 'tr' ? 'Kartı Kaydet' : locale === 'en' ? 'Save Card' : 'Sačuvaj Kartu';
  };

  const getShareText = () => {
    return locale === 'tr' ? 'Paylaş' : locale === 'en' ? 'Share' : 'Podeli';
  };

  return (
    <section className='py-16 px-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white'>
      <div className='max-w-4xl mx-auto'>
        {/* Save & Share Buttons */}
        <div className='flex justify-center gap-4 mb-8'>
          {/* Save Button */}
          <button
            onClick={handleSaveCard}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 ${
              isSaved
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
            }`}
          >
            <svg
              className='w-5 h-5'
              fill={isSaved ? 'currentColor' : 'none'}
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
              />
            </svg>
            {getSaveText()}
          </button>

          {/* Share Button */}
          <div className='relative'>
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className='px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
                />
              </svg>
              {getShareText()}
            </button>

            {/* Share Menu */}
            {showShareMenu && (
              <div className='absolute top-full mt-2 right-0 bg-white text-gray-900 rounded-lg shadow-2xl p-2 min-w-[200px] z-10'>
                <button
                  onClick={shareOnTwitter}
                  className='w-full px-4 py-2 hover:bg-blue-50 rounded-md flex items-center gap-3 transition-colors'
                >
                  <svg className='w-5 h-5 text-blue-400' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
                  </svg>
                  Twitter
                </button>
                <button
                  onClick={shareOnFacebook}
                  className='w-full px-4 py-2 hover:bg-blue-50 rounded-md flex items-center gap-3 transition-colors'
                >
                  <svg className='w-5 h-5 text-blue-600' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                  </svg>
                  Facebook
                </button>
                <button
                  onClick={shareOnWhatsApp}
                  className='w-full px-4 py-2 hover:bg-green-50 rounded-md flex items-center gap-3 transition-colors'
                >
                  <svg className='w-5 h-5 text-green-600' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
                  </svg>
                  WhatsApp
                </button>
                <button
                  onClick={copyLink}
                  className='w-full px-4 py-2 hover:bg-gray-50 rounded-md flex items-center gap-3 transition-colors'
                >
                  <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
                  </svg>
                  {copySuccess
                    ? (locale === 'tr' ? 'Kopyalandı!' : locale === 'en' ? 'Copied!' : 'Kopirano!')
                    : (locale === 'tr' ? 'Linki Kopyala' : locale === 'en' ? 'Copy Link' : 'Kopiraj Link')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Original CTA Content */}
        <div className='text-center'>
          {/* CTA Header - Karttan gelen özel CTA metinleri veya default */}
          <div className='mb-8'>
            <h3 className='text-3xl lg:text-4xl font-bold mb-4'>{ctaMain}</h3>
            <p className='text-xl text-purple-200 max-w-2xl mx-auto'>
              {ctaMicro}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            {/* Free Reading Button */}
            <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20'>
              <div className='w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-3xl'>🔮</span>
              </div>
              <h4 className='text-xl font-bold mb-3'>
                {locale === 'tr'
                  ? 'Ücretsiz Tarot Okuması'
                  : locale === 'en'
                    ? 'Free Tarot Reading'
                    : 'Besplatno Tarot Čitanje'}
              </h4>
              <p className='text-purple-200 mb-4'>
                {locale === 'tr'
                  ? '3 kart açılımı ile geleceğinizi keşfedin'
                  : locale === 'en'
                    ? 'Discover your future with a 3-card spread'
                    : 'Otkrij svoju budućnost sa 3-kartnim rasporedom'}
              </p>
              <a
                href={`/${locale}/tarotokumasi`}
                onClick={() => trackClick('cta_free_reading', 'Free Tarot Reading')}
                className='inline-flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl'
              >
                {locale === 'tr'
                  ? 'Hemen Başla'
                  : locale === 'en'
                    ? 'Start Now'
                    : 'Počni Sada'}
                <svg
                  className='w-5 h-5 ml-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 7l5 5m0 0l-5 5m5-5H6'
                  />
                </svg>
              </a>
            </div>

            {/* Love Reading Button */}
            <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20'>
              <div className='w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-3xl'>💕</span>
              </div>
              <h4 className='text-xl font-bold mb-3'>
                {locale === 'tr'
                  ? 'Aşk Tarot Okuması'
                  : locale === 'en'
                    ? 'Love Tarot Reading'
                    : 'Ljubavno Tarot Čitanje'}
              </h4>
              <p className='text-purple-200 mb-4'>
                {locale === 'tr'
                  ? 'Aşk hayatınız hakkında özel yorumlar'
                  : locale === 'en'
                    ? 'Special insights about your love life'
                    : 'Posebni uvid u vaš ljubavni život'}
              </p>
              <a
                href={`/${locale}/tarotokumasi`}
                onClick={() => trackClick('cta_love_reading', 'Love Tarot Reading')}
                className='inline-flex items-center px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl'
              >
                {locale === 'tr'
                  ? 'Aşk Okuması'
                  : locale === 'en'
                    ? 'Love Reading'
                    : 'Ljubavno Čitanje'}
                <svg
                  className='w-5 h-5 ml-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 7l5 5m0 0l-5 5m5-5H6'
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Additional Features */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='text-center'>
              <div className='w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-2xl'>✓</span>
              </div>
              <h5 className='font-semibold mb-2'>
                {locale === 'tr'
                  ? 'Ücretsiz'
                  : locale === 'en'
                    ? 'Free'
                    : 'Besplatno'}
              </h5>
              <p className='text-sm text-purple-200'>
                {locale === 'tr'
                  ? 'Hiçbir ücret yok'
                  : locale === 'en'
                    ? 'No cost'
                    : 'Bez troškova'}
              </p>
            </div>

            <div className='text-center'>
              <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-2xl'>⚡</span>
              </div>
              <h5 className='font-semibold mb-2'>
                {locale === 'tr' ? 'Hızlı' : locale === 'en' ? 'Fast' : 'Brzo'}
              </h5>
              <p className='text-sm text-purple-200'>
                {locale === 'tr'
                  ? 'Anında sonuç'
                  : locale === 'en'
                    ? 'Instant results'
                    : 'Trenutni rezultati'}
              </p>
            </div>

            <div className='text-center'>
              <div className='w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-2xl'>🔒</span>
              </div>
              <h5 className='font-semibold mb-2'>
                {locale === 'tr'
                  ? 'Gizli'
                  : locale === 'en'
                    ? 'Private'
                    : 'Privatno'}
              </h5>
              <p className='text-sm text-purple-200'>
                {locale === 'tr'
                  ? 'Kişisel gizlilik'
                  : locale === 'en'
                    ? 'Personal privacy'
                    : 'Lična privatnost'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
