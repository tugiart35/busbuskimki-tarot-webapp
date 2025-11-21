'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TarotCard } from '@/types/tarot-cards';

interface CardGalleryProps {
  card: TarotCard;
  locale: 'tr' | 'en' | 'sr';
}

export function CardGallery({ card, locale }: CardGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Check if card has additional images
  if (!card.additionalImages || card.additionalImages.length === 0) {
    return null;
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setSelectedImageIndex(prev => (prev + 1) % card.additionalImages!.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      prev =>
        (prev - 1 + card.additionalImages!.length) %
        card.additionalImages!.length
    );
  };

  const getGalleryTitle = () => {
    if (locale === 'tr') {
      return 'Kart Galeri ve Detaylar';
    }
    if (locale === 'en') {
      return 'Card Gallery and Details';
    }
    return 'Galerija i Detalji Karte';
  };

  const getTypeLabel = (type: string) => {
    if (locale === 'tr') {
      switch (type) {
        case 'symbolism':
          return 'Sembolizm';
        case 'detail':
          return 'Detay';
        case 'variation':
          return 'Varyasyon';
        case 'comparison':
          return 'Karşılaştırma';
        default:
          return '';
      }
    } else if (locale === 'en') {
      switch (type) {
        case 'symbolism':
          return 'Symbolism';
        case 'detail':
          return 'Detail';
        case 'variation':
          return 'Variation';
        case 'comparison':
          return 'Comparison';
        default:
          return '';
      }
    } else {
      switch (type) {
        case 'symbolism':
          return 'Simbolizam';
        case 'detail':
          return 'Detalj';
        case 'variation':
          return 'Varijacija';
        case 'comparison':
          return 'Poređenje';
        default:
          return '';
      }
    }
  };

  return (
    <>
      <section className='py-16 px-4 bg-gradient-to-br from-gray-50 to-purple-50'>
        <div className='max-w-6xl mx-auto'>
          {/* Section Header */}
          <div className='text-center mb-12'>
            <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-3xl'>🖼️</span>
            </div>
            <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-4'>
              {getGalleryTitle()}
            </h2>
            <p className='text-lg text-gray-600'>
              {locale === 'tr'
                ? 'Kartın sembolleri, detayları ve görsel varyasyonları'
                : locale === 'en'
                  ? 'Card symbols, details and visual variations'
                  : 'Simboli karte, detalji i vizuelne varijacije'}
            </p>
          </div>

          {/* Gallery Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {card.additionalImages.map((image, index) => (
              <article
                key={index}
                className='group relative bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer'
                onClick={() => handleImageClick(index)}
              >
                <figure className='relative aspect-[9/16] overflow-hidden bg-gray-100'>
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className='object-contain group-hover:scale-105 transition-transform duration-300'
                    loading='lazy'
                  />

                  {/* Type Badge */}
                  {image.type && (
                    <div className='absolute top-3 left-3'>
                      <span className='bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg'>
                        {getTypeLabel(image.type)}
                      </span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4'>
                    <span className='text-white font-semibold flex items-center gap-2'>
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
                          d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7'
                        />
                      </svg>
                      {locale === 'tr'
                        ? 'Büyüt'
                        : locale === 'en'
                          ? 'Enlarge'
                          : 'Uvećaj'}
                    </span>
                  </div>

                  <figcaption className='sr-only'>{image.alt}</figcaption>
                </figure>

                {/* Caption */}
                {image.caption && (
                  <div className='p-4'>
                    <p className='text-sm text-gray-700 leading-relaxed'>
                      {image.caption}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className='fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4'
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className='absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50'
            aria-label={
              locale === 'tr' ? 'Kapat' : locale === 'en' ? 'Close' : 'Zatvori'
            }
          >
            <svg
              className='w-8 h-8'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>

          {/* Previous Button */}
          <button
            onClick={e => {
              e.stopPropagation();
              prevImage();
            }}
            className='absolute left-4 text-white hover:text-gray-300 transition-colors z-50'
            aria-label={
              locale === 'tr'
                ? 'Önceki'
                : locale === 'en'
                  ? 'Previous'
                  : 'Prethodno'
            }
          >
            <svg
              className='w-10 h-10'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>

          {/* Image Container */}
          <div
            className='relative max-w-5xl max-h-[90vh] w-full'
            onClick={e => e.stopPropagation()}
          >
            {card.additionalImages &&
              card.additionalImages[selectedImageIndex] && (
                <>
                  <div className='relative aspect-[9/16] w-full max-w-md mx-auto'>
                    <Image
                      src={card.additionalImages[selectedImageIndex].url}
                      alt={card.additionalImages[selectedImageIndex].alt}
                      fill
                      className='object-contain'
                      priority
                    />
                  </div>

                  {/* Image Info */}
                  <div className='bg-black/80 text-white p-4 rounded-lg mt-4'>
                    {card.additionalImages[selectedImageIndex].type && (
                      <span className='inline-block bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2'>
                        {getTypeLabel(
                          card.additionalImages[selectedImageIndex].type!
                        )}
                      </span>
                    )}
                    {card.additionalImages[selectedImageIndex].caption && (
                      <p className='text-sm leading-relaxed'>
                        {card.additionalImages[selectedImageIndex].caption}
                      </p>
                    )}
                    <p className='text-xs text-gray-400 mt-2'>
                      {selectedImageIndex + 1} / {card.additionalImages.length}
                    </p>
                  </div>
                </>
              )}
          </div>

          {/* Next Button */}
          <button
            onClick={e => {
              e.stopPropagation();
              nextImage();
            }}
            className='absolute right-4 text-white hover:text-gray-300 transition-colors z-50'
            aria-label={
              locale === 'tr' ? 'Sonraki' : locale === 'en' ? 'Next' : 'Sledeće'
            }
          >
            <svg
              className='w-10 h-10'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
