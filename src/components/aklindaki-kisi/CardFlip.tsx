'use client';

import Image from 'next/image';
import { getCardImagePath, getBackImagePath } from '@/lib/aklindaki-kisi/utils';

interface CardFlipProps {
  cardNumber: number;
  isFlipped: boolean;
  onClick: () => void;
  disabled?: boolean;
  onFlippedCardClick?: () => void; // Açık kartlara tıklama için
}

export default function CardFlip({
  cardNumber,
  isFlipped,
  onClick,
  disabled = false,
  onFlippedCardClick,
}: CardFlipProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Açık kartlara tıklama (mobilde tam ekran için)
    if (isFlipped && onFlippedCardClick) {
      onFlippedCardClick();
      return;
    }

    // Kapalı kartlar veya disabled kartlar
    if (disabled) {
      return;
    }

    onClick();
  };

  return (
    <div
      className={`w-full sm:w-full md:w-full lg:w-full aspect-[9/16] transition-all duration-300 ${
        disabled && !isFlipped
          ? 'opacity-50 cursor-not-allowed'
          : isFlipped
            ? 'cursor-pointer'
            : 'cursor-pointer hover:scale-105'
      }`}
      onClick={handleClick}
      style={{
        pointerEvents: disabled && !isFlipped ? 'none' : 'auto',
      }}
    >
      <div className='w-full h-full bg-[#FDFBF8] border border-[#D9CBA1] rounded-xl shadow-sm relative overflow-hidden'>
        {isFlipped ? (
          <Image
            src={getCardImagePath(cardNumber)}
            alt={`Kart ${cardNumber}`}
            fill
            className='object-cover'
            priority={false}
            sizes='(max-width: 640px) 128px, (max-width: 768px) 160px, 192px'
          />
        ) : (
          <Image
            src={getBackImagePath()}
            alt='Card Back'
            fill
            className='object-cover'
            priority={false}
            sizes='(max-width: 640px) 128px, (max-width: 768px) 160px, 192px'
          />
        )}
      </div>
    </div>
  );
}
