import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { logger } from '@/lib/logger';
import { ValidateTokenResponse, DrawnCard } from '@/types/aklindaki-kisi.types';
import { getClientIP, cleanIPAddress } from '@/lib/utils/ip-utils';

// 24 saat geçen kartları filtrele
function filterValidDrawnCards(drawnCards: DrawnCard[] | null | undefined): DrawnCard[] {
  if (!drawnCards || !Array.isArray(drawnCards)) {
    return [];
  }

  const now = new Date();
  const twentyFourHoursAgo = now.getTime() - 24 * 60 * 60 * 1000;

  return drawnCards.filter((drawnCard) => {
    // Eski format (number[]) desteği - migration sırasında geçiş için
    if (typeof drawnCard === 'number') {
      return false; // Eski formatı kabul etme
    }

    // Yeni format (DrawnCard) kontrolü
    if (drawnCard && typeof drawnCard === 'object' && 'cardNumber' in drawnCard && 'drawnAt' in drawnCard) {
      const drawnAt = new Date(drawnCard.drawnAt);
      return drawnAt.getTime() > twentyFourHoursAgo;
    }

    return false;
  });
}

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
      const normalizedLinkEmail = customerLink.customer_email.toLowerCase().trim();

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

      // E-posta doğru, IP kontrolü yap
      const clientIP = cleanIPAddress(getClientIP(request));
      const allowedIPs = (customerLink.allowed_ips as string[]) || [];

      logger.info('IP kontrolü başladı', {
        action: 'check_ip',
        metadata: {
          linkId: customerLink.id,
          clientIP,
          currentIPs: allowedIPs,
          ipCount: allowedIPs.length,
        },
      });

      // Eğer IP zaten listede değilse
      if (!allowedIPs.includes(clientIP)) {
        // Maksimum 3 IP kontrolü
        if (allowedIPs.length >= 3) {
          logger.warn('IP limiti aşıldı', {
            action: 'ip_limit_reached',
            metadata: {
              linkId: customerLink.id,
              clientIP,
              currentIPs: allowedIPs,
            },
          });

          return NextResponse.json<ValidateTokenResponse>(
            {
              valid: false,
              error:
                'Bu link maksimum 3 farklı cihazdan açılabilir. Lütfen daha önce kullandığınız bir cihazdan giriş yapın.',
              ipLimitReached: true,
            },
            { status: 403 }
          );
        }

        // Yeni IP'yi ekle
        const updatedIPs = [...allowedIPs, clientIP];
        const { error: updateError } = await supabaseAdmin
          .from('customer_links')
          .update({
            allowed_ips: updatedIPs,
            updated_at: new Date().toISOString(),
          })
          .eq('id', customerLink.id);

        if (updateError) {
          logger.error('IP güncelleme hatası', updateError, {
            action: 'update_allowed_ips',
            metadata: {
              linkId: customerLink.id,
              clientIP,
            },
          });
          // Hata olsa bile devam et (IP kaydedilemese bile erişim izni ver)
        } else {
          logger.info('Yeni IP eklendi', {
            action: 'add_ip',
            metadata: {
              linkId: customerLink.id,
              newIP: clientIP,
              totalIPs: updatedIPs.length,
            },
          });
        }
      } else {
        logger.info('IP zaten kayıtlı', {
          action: 'ip_already_exists',
          metadata: {
            linkId: customerLink.id,
            clientIP,
          },
        });
      }

      // E-posta doğru, IP kontrolü geçti
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

        // last_24_drawn_cards'ı parse et ve 24 saat geçen kartları filtrele
        const parsedDrawnCards = parseDrawnCards(cardSession.last_24_drawn_cards);
        const validDrawnCards = filterValidDrawnCards(parsedDrawnCards);

        // Eğer 24 saat geçen kartlar varsa, database'i güncelle
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
        
        // Period kontrolü - 31 gün geçtiyse sadece period_start_date ve cards_drawn_today_count'u sıfırla
        // Açılan kartlar 24 saat kontrolü ile yönetiliyor, period kontrolüne gerek yok
        const sessionPeriodStartDate = cardSession.period_start_date
          ? new Date(cardSession.period_start_date)
          : null;

        if (sessionPeriodStartDate) {
          const daysSinceStart =
            (now.getTime() - sessionPeriodStartDate.getTime()) / (1000 * 60 * 60 * 24);

          if (daysSinceStart >= 31) {
            // 31 gün geçti, sadece period ve günlük sayacı sıfırla (açılan kartlar 24 saat kontrolü ile yönetiliyor)
            await supabaseAdmin
              .from('card_sessions')
              .update({
                period_start_date: null,
                cards_drawn_today_count: 0,
                updated_at: now.toISOString(),
              })
              .eq('id', cardSession.id);

            // Session'ı güncelle
            cardSession.period_start_date = null;
            cardSession.cards_drawn_today_count = 0;
          } else {
            // Sayaç devam ediyor, reset countdown hesapla
            periodStartDate = cardSession.period_start_date;
            const resetDate = new Date(sessionPeriodStartDate.getTime() + 31 * 24 * 60 * 60 * 1000); // +31 gün
            const remainingTime = resetDate.getTime() - now.getTime();
            resetCountdown = remainingTime > 0 ? remainingTime : 0;
            
            // 30 günlük aktif dönem kontrolü
            const periodEndDate = new Date(sessionPeriodStartDate.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 gün
            
            if (now < periodEndDate) {
              // Hala 30 günlük aktif dönemde
              const periodRemainingTime = periodEndDate.getTime() - now.getTime();
              periodDaysRemaining = Math.ceil(periodRemainingTime / (1000 * 60 * 60 * 24));
            } else {
              // 30 gün geçti, 1 günlük geri sayım başladı
              const resetRemainingTime = resetDate.getTime() - now.getTime();
              resetDaysRemaining = Math.ceil(resetRemainingTime / (1000 * 60 * 60 * 24));
            }
          }
        }

        // 24 saat kontrolü
        const lastDrawDate = cardSession.last_draw_date
          ? new Date(cardSession.last_draw_date)
          : null;

        let cardsDrawnTodayCount = cardSession.cards_drawn_today_count;
        
        // 24 saat geçtiyse sayacı sıfırla ve database'e kaydet
        if (lastDrawDate) {
          const hoursSinceLastDraw =
            (now.getTime() - lastDrawDate.getTime()) / (1000 * 60 * 60);

          if (hoursSinceLastDraw >= 24) {
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
        const isTestToken = testTokens.some((testToken) => {
          const testTokenHash = crypto.createHash('sha256').update(testToken).digest('hex');
          return tokenHash === testTokenHash;
        });
        const dailyLimit = isTestToken ? Infinity : 3;

        remainingCards = isTestToken 
          ? undefined // Test token için sınırsız, undefined döndür
          : Math.max(0, dailyLimit - cardsDrawnTodayCount);

        // Açılan kartları al (24 saat içinde çekilen kartlar - unique)
        openedCards = validDrawnCards
          .map((drawnCard) => drawnCard.cardNumber)
          .filter((cardNumber, index, self) => self.indexOf(cardNumber) === index); // Unique
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

