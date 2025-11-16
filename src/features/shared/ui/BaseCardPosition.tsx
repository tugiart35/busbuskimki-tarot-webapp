/*
info:
Bağlantılı dosyalar:
- lib/tarot/a-tarot-helpers.ts: Tarot kartı tipi ve temel kart verileri için (gerekli)
- components/specific/tarot/3cardtarot/CardPosition.tsx: 3 kart açılımı için özel pozisyon (gerekli, BaseCardPosition'ı özelleştirerek kullanır)
- components/specific/tarot/hermit/CardPosition.tsx: Hermit açılımı için özel pozisyon (gerekli, BaseCardPosition'ı özelleştirerek kullanır)
- components/specific/tarot/Love-Spread/CardPosition.tsx: Aşk açılımı için özel pozisyon (gerekli, BaseCardPosition'ı özelleştirerek kullanır)
- components/specific/tarot/CareerTarot/CardPosition.tsx: Kariyer açılımı için özel pozisyon (gerekli, BaseCardPosition'ı özelleştirerek kullanır)
- Bu dosya, tarot açılımlarında kart pozisyonu için temel altyapı olarak kullanılır.

Dosyanın amacı:
- Tüm tarot açılımlarında tek bir kart pozisyonunu (boş, dolu, sıradaki) mobil uyumlu ve temalı şekilde göstermek. Kart açma/kapama, detay gösterme ve özel render fonksiyonu ile esnek yapı sunmak.

Backend bağlantısı:
- Bu dosyada backend bağlantısı yoktur. Sadece görsel arayüz ve pozisyon yönetimi sağlar.

Geliştirme ve öneriler:
- renderCard prop'u ile üst bileşenlerden tam özelleştirme sağlanıyor, bu iyi bir pratik.
- colorScheme ve cardSize ile farklı açılım türleri için kolayca özelleştirilebilir.
- Pozisyonun durumu (boş, dolu, sıradaki) renk ve animasyonlarla net gösteriliyor.
- Kod sade, tekrar yok ve prop isimleri açık.
- Kart açma/kapama ve detay gösterme işlevleri iyi ayrılmış.

Hatalar / Geliştirmeye Açık Noktalar:
- renderCard fonksiyonu zorunlu değil, ancak default görünüm sade ve açıklayıcı.
- Erişilebilirlik için ek ARIA özellikleri (ör. role="button") eklenebilir.
- onClick fonksiyonu sadece kart varsa çalışıyor, bu doğru ancak tıklama animasyonu veya feedback eklenebilir.
- Pozisyon başlığı (positionInfo.title) uzun ise kısaltılıyor, ancak tooltip ile tam metin gösterilebilir.
- Kodda gereksiz tekrar veya karmaşık yapı yok.

Kodun okunabilirliği, optimizasyonu, yeniden kullanılabilirliği ve güvenliği:
- Okunabilirlik: Kod blokları ve prop isimleri açık, fonksiyonel bileşen yapısı sade.
- Optimizasyon: Renk ve boyutlar nesne olarak tanımlanmış, tekrar yok.
- Yeniden Kullanılabilirlik: Farklı açılım türleri ve kart tipleri için kolayca kullanılabilir, üst bileşenler renderCard ile özelleştirebilir.
- Güvenlik: Sadece görsel arayüz, dışarıdan gelen fonksiyonlar ve veriler üst bileşenlerden gelmeli. XSS riski yok, ancak renderCard ile gelen içerik sanitize edilmeli.

Gereklilik ve Kullanım Durumu:
- BaseCardPosition: Gerekli, tüm tarot açılımlarında ortak pozisyon altyapısı olarak kullanılmalı.
- renderCard: Opsiyonel, üst bileşenler tarafından özelleştirilebilir; default görünüm yeterli.
- colorScheme, cardSize: Opsiyonel, açılım türüne göre kullanılabilir.
- Silinebilir veya gereksiz kod yoktur, sade ve amacına uygun bir altyapı bileşenidir.
*/

'use client';

import type { TarotCard } from '@/features/tarot/lib/a-tarot-helpers';
import { useTranslations } from '@/hooks/useTranslations';
import { ReactElement } from 'react';
import Image from 'next/image';

interface CardRendererProps {
  mode: 'position' | 'gallery';
  isOpen: boolean;
  isReversed: boolean;
  showName: boolean;
  showStatus: boolean;
  size: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: (_e?: React.MouseEvent) => void;
}

