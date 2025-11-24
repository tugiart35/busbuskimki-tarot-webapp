import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { logger } from '@/lib/logger';
import { ValidateTokenResponse, DrawnCard } from '@/types/aklindaki-kisi.types';
import {
  filterValidDrawnCardsByMidnight,
  getTodayInTimezone,
  getDateFromTimestamp,
} from '@/lib/aklindaki-kisi/utils';

// last_24_drawn_cards'ı DrawnCard[] formatına çevir (JSONB'den geliyor)
function parseDrawnCards(data: any): DrawnCard[] {
  if (!data) {
    return [];
  }

  // Eğer zaten array ise
  if (Array.isArray(data)) {
    // Eski format (number[]) kontrolü
    if (data.length > 0 && typeof data[0] === 'number') {
      return []; // Eski formatı boş array'e çevir
    }

    // Yeni format kontrolü
    return data.filter((item): item is DrawnCard => {
      return (
        item &&
        typeof item === 'object' &&
        'cardNumber' in item &&
        'drawnAt' in item &&
        typeof item.cardNumber === 'number' &&
        typeof item.drawnAt === 'string'
      );
    });
  }

  return [];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email'); // Kullanıcının girdiği e-posta
    const timezone = searchParams.get('timezone') || 'Europe/Istanbul'; // Türkiye timezone varsayılan

    if (!token) {
      return NextResponse.json<ValidateTokenResponse>(
        { valid: false, error: 'Token gereklidir' },
        { status: 400 }
      );
    }

    // Supabase admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Token hash hesapla (token zaten decode edilmiş geliyor)
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    logger.info('Token doğrulama başladı', {
      action: 'validate_token',
      metadata: {
        tokenLength: token.length,
        tokenHash: tokenHash.substring(0, 16) + '...',
      },
    });

    // Customer link bul
    const { data: customerLink, error: linkError } = await supabaseAdmin
      .from('customer_links')
      .select('*')
      .eq('token_hash', tokenHash)
      .single();

    if (linkError || !customerLink) {
      logger.warn('Token bulunamadı', {
        action: 'validate_token',
        metadata: {
          error: linkError?.message,
          tokenHash: tokenHash.substring(0, 16) + '...',
        },
      });
      return NextResponse.json<ValidateTokenResponse>(
        { valid: false, error: 'Geçersiz veya bulunamayan token' },
        { status: 404 }
      );
    }

    logger.info('Token bulundu', {
      action: 'validate_token',
      metadata: {
        customerEmail: customerLink.customer_email,
        status: customerLink.status,
      },
    });

    // Status kontrolü
    if (customerLink.status !== 'active') {
      return NextResponse.json<ValidateTokenResponse>(
        {
          valid: false,
          error: 'Bu link artık kullanılamaz',
          expired: customerLink.status === 'expired',
        },
        { status: 410 }
      );
    }

    // Expiry date kontrolü
    if (customerLink.expiry_date) {
      const expiryDate = new Date(customerLink.expiry_date);
      const now = new Date();

      if (expiryDate < now) {
        // Status'u expired olarak güncelle
        await supabaseAdmin
          .from('customer_links')
          .update({ status: 'expired' })
          .eq('id', customerLink.id);

        return NextResponse.json<ValidateTokenResponse>(
          {
            valid: false,
            error: 'Bu linkin süresi dolmuş',
            expired: true,
          },
          { status: 410 }
        );
      }
    }

    // E-posta doğrulama kontrolü
    // searchParams.get() zaten decode ediyor, tekrar decode etmeye gerek yok
    if (email) {
      // E-posta adreslerini küçük harfe çevirip karşılaştır
      const normalizedInputEmail = email.toLowerCase().trim();
      const normalizedLinkEmail = customerLink.customer_email
        .toLowerCase()
        .trim();

      logger.info('E-posta doğrulama kontrolü', {
        action: 'validate_email',
        metadata: {
          rawEmail: email,
          inputEmail: normalizedInputEmail,
          linkEmail: normalizedLinkEmail,
          match: normalizedInputEmail === normalizedLinkEmail,
        },
      });

      if (normalizedInputEmail !== normalizedLinkEmail) {
        return NextResponse.json<ValidateTokenResponse>(
          {
            valid: false,
            error: `E-posta adresi link ile eşleşmiyor. Beklenen: ${customerLink.customer_email}, Gelen: ${normalizedInputEmail}`,
            requiresEmail: true,
          },
          { status: 403 }
        );
      }

      // E-posta doğru, devam et
      // Card session'ı al ve remainingCards hesapla
      const customerEmail = customerLink.customer_email;
      const { data: cardSession } = await supabaseAdmin
        .from('card_sessions')
        .select('*')
        .eq('customer_email', customerEmail)
        .single();

      let remainingCards: number | undefined = 3; // Varsayılan değer
      let periodStartDate: string | undefined = undefined;
      let resetCountdown: number | undefined = undefined;
      let periodDaysRemaining: number | undefined = undefined;
      let resetDaysRemaining: number | undefined = undefined;
      let openedCards: number[] = [];

      if (cardSession) {
        const now = new Date();

        // last_24_drawn_cards'ı parse et ve gece yarısı kontrolü ile filtrele
        const parsedDrawnCards = parseDrawnCards(
          cardSession.last_24_drawn_cards
        );
        const validDrawnCards = filterValidDrawnCardsByMidnight(
          parsedDrawnCards,
          timezone
        );

        // Eğer gece yarısı geçen kartlar varsa, database'i güncelle
        if (parsedDrawnCards.length !== validDrawnCards.length) {
          await supabaseAdmin
            .from('card_sessions')
            .update({
              last_24_drawn_cards: validDrawnCards,
              updated_at: now.toISOString(),
            })
            .eq('id', cardSession.id);

          // Session'ı güncelle
          cardSession.last_24_drawn_cards = validDrawnCards as any;
        }

        // Period kontrolü - 31 gün geçtiyse period_start_date, cards_drawn_today_count ve period_drawn_cards'ı sıfırla
        const sessionPeriodStartDate = cardSession.period_start_date
          ? new Date(cardSession.period_start_date)
          : null;

        // period_drawn_cards'ı parse et (null veya undefined ise boş array)
        const parsedPeriodDrawnCards = parseDrawnCards(
          cardSession.period_drawn_cards ?? null
        );

        // Eğer period_drawn_cards null veya undefined ise, database'e boş array olarak kaydet
        if (
          cardSession.period_drawn_cards === null ||
          cardSession.period_drawn_cards === undefined
        ) {
          await supabaseAdmin
            .from('card_sessions')
            .update({
              period_drawn_cards: [],
              updated_at: now.toISOString(),
            })
            .eq('id', cardSession.id);

          cardSession.period_drawn_cards = [] as any;
        }

        if (sessionPeriodStartDate) {
          const daysSinceStart =
            (now.getTime() - sessionPeriodStartDate.getTime()) /
            (1000 * 60 * 60 * 24);

          if (daysSinceStart >= 31) {
            // 31 gün geçti, period ve günlük sayacı sıfırla, period_drawn_cards'ı da temizle
            await supabaseAdmin
              .from('card_sessions')
              .update({
                period_start_date: null,
                cards_drawn_today_count: 0,
                period_drawn_cards: [],
                updated_at: now.toISOString(),
              })
              .eq('id', cardSession.id);

            // Session'ı güncelle
            cardSession.period_start_date = null;
            cardSession.cards_drawn_today_count = 0;
            cardSession.period_drawn_cards = [] as any;
          } else {
            // Sayaç devam ediyor, reset countdown hesapla
            periodStartDate = cardSession.period_start_date;
            const resetDate = new Date(
              sessionPeriodStartDate.getTime() + 31 * 24 * 60 * 60 * 1000
            ); // +31 gün
            const remainingTime = resetDate.getTime() - now.getTime();
            resetCountdown = remainingTime > 0 ? remainingTime : 0;

            // 30 günlük aktif dönem kontrolü
            const periodEndDate = new Date(
              sessionPeriodStartDate.getTime() + 30 * 24 * 60 * 60 * 1000
            ); // +30 gün

            if (now < periodEndDate) {
              // Hala 30 günlük aktif dönemde
              const periodRemainingTime =
                periodEndDate.getTime() - now.getTime();
              periodDaysRemaining = Math.ceil(
                periodRemainingTime / (1000 * 60 * 60 * 24)
              );
            } else {
              // 30 gün geçti, 1 günlük geri sayım başladı
              const resetRemainingTime = resetDate.getTime() - now.getTime();
              resetDaysRemaining = Math.ceil(
                resetRemainingTime / (1000 * 60 * 60 * 24)
              );
            }
          }
        }

        // Gece yarısı kontrolü - cards_drawn_today_count sıfırlama
        const lastDrawDate = cardSession.last_draw_date
          ? new Date(cardSession.last_draw_date)
          : null;

        let cardsDrawnTodayCount = cardSession.cards_drawn_today_count;

        // Eğer son çekilen kart bugünden farklı bir günde çekildiyse, sayacı sıfırla
        if (lastDrawDate) {
          const today = getTodayInTimezone(timezone);
          const lastDrawDateStr = getDateFromTimestamp(
            lastDrawDate.toISOString(),
            timezone
          );

          // Eğer son çekilen kart bugünden farklı bir günde çekildiyse
          if (lastDrawDateStr !== today) {
            cardsDrawnTodayCount = 0;
            // Database'e kaydet
            await supabaseAdmin
              .from('card_sessions')
              .update({
                cards_drawn_today_count: 0,
                updated_at: now.toISOString(),
              })
              .eq('id', cardSession.id);
          }
        }

        // Test token kontrolü - özel test linkleri için sınırsız
        const testTokens = [
          '6cee9bde3e92dacffebceb951b63637d6a0db2d63298e6209bfef2d60deedf1d',
          'e6e91e66450805433f08e385b89c45ea4bd201c12ab6a4314b54cfd50c8ebca7',
        ];
        const isTestToken = testTokens.some(testToken => {
          const testTokenHash = crypto
            .createHash('sha256')
            .update(testToken)
            .digest('hex');
          return tokenHash === testTokenHash;
        });
        const dailyLimit = isTestToken ? Infinity : 3;

        remainingCards = isTestToken
          ? undefined // Test token için sınırsız, undefined döndür
          : Math.max(0, dailyLimit - cardsDrawnTodayCount);

        // Açılan kartları al (period başlangıcından beri çekilen tüm kartlar - unique)
        // period_drawn_cards period sonuna kadar birikir, 31 gün sonra sıfırlanır
        openedCards = parsedPeriodDrawnCards
          .map(drawnCard => drawnCard.cardNumber)
          .filter(
            (cardNumber, index, self) => self.indexOf(cardNumber) === index
          ); // Unique
      }

      return NextResponse.json<ValidateTokenResponse>({
        valid: true,
        customerEmail: customerLink.customer_email,
        ...(remainingCards !== undefined && { remainingCards }),
        openedCards,
        ...(periodStartDate && { periodStartDate }),
        ...(resetCountdown !== undefined && { resetCountdown }),
        ...(periodDaysRemaining !== undefined && { periodDaysRemaining }),
        ...(resetDaysRemaining !== undefined && { resetDaysRemaining }),
      });
    }

    // E-posta girilmemiş, e-posta girişi gerekiyor
    return NextResponse.json<ValidateTokenResponse>({
      valid: false,
      requiresEmail: true,
      customerEmail: customerLink.customer_email, // Kısmen gizli gösterilebilir
    });
  } catch (error) {
    logger.error('Token doğrulama hatası', error, {
      action: 'validate_token',
      resource: 'customer_links',
    });

    return NextResponse.json<ValidateTokenResponse>(
      {
        valid: false,
        error: 'Token doğrulanırken bir hata oluştu',
      },
      { status: 500 }
    );
  }
}
