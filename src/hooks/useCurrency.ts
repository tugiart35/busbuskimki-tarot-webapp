import { useState, useEffect } from 'react';
import { useCountryDetection } from './useCountryDetection';

export type Currency = 'TRY' | 'EUR';

interface CurrencyInfo {
  currency: Currency;
  symbol: string;
  isLoading: boolean;
}

/**
 * Kullanıcının konumuna göre otomatik para birimi seçimi yapan hook
 * - Türkiye (TR): TRY ₺
 * - Diğer ülkeler: EUR €
 */
export const useCurrency = (): CurrencyInfo => {
  const { countryInfo, isLoading } = useCountryDetection();
  const [currency, setCurrency] = useState<Currency>('TRY');

  useEffect(() => {
    if (!isLoading && countryInfo) {
      // Türkiye ise TRY, değilse EUR
      if (countryInfo.countryCode === 'TR') {
        setCurrency('TRY');
      } else {
        setCurrency('EUR');
      }
    }
  }, [countryInfo, isLoading]);

  const symbol = currency === 'TRY' ? '₺' : '€';

  return {
    currency,
    symbol,
    isLoading,
  };
};
