/*
info:
Bağlantılı dosyalar:
- app/[locale]/pakize/packages/page.tsx: Pakize paket yönetimi (gerekli)
- lib/utils/currency-utils.ts: Para birimi yardımcı fonksiyonları (gerekli)

Dosyanın amacı:
- Frankfurter API'sinden güncel döviz kurlarını çekmek (ECB verileri)
- EUR/TRY dönüşüm oranlarını sağlamak
- Cache ile performans optimizasyonu
- Rate limiting ile API koruması

API detayları:
- Frankfurter API: https://api.frankfurter.app/latest?from=EUR&to=TRY
- Veri Kaynağı: Avrupa Merkez Bankası (ECB)
- Cache süresi: 1 saat (3600 saniye)
- Rate limit: 100 istek/saat
- API Key: Gerekmiyor (tamamen ücretsiz)

Geliştirme önerileri:
- ✅ Frankfurter API entegrasyonu
- ✅ JSON parsing ve hata yönetimi
- ✅ Cache mekanizması
- ✅ Rate limiting

Tespit edilen hatalar:
- ✅ API hata durumları yönetiliyor
- ✅ Fallback değerler tanımlandı

Kullanım durumu:
- ✅ Gerekli: Admin paket yönetimi için
- ✅ Production-ready: ECB resmi verisi kullanılıyor
*/
import { NextRequest, NextResponse } from 'next/server';
import { getClientIP } from '@/lib/utils/ip-utils';
// import { ApiBase } from '@/lib/api/shared/api-base';

// Cache için global değişkenler
let exchangeRateCache: {
  rate: number;
  timestamp: number;
  source: string;
} | null = null;

const CACHE_DURATION = 3600 * 1000; // 1 saat
const RATE_LIMIT_DURATION = 60 * 60 * 1000; // 1 saat
const MAX_REQUESTS_PER_HOUR = 100;

// Rate limiting için basit in-memory store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting kontrolü
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_DURATION });
    return true;
  }

  if (userLimit.count >= MAX_REQUESTS_PER_HOUR) {
    return false;
  }

  userLimit.count++;
  return true;
}

// Client IP alma
// getClientIP artık ip-utils'den import ediliyor

// Frankfurter API'den EUR/TRY kuru çekme
async function fetchExchangeRate(): Promise<number> {
  try {
    // Frankfurter.app - Ücretsiz, API key gerektirmez, ECB verisi
    const response = await fetch(
      'https://api.frankfurter.app/latest?from=EUR&to=TRY',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(10000), // 10 saniye timeout
      }
    );

    if (!response.ok) {
      throw new Error(`Frankfurter API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.rates || !data.rates.TRY) {
      throw new Error('TRY kuru bulunamadı');
    }

    const rate = parseFloat(data.rates.TRY);

    if (isNaN(rate) || rate <= 0) {
      throw new Error('Geçersiz TRY kuru');
    }

    return rate;
  } catch (error) {
    console.error('Frankfurter API hatası:', error);
    throw error;
  }
}

// Fallback exchange rate (güncel yaklaşık değer)
function getFallbackExchangeRate(): number {
  // 2025 Ekim için yaklaşık EUR/TRY kuru
  return 38.5; // Bu değeri güncelleyin
}

// Cache kontrolü
function isCacheValid(): boolean {
  if (!exchangeRateCache) {
    return false;
  }

  const now = Date.now();
  return now - exchangeRateCache.timestamp < CACHE_DURATION;
}

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    // Rate limiting kontrolü
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message:
            'Çok fazla istek gönderildi. Lütfen 1 saat sonra tekrar deneyin.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': '3600',
            'X-RateLimit-Limit': MAX_REQUESTS_PER_HOUR.toString(),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // Cache kontrolü
    if (isCacheValid() && exchangeRateCache) {
      return NextResponse.json({
        success: true,
        rate: exchangeRateCache.rate,
        source: exchangeRateCache.source,
        cached: true,
        timestamp: exchangeRateCache.timestamp,
        message: "Cache'den alındı",
      });
    }

    // Frankfurter'den güncel kuru çek
    let rate: number;
    let source = 'Frankfurter (ECB)';

    try {
      rate = await fetchExchangeRate();
    } catch (error) {
      console.warn('Frankfurter API başarısız, fallback kullanılıyor:', error);
      rate = getFallbackExchangeRate();
      source = 'Fallback';
    }

    // Cache'i güncelle
    exchangeRateCache = {
      rate,
      timestamp: Date.now(),
      source,
    };

    return NextResponse.json({
      success: true,
      rate,
      source,
      cached: false,
      timestamp: exchangeRateCache.timestamp,
      message: `${source} API'sinden alındı`,
    });
  } catch (error) {
    console.error('Exchange rate API hatası:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Döviz kuru alınırken hata oluştu',
        fallback: getFallbackExchangeRate(),
      },
      { status: 500 }
    );
  }
}

// POST endpoint - TL miktarını EUR'ya çevirme
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    // Rate limiting kontrolü
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message:
            'Çok fazla istek gönderildi. Lütfen 1 saat sonra tekrar deneyin.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': '3600',
            'X-RateLimit-Limit': MAX_REQUESTS_PER_HOUR.toString(),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const body = await request.json();

    // Input validation
    if (typeof body.amount !== 'number' || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Geçerli bir TL miktarı giriniz' },
        { status: 400 }
      );
    }

    // Cache kontrolü
    if (!isCacheValid() || !exchangeRateCache) {
      // Frankfurter'den güncel kuru çek
      let rate: number;
      let source = 'Frankfurter (ECB)';

      try {
        rate = await fetchExchangeRate();
      } catch (error) {
        console.warn(
          'Frankfurter API başarısız, fallback kullanılıyor:',
          error
        );
        rate = getFallbackExchangeRate();
        source = 'Fallback';
      }

      // Cache'i güncelle
      exchangeRateCache = {
        rate,
        timestamp: Date.now(),
        source,
      };
    }

    const eurAmount = body.amount / exchangeRateCache!.rate;

    return NextResponse.json({
      success: true,
      tryAmount: body.amount,
      eurAmount: Math.round(eurAmount * 100) / 100, // 2 ondalık basamak
      rate: exchangeRateCache!.rate,
      source: exchangeRateCache!.source,
      timestamp: exchangeRateCache!.timestamp,
    });
  } catch (error) {
    console.error('Currency conversion hatası:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Para birimi dönüşümünde hata oluştu',
      },
      { status: 500 }
    );
  }
}
