'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
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
  const { t } = useTranslations();
  const [isVisible, setIsVisible] = useState(false);
  const [userTimezone, setUserTimezone] = useState<string>('');
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
      setUserTimezone(timezone);

      // Türkiye saati (Europe/Istanbul) 12:00-19:00
      const turkeyTimezone = 'Europe/Istanbul';
      const turkeyStartHour = 12;
      const turkeyEndHour = 19;

      // Şu anki zamanı al
      const now = new Date();

      // Türkiye'deki şu anki saat
      const turkeyHour = parseInt(
        now.toLocaleString('en-US', {
          timeZone: turkeyTimezone,
          hour: '2-digit',
          hour12: false,
        }).split(':')[0]
      );

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
        const [datePart, timePart] = turkeyNowStr.split(', ');
        const [month, day, year] = datePart.split('/');
        const [hour, minute] = timePart.split(':');

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

        const msUntilClose = turkeyCloseTime.getTime() - turkeyNowDate.getTime();
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
      const [month2, day2, year2] = todayStr.split('/');
      const turkeyToday = new Date(
        Date.UTC(parseInt(year2), parseInt(month2) - 1, parseInt(day2))
      );

      const turkeyStartUTC = new Date(turkeyToday);
      turkeyStartUTC.setUTCHours(turkeyStartHour, 0, 0, 0);

      const turkeyEndUTC = new Date(turkeyToday);
      turkeyEndUTC.setUTCHours(turkeyEndHour, 0, 0, 0);

      // Kullanıcının saat dilimine çevir - format helper kullan
      const formatTime = (utcDate: Date, tz: string, loc: string) => {
        // UTC tarihini kullanıcının saat dilimine çevir
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        return formatter.format(utcDate);
      };

      const userStartStr = formatTime(turkeyStartUTC, timezone, locale);
      const userEndStr = formatTime(turkeyEndUTC, timezone, locale);

      setWorkHours({
        start: userStartStr,
        end: userEndStr,
      });

      // Kartı göster (smooth animasyon için kısa bir gecikme)
      setTimeout(() => setIsVisible(true), 100);
    } catch (error) {
      console.error('Timezone detection error:', error);
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

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      } ${className}`}
    >
      <div className='inline-flex items-center gap-2 px-3 py-2 bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-lg text-xs'>
        <Zap className='w-3.5 h-3.5 text-yellow-400' />
        <span className='text-gray-300'>
          <span className='font-semibold text-yellow-300'>
            {texts.deliveryTimeHighlight}
          </span>
          {' • '}
          {isActive ? (
            <span className='text-green-300'>
              {texts.currentlyActive}
              {timeUntilClose && ` ${texts.timeRemaining(timeUntilClose)}`}
            </span>
          ) : (
            <span className='text-gray-400'>{texts.currentlyInactive}</span>
          )}
          {' • '}
          <span className='text-gray-400'>
            {texts.workHoursText(workHours.start, workHours.end)}
          </span>
        </span>
      </div>
    </div>
  );
}

