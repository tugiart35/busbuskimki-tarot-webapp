import { useState, useEffect } from 'react';

interface CountryInfo {
  country: string;
  countryCode: string;
  phoneCode: string;
}

const DEFAULT_COUNTRY: CountryInfo = {
  country: 'Turkey',
  countryCode: 'TR',
  phoneCode: '+90',
};

const SERVICE_TIMEOUT_MS = 5000;

const parseCountryResponse = (countryData: any): CountryInfo | null => {
  if (!countryData || typeof countryData !== 'object') {
    return null;
  }

  const rawCode =
    countryData.country_code ||
    countryData.countryCode ||
    countryData.country ||
    countryData.iso_code ||
    countryData.countryCode2;

  if (!rawCode || typeof rawCode !== 'string') {
    return null;
  }

  const countryCode = rawCode.toUpperCase();
  const phoneCode = countryPhoneCodes[countryCode];

  if (!phoneCode) {
    return null;
  }

  const countryName =
    countryData.country ||
    countryData.country_name ||
    countryData.countryName ||
    countryData.regionName ||
    countryCode;

  return {
    country: typeof countryName === 'string' ? countryName : countryCode,
    countryCode,
    phoneCode,
  };
};

// Ülke kodları mapping
const countryPhoneCodes: Record<string, string> = {
  TR: '+90',
  US: '+1',
  GB: '+44',
  DE: '+49',
  FR: '+33',
  IT: '+39',
  ES: '+34',
  NL: '+31',
  BE: '+32',
  CH: '+41',
  AT: '+43',
  SE: '+46',
  NO: '+47',
  DK: '+45',
  FI: '+358',
  RU: '+7',
  CN: '+86',
  JP: '+81',
  KR: '+82',
  IN: '+91',
  BR: '+55',
  AR: '+54',
  MX: '+52',
  AE: '+971',
  SA: '+966',
  QA: '+974',
  KW: '+965',
  BH: '+973',
  OM: '+968',
  EG: '+20',
  MA: '+212',
  TN: '+216',
  DZ: '+213',
  LY: '+218',
  SD: '+249',
  ZA: '+27',
  NG: '+234',
  KE: '+254',
  GH: '+233',
  GM: '+220',
  SN: '+221',
  ML: '+223',
  BF: '+226',
  NE: '+227',
  TG: '+228',
  BJ: '+229',
  MU: '+230',
  LR: '+231',
  SL: '+232',
  TD: '+235',
  CF: '+236',
  CM: '+237',
  CV: '+238',
  ST: '+239',
  GQ: '+240',
  GA: '+241',
  CG: '+242',
  CD: '+243',
  AO: '+244',
  GW: '+245',
  IO: '+246',
  AC: '+247',
  SC: '+248',
  RW: '+250',
  ET: '+251',
  SO: '+252',
  DJ: '+253',
  TZ: '+255',
  UG: '+256',
  BI: '+257',
  MZ: '+258',
  ZM: '+260',
  MG: '+261',
  RE: '+262',
  ZW: '+263',
  NA: '+264',
  MW: '+265',
  LS: '+266',
  BW: '+267',
  SZ: '+268',
  KM: '+269',
  SH: '+290',
  ER: '+291',
  AW: '+297',
  FO: '+298',
  GL: '+299',
};

export const useCountryDetection = () => {
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setCountryInfo(DEFAULT_COUNTRY);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const persistCountryInfo = (info: CountryInfo) => {
      if (!isMounted) {
        return;
      }

      setCountryInfo(info);

      try {
        window.localStorage.setItem('detectedCountry', JSON.stringify(info));
        window.localStorage.setItem(
          'detectedCountryTime',
          Date.now().toString()
        );
      } catch (storageError) {
        console.warn('Country detection storage write failed', storageError);
      }
    };

    const readCachedCountry = (): CountryInfo | null => {
      try {
        const cachedCountry = window.localStorage.getItem('detectedCountry');
        const cacheTime = window.localStorage.getItem('detectedCountryTime');

        if (!cachedCountry || !cacheTime) {
          return null;
        }

        const cacheAge = Date.now() - parseInt(cacheTime, 10);
        if (Number.isNaN(cacheAge) || cacheAge >= 24 * 60 * 60 * 1000) {
          return null;
        }

        const parsed = JSON.parse(cachedCountry);
        return parseCountryResponse(parsed);
      } catch (storageError) {
        console.warn('Country detection storage read failed', storageError);
        return null;
      }
    };

    const fetchCountryData = async (service: string) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SERVICE_TIMEOUT_MS);

      try {
        const response = await fetch(service, {
          headers: {
            Accept: 'application/json',
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        return parseCountryResponse(data);
      } catch (err) {
        if ((err as DOMException)?.name !== 'AbortError') {
          console.warn(`Country detection service failed: ${service}`, err);
        }
        return null;
      } finally {
        clearTimeout(timeoutId);
      }
    };

    const detectCountry = async () => {
      try {
        if (!isMounted) {
          return;
        }

        setIsLoading(true);
        setError(null);

        const cachedCountry = readCachedCountry();
        if (cachedCountry) {
          persistCountryInfo(cachedCountry);
          setIsLoading(false);
          return;
        }

        const services = [
          'https://ipapi.co/json/',
          'https://ipinfo.io/json',
          'https://api.country.is/',
          'https://ip-api.com/json/',
        ];

        let detectedCountry: CountryInfo | null = null;

        for (const service of services) {
          detectedCountry = await fetchCountryData(service);
          if (detectedCountry) {
            break;
          }
        }

        persistCountryInfo(detectedCountry ?? DEFAULT_COUNTRY);
      } catch (err) {
        console.error('Country detection error:', err);
        setError('Ülke tespit edilemedi');
        persistCountryInfo(DEFAULT_COUNTRY);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    detectCountry();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    countryInfo,
    isLoading,
    error,
    phoneCodes: countryPhoneCodes,
  };
};