interface BaseCardPositionProps {
  position: {
    id: number;
    className: string;
  };
  card: TarotCard | null;
  isOpen: boolean;
  isReversed: boolean;
  isNextPosition: boolean;
  onToggleCard: () => void;
  onCardDetails: (_card: TarotCard) => void;
  canSelect?: boolean;
  positionInfo: {
    title: string;
    desc: string;
  };
  renderCard?: (_card: TarotCard, _props: CardRendererProps) => ReactElement;
  cardSize?: 'small' | 'medium' | 'large';
  colorScheme?:
    | 'default'
    | 'amber'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'green'
    | 'emerald';
}

export default function BaseCardPosition({
  position,
  card: _card,
  isOpen: _isOpen,
  isReversed,
  isNextPosition,
  onToggleCard: _onToggleCard,
  onCardDetails,
  canSelect = true,
  positionInfo,
  renderCard,
  cardSize = 'medium',
  colorScheme = 'default',
}: BaseCardPositionProps) {
  const { t } = useTranslations();
  const hasCard = _card !== null;

  // Renk şemalarını tanımla
  const colorSchemes = {
    default: {
      nextPosition:
        'border-blue-400/90 bg-gradient-to-br from-blue-500/60 to-purple-500/60 ring-2 ring-blue-400/60',
      hasCard:
        'border-amber-400/90 bg-gradient-to-br from-amber-500/60 to-orange-500/60 ring-1 ring-amber-400/40 hover:ring-2 hover:ring-amber-300/60',
      empty:
        'border-gray-400/70 bg-gradient-to-br from-slate-700/95 to-slate-800/95 ring-1 ring-gray-400/30',
      numberNext: 'bg-blue-400 text-white ring-blue-300/60',
      numberHas: 'bg-white text-black ring-amber-400/60',
      numberEmpty: 'bg-gray-300 text-gray-700 ring-gray-400/60',
    },
    amber: {
      nextPosition:
        'border-amber-400/90 bg-gradient-to-br from-amber-500/60 to-yellow-500/60 ring-2 ring-amber-400/60',
      hasCard:
        'border-orange-400/90 bg-gradient-to-br from-orange-500/60 to-red-500/60 ring-1 ring-orange-400/40 hover:ring-2 hover:ring-orange-300/60',
      empty:
        'border-gray-400/70 bg-gradient-to-br from-slate-700/95 to-slate-800/95 ring-1 ring-gray-400/30',
      numberNext: 'bg-amber-400 text-white ring-amber-300/60',
      numberHas: 'bg-white text-black ring-orange-400/60',
      numberEmpty: 'bg-gray-300 text-gray-700 ring-gray-400/60',
    },
    blue: {
      nextPosition:
        'border-blue-400/90 bg-gradient-to-br from-blue-500/60 to-cyan-500/60 ring-2 ring-blue-400/60',
      hasCard:
        'border-cyan-400/90 bg-gradient-to-br from-cyan-500/60 to-teal-500/60 ring-1 ring-cyan-400/40 hover:ring-2 hover:ring-cyan-300/60',
      empty:
        'border-gray-400/70 bg-gradient-to-br from-slate-700/95 to-slate-800/95 ring-1 ring-gray-400/30',
      numberNext: 'bg-blue-400 text-white ring-blue-300/60',
      numberHas: 'bg-white text-black ring-cyan-400/60',
      numberEmpty: 'bg-gray-300 text-gray-700 ring-gray-400/60',
    },
    purple: {
      nextPosition:
        'border-purple-400/90 bg-gradient-to-br from-purple-500/60 to-pink-500/60 ring-2 ring-purple-400/60',
      hasCard:
        'border-pink-400/90 bg-gradient-to-br from-pink-500/60 to-rose-500/60 ring-1 ring-pink-400/40 hover:ring-2 hover:ring-pink-300/60',
      empty:
        'border-gray-400/70 bg-gradient-to-br from-slate-700/95 to-slate-800/95 ring-1 ring-gray-400/30',
      numberNext: 'bg-purple-400 text-white ring-purple-300/60',
      numberHas: 'bg-white text-black ring-pink-400/60',
      numberEmpty: 'bg-gray-300 text-gray-700 ring-gray-400/60',
    },
    pink: {
      nextPosition:
        'border-pink-400/90 bg-gradient-to-br from-pink-500/60 to-rose-500/60 ring-2 ring-pink-400/60',
      hasCard:
        'border-rose-400/90 bg-gradient-to-br from-rose-500/60 to-red-500/60 ring-1 ring-rose-400/40 hover:ring-2 hover:ring-rose-300/60',
      empty:
        'border-gray-400/70 bg-gradient-to-br from-slate-700/95 to-slate-800/95 ring-1 ring-gray-400/30',
      numberNext: 'bg-pink-400 text-white ring-pink-300/60',
      numberHas: 'bg-white text-black ring-rose-400/60',
      numberEmpty: 'bg-gray-300 text-gray-700 ring-gray-400/60',
    },
    green: {
      nextPosition:
        'border-green-400/90 bg-gradient-to-br from-green-500/60 to-emerald-500/60 ring-2 ring-green-400/60',
      hasCard:
        'border-emerald-400/90 bg-gradient-to-br from-emerald-500/60 to-teal-500/60 ring-1 ring-emerald-400/40 hover:ring-2 hover:ring-emerald-300/60',
      empty:
        'border-gray-400/70 bg-gradient-to-br from-slate-700/95 to-slate-800/95 ring-1 ring-gray-400/30',
      numberNext: 'bg-green-400 text-white ring-green-300/60',
      numberHas: 'bg-white text-black ring-emerald-400/60',
      numberEmpty: 'bg-gray-300 text-gray-700 ring-gray-400/60',
    },
    emerald: {
      nextPosition:
        'border-emerald-400/90 bg-gradient-to-br from-emerald-500/60 to-green-500/60 ring-2 ring-emerald-400/60',
      hasCard:
        'border-green-400/90 bg-gradient-to-br from-green-500/60 to-teal-500/60 ring-1 ring-green-400/40 hover:ring-2 hover:ring-green-300/60',
      empty:
        'border-gray-400/70 bg-gradient-to-br from-slate-700/95 to-slate-800/95 ring-1 ring-gray-400/30',
      numberNext: 'bg-emerald-400 text-white ring-emerald-300/60',
      numberHas: 'bg-white text-black ring-green-400/60',
      numberEmpty: 'bg-gray-300 text-gray-700 ring-gray-400/60',
    },
  };

  const colors = colorSchemes[colorScheme];

  // Badge tema renkleri - kartın temasına uyumlu
  const badgeThemes = {
    default: {
      bg: 'bg-white/10 backdrop-blur-md',
      border: 'border-white/20',
      text: 'text-white',
      icon: 'text-white/90',
      hover: 'group-hover:bg-white/15 group-hover:border-white/30',
    },
    amber: {
      bg: 'bg-amber-500/20 backdrop-blur-md',
      border: 'border-amber-400/30',
      text: 'text-amber-100',
      icon: 'text-amber-200',
      hover: 'group-hover:bg-amber-500/25 group-hover:border-amber-400/40',
    },
    blue: {
      bg: 'bg-cyan-500/20 backdrop-blur-md',
      border: 'border-cyan-400/30',
      text: 'text-cyan-100',
      icon: 'text-cyan-200',
      hover: 'group-hover:bg-cyan-500/25 group-hover:border-cyan-400/40',
    },
    purple: {
      bg: 'bg-pink-500/20 backdrop-blur-md',
      border: 'border-pink-400/30',
      text: 'text-pink-100',
      icon: 'text-pink-200',
      hover: 'group-hover:bg-pink-500/25 group-hover:border-pink-400/40',
    },
    pink: {
      bg: 'bg-rose-500/20 backdrop-blur-md',
      border: 'border-rose-400/30',
      text: 'text-rose-100',
      icon: 'text-rose-200',
      hover: 'group-hover:bg-rose-500/25 group-hover:border-rose-400/40',
    },
    green: {
      bg: 'bg-emerald-500/20 backdrop-blur-md',
      border: 'border-emerald-400/30',
      text: 'text-emerald-100',
      icon: 'text-emerald-200',
      hover: 'group-hover:bg-emerald-500/25 group-hover:border-emerald-400/40',
    },
    emerald: {
      bg: 'bg-green-500/20 backdrop-blur-md',
      border: 'border-green-400/30',
      text: 'text-green-100',
      icon: 'text-green-200',
      hover: 'group-hover:bg-green-500/25 group-hover:border-green-400/40',
    },
  };

  const badgeTheme = badgeThemes[colorScheme];

  // Kart boyutlarını tanımla (geçerli Tailwind ölçüleriyle)
  const cardSizes = {
    // base: 48x72px, sm: 64x96px, md: 80x128px
    small: 'w-12 h-18 sm:w-16 sm:h-24 md:w-20 md:h-32',
    // base: 64x96px, sm: 80x128px, md: 96x144px, lg: 112x160px, xl: 128x192px
    medium:
      'w-16 h-24 sm:w-20 sm:h-32 md:w-24 md:h-36 lg:w-28 lg:h-40 xl:w-32 xl:h-48',
    // base: 80x128px, sm: 96x144px, md: 112x160px, lg: 128x192px, xl: 144x224px
    large:
      'w-20 h-32 sm:w-24 sm:h-36 md:w-28 md:h-40 lg:w-32 lg:h-48 xl:w-36 xl:h-56',
  };

  return (
    <div
      className={`${position.className} transition-all duration-300 ${canSelect ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={() => {
        if (!canSelect) {
          return;
        }
        if (hasCard && _card) {
          onCardDetails(_card);
        } else if (isNextPosition) {
          _onToggleCard();
        }
      }}
      style={{ zIndex: isNextPosition ? 40 : hasCard ? 30 : 20 }}
    >
      <div
        className={`
        ${cardSizes[cardSize]}
        border-2 rounded-xl flex flex-col items-center justify-center
        transition-all duration-500 ${canSelect ? 'hover:scale-110 hover:z-40 group' : 'opacity-75'} relative
        shadow-xl shadow-black/60
        ${
          isNextPosition
            ? `${colors.nextPosition} animate-pulse scale-105`
            : hasCard
              ? colors.hasCard
              : colors.empty
        }
      `}
      >
        {/* Kart Numarası */}
        <div
          className={`absolute -top-2 -left-2 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs md:text-sm shadow-lg ring-2 z-10 ${
            isNextPosition
              ? colors.numberNext
              : hasCard
                ? colors.numberHas
                : colors.numberEmpty
          }`}
        >
          {position.id}
        </div>

        {/* Detay için tıklayın ipucu - Modern glassmorphism badge */}
        {hasCard && _card && (
          <div
            className={`absolute -bottom-1.5 -right-1.5 ${badgeTheme.bg} ${badgeTheme.border} border rounded-full flex items-center justify-center z-20 shadow-lg ${badgeTheme.hover} transition-all duration-300 pointer-events-none opacity-80 sm:opacity-0 sm:group-hover:opacity-100 scale-90 sm:group-hover:scale-100`}
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <div className='flex items-center gap-1.5 px-2.5 py-1'>
              <svg
                className={`w-3.5 h-3.5 ${badgeTheme.icon}`}
                fill='none'
                stroke='currentColor'
                strokeWidth={2.5}
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <span
                className={`${badgeTheme.text} text-[10px] xs:text-[11px] font-medium whitespace-nowrap hidden xs:inline`}
              >
                Detay
              </span>
            </div>
          </div>
        )}

        {/* Kart İçeriği */}
        {hasCard && _card ? (
          renderCard ? (
            renderCard(_card, {
              mode: 'position',
              isOpen: true, // Kart seçildiğinde her zaman açık göster
              isReversed,
              showName: true,
              showStatus: true,
              size: cardSize,
              className: 'w-full h-full',
              onClick: (e?: React.MouseEvent) => {
                e?.stopPropagation();
                onCardDetails(_card);
              },
            })
          ) : (
            // Varsayılan kart görünümü
            <div className='w-full h-full flex items-center justify-center'>
              <Image
                src={_card ? _card.image : '/cards/CardBack.webp'}
                alt={_card ? _card.nameTr : 'Kart'}
                width={200}
                height={300}
                className={`w-full h-full object-cover rounded-lg ${isReversed ? 'transform rotate-180' : ''}`}
              />
            </div>
          )
        ) : (
          // BOŞ POZİSYON
          <div className='text-center p-1'>
            {isNextPosition ? (
              <>
                <span className='text-lg md:text-xl mb-1 block animate-pulse'>
                  ⭐
                </span>
                <div className='text-[10px] md:text-xs text-blue-200 leading-tight break-words hyphens-auto'>
                  Sıradaki
                </div>
              </>
            ) : (
              <>
                <span className='text-lg md:text-xl mb-1 block opacity-60'>
                  🃏
                </span>
                <div className='text-[10px] md:text-xs text-gray-400 leading-tight break-words hyphens-auto'>
                  {(() => {
                    const translatedTitle = t(positionInfo.title);
                    return translatedTitle.length > 8
                      ? translatedTitle.substring(0, 8) + '...'
                      : translatedTitle;
                  })()}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
