'use client';

import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

interface FastDeliveryInfoCardProps {
  selectedReadingType: string | null;
  readingTypes: {
    SIMPLE: string;
    DETAILED: string;
    WRITTEN: string;
  };
  locale?: 'tr' | 'en' | 'sr';
  className?: string;
}

export default function FastDeliveryInfoCard({
  selectedReadingType,
  readingTypes,
  locale = 'tr',
  className = '',
}: FastDeliveryInfoCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [workHours, setWorkHours] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [isActive, setIsActive] = useState(false);
  const [timeUntilClose, setTimeUntilClose] = useState<string>('');

  // Okuma tipi seçilmeden veya DETAILED/WRITTEN seçildiğinde göster
  // SIMPLE seçildiğinde gizle
  const shouldShow =
    selectedReadingType === null ||
    selectedReadingType === readingTypes.DETAILED ||
    selectedReadingType === readingTypes.WRITTEN;

  // Kullanıcının saat dilimini tespit et ve çalışma saatlerini hesapla
  useEffect(() => {
    if (!shouldShow) {
      setIsVisible(false);
      return;
    }

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Türkiye saati (Europe/Istanbul) 12:00-19:00
      const turkeyTimezone = 'Europe/Istanbul';
      const turkeyStartHour = 12;
      const turkeyEndHour = 19;

      // Şu anki zamanı al
      const now = new Date();

      // Türkiye'deki şu anki saat
      const turkeyHourStr = now
        .toLocaleString('en-US', {
          timeZone: turkeyTimezone,
          hour: '2-digit',
          hour12: false,
        })
        .split(':')[0];

      if (!turkeyHourStr) {
        throw new Error('Failed to get Turkey hour');
      }

      const turkeyHour = parseInt(turkeyHourStr);

      // Çalışma saatleri içinde miyiz?
      const currentlyActive =
        turkeyHour >= turkeyStartHour && turkeyHour < turkeyEndHour;
      setIsActive(currentlyActive);

      // Kapanışa kalan süreyi hesapla
      if (currentlyActive) {
        // Türkiye'deki bugünün tarih ve saatini al
        const turkeyNowStr = now.toLocaleString('en-US', {
          timeZone: turkeyTimezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        const parts = turkeyNowStr.split(', ');
        const datePart = parts[0];
        const timePart = parts[1];

        if (!datePart || !timePart) {
          throw new Error('Failed to parse date/time');
        }

        const dateParts = datePart.split('/');
        const timeParts = timePart.split(':');

        const month = dateParts[0];
        const day = dateParts[1];
        const year = dateParts[2];
        const hour = timeParts[0];
        const minute = timeParts[1];

        if (!month || !day || !year || !hour || !minute) {
          throw new Error('Failed to parse date/time components');
        }

        const turkeyNowDate = new Date(
          Date.UTC(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hour),
            parseInt(minute)
          )
        );

        // Kapanış saatini oluştur
        const turkeyCloseTime = new Date(
          Date.UTC(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            turkeyEndHour,
            0
          )
        );

        // Eğer kapanış saati geçmişse yarını al
        if (turkeyCloseTime <= turkeyNowDate) {
          turkeyCloseTime.setUTCDate(turkeyCloseTime.getUTCDate() + 1);
        }

        const msUntilClose =
          turkeyCloseTime.getTime() - turkeyNowDate.getTime();
        const hoursUntilClose = Math.floor(msUntilClose / (1000 * 60 * 60));
        const minutesUntilClose = Math.floor(
          (msUntilClose % (1000 * 60 * 60)) / (1000 * 60)
        );

        if (hoursUntilClose > 0) {
          setTimeUntilClose(
            locale === 'tr'
              ? `${hoursUntilClose} saat ${minutesUntilClose} dakika`
              : locale === 'en'
                ? `${hoursUntilClose}h ${minutesUntilClose}m`
                : `${hoursUntilClose}h ${minutesUntilClose}min`
          );
        } else if (minutesUntilClose > 0) {
          setTimeUntilClose(
            locale === 'tr'
              ? `${minutesUntilClose} dakika`
              : locale === 'en'
                ? `${minutesUntilClose}m`
                : `${minutesUntilClose}min`
          );
        }
      }

      // Türkiye'deki çalışma saatlerini kullanıcının saat dilimine çevir
      // Bugünün tarihini kullanarak saatleri oluştur
      const todayStr = now.toLocaleString('en-US', {
        timeZone: turkeyTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const todayParts = todayStr.split('/');
      const month2 = todayParts[0];
      const day2 = todayParts[1];
      const year2 = todayParts[2];

      if (!month2 || !day2 || !year2) {
        throw new Error('Failed to parse today date');
      }

      const turkeyToday = new Date(
        Date.UTC(parseInt(year2), parseInt(month2) - 1, parseInt(day2))
      );

      const turkeyStartUTC = new Date(turkeyToday);
      turkeyStartUTC.setUTCHours(turkeyStartHour, 0, 0, 0);

      const turkeyEndUTC = new Date(turkeyToday);
      turkeyEndUTC.setUTCHours(turkeyEndHour, 0, 0, 0);

      // Kullanıcının saat dilimine çevir - format helper kullan
      const formatTime = (utcDate: Date, tz: string) => {
        // UTC tarihini kullanıcının saat dilimine çevir
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        return formatter.format(utcDate);
      };

      const userStartStr = formatTime(turkeyStartUTC, timezone);
      const userEndStr = formatTime(turkeyEndUTC, timezone);

      setWorkHours({
        start: userStartStr,
        end: userEndStr,
      });

      // Kartı göster (smooth animasyon için kısa bir gecikme)
      setTimeout(() => setIsVisible(true), 100);
    } catch (error) {
      // Fallback: Türkiye saati göster
      setWorkHours({ start: '12:00', end: '19:00' });
      setIsActive(true);
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [shouldShow, locale]);

  if (!shouldShow || !isVisible) {
    return null;
  }

  const content = {
    tr: {
      badge: '⚡ HIZLI TESLİMAT',
      premiumService: 'Premium Hizmet',
      deliveryTime: 'Sesli ve Yazılı okumalarınız',
      deliveryTimeHighlight: '2-4 saat içinde hazır!',
      currentlyActive: 'Şu Anda Aktif',
      currentlyInactive: 'Yarın Tekrar Aktif',
      timeRemaining: (time: string) => `(${time} kaldı)`,
      workHours: 'Çalışma Saatleri',
      workHoursText: (start: string, end: string) =>
        `${start} - ${end} (Sizin saat diliminiz)`,
      turkeyHours: 'Türkiye: 12:00 - 19:00',
      socialProof: 'Bugün 47 kişi bu hızlı teslimatı tercih etti',
      cta: '✨ Şimdi Okumaya Başla',
      close: 'Kapat',
    },
    en: {
      badge: '⚡ FAST DELIVERY',
      premiumService: 'Premium Service',
      deliveryTime: 'Your Voice and Written readings',
      deliveryTimeHighlight: 'Ready in 2-4 hours!',
      currentlyActive: 'Currently Active',
      currentlyInactive: 'Active Again Tomorrow',
      timeRemaining: (time: string) => `(${time} remaining)`,
      workHours: 'Working Hours',
      workHoursText: (start: string, end: string) =>
        `${start} - ${end} (Your timezone)`,
      turkeyHours: 'Turkey: 12:00 - 19:00',
      socialProof: '47 people chose this fast delivery today',
      cta: '✨ Start Reading Now',
      close: 'Close',
    },
    sr: {
      badge: '⚡ BRZA ISPORUKA',
      premiumService: 'Premium Usluga',
      deliveryTime: 'Vaša usmena i pisana čitanja',
      deliveryTimeHighlight: 'Spremna za 2-4 sata!',
      currentlyActive: 'Trenutno Aktivno',
      currentlyInactive: 'Ponovo Aktivno Sutra',
      timeRemaining: (time: string) => `(${time} preostalo)`,
      workHours: 'Radno Vreme',
      workHoursText: (start: string, end: string) =>
        `${start} - ${end} (Vaša vremenska zona)`,
      turkeyHours: 'Turska: 12:00 - 19:00',
      socialProof: '47 ljudi je danas izabralo ovu brzu isporuku',
      cta: '✨ Počnite Čitanje Sada',
      close: 'Zatvori',
    },
  };

  const texts = content[locale];

  // Mobilde çalışma saatlerini kısalt (sadece saat aralığı)
  const workHoursShort = `${workHours.start.split(':')[0]}-${workHours.end.split(':')[0]}`;
  const workHoursFull = texts.workHoursText(workHours.start, workHours.end);

  // Mobilde zaman kalan kısmını kısalt
  const getShortTimeRemaining = (time: string) => {
    // "2 saat 34 dakika" -> "2h 34m" veya "34 dakika" -> "34m"
    if (locale === 'tr') {
      return time
        .replace(/\s*saat\s*/g, 's ')
        .replace(/\s*dakika\s*/g, 'd')
        .replace(/\s*kaldı\s*/g, '');
    } else if (locale === 'en') {
      return time.replace(/\s*remaining\s*/g, '');
    } else {
      return time.replace(/\s*preostalo\s*/g, '');
    }
  };

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      } ${className}`}
    >
      <div className='inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2.5 rounded-lg sm:rounded-xl backdrop-blur-md bg-indigo-950/40 border border-white/10 shadow-lg max-w-full'>
        {/* Sarı şimşek ikonu */}
        <Zap className='w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0' />

        <span className='text-[10px] sm:text-sm text-gray-300 flex items-center gap-1 sm:gap-2 flex-nowrap min-w-0'>
          {/* 2-4 saat içinde hazır - Sarı renkte */}
          <span className='font-medium text-yellow-300 whitespace-nowrap flex-shrink-0'>
            {texts.deliveryTimeHighlight}
          </span>

          {/* Nokta ayırıcı */}
          <span className='text-gray-500 flex-shrink-0 hidden sm:inline'>
            •
          </span>
          <span className='text-gray-500 flex-shrink-0 text-[8px] sm:hidden'>
            •
          </span>

          {/* Şu Anda Aktif - Açık teal renkte, yarı saydam arka plan ile */}
          {isActive ? (
            <span className='inline-flex items-center gap-0.5 sm:gap-1.5 flex-nowrap flex-shrink-0'>
              <span className='px-1 sm:px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-medium whitespace-nowrap text-[10px] sm:text-sm'>
                {texts.currentlyActive}
              </span>
              {timeUntilClose && (
                <span className='text-cyan-300 whitespace-nowrap text-[10px] sm:text-sm flex-shrink-0'>
                  <span className='hidden sm:inline'>
                    {texts.timeRemaining(timeUntilClose)}
                  </span>
                  <span className='sm:hidden'>
                    ({getShortTimeRemaining(timeUntilClose)})
                  </span>
                </span>
              )}
            </span>
          ) : (
            <span className='text-gray-400 whitespace-nowrap text-[10px] sm:text-sm flex-shrink-0'>
              {texts.currentlyInactive}
            </span>
          )}

          {/* Nokta ayırıcı */}
          <span className='text-gray-500 flex-shrink-0 hidden sm:inline'>
            •
          </span>
          <span className='text-gray-500 flex-shrink-0 text-[8px] sm:hidden'>
            •
          </span>

          {/* Çalışma saatleri - Mobilde kısaltılmış, desktop'ta tam */}
          <span className='text-cyan-300 whitespace-nowrap text-[10px] sm:text-sm flex-shrink-0'>
            <span className='sm:hidden'>{workHoursShort}</span>
            <span className='hidden sm:inline'>{workHoursFull}</span>
          </span>
        </span>
      </div>
    </div>
  );
}
