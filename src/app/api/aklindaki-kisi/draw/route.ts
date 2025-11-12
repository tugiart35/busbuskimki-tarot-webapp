import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { logger } from '@/lib/logger';
import {
  DrawCardRequest,
  DrawCardResponse,
  DrawnCard,
} from '@/types/aklindaki-kisi.types';

// 24 saat geçen kartları filtrele
function filterValidDrawnCards(
  drawnCards: DrawnCard[] | null | undefined
): DrawnCard[] {
  if (!drawnCards || !Array.isArray(drawnCards)) {
    return [];
  }

  const now = new Date();
  const twentyFourHoursAgo = now.getTime() - 24 * 60 * 60 * 1000;

  return drawnCards.filter(drawnCard => {
    // Eski format (number[]) desteği - migration sırasında geçiş için
    if (typeof drawnCard === 'number') {
      return false; // Eski formatı kabul etme
    }

    // Yeni format (DrawnCard) kontrolü
    if (
      drawnCard &&
      typeof drawnCard === 'object' &&
      'cardNumber' in drawnCard &&
      'drawnAt' in drawnCard
    ) {
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

export async function POST(request: NextRequest) {
  try {
    const body: DrawCardRequest = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json<DrawCardResponse>(
        { success: false, error: 'Token gereklidir' },
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

    // Token hash hesapla ve doğrula
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const { data: customerLink, error: linkError } = await supabaseAdmin
      .from('customer_links')
      .select('*')
      .eq('token_hash', tokenHash)
      .eq('status', 'active')
      .single();

    if (linkError || !customerLink) {
      return NextResponse.json<DrawCardResponse>(
        { success: false, error: 'Geçersiz veya aktif olmayan token' },
        { status: 404 }
      );
    }

    // Expiry date kontrolü
    if (customerLink.expiry_date) {
      const expiryDate = new Date(customerLink.expiry_date);
      if (expiryDate < new Date()) {
        await supabaseAdmin
          .from('customer_links')
          .update({ status: 'expired' })
          .eq('id', customerLink.id);

        return NextResponse.json<DrawCardResponse>(
          { success: false, error: 'Bu linkin süresi dolmuş' },
          { status: 410 }
        );
      }
    }

    const customerEmail = customerLink.customer_email;
    const now = new Date();

    // Card session'ı al veya oluştur
    let { data: cardSession, error: sessionError } = await supabaseAdmin
      .from('card_sessions')
      .select('*')
      .eq('customer_email', customerEmail)
      .single();

    if (sessionError && sessionError.code === 'PGRST116') {
      // Session yok, oluştur
      const { data: newSession, error: createError } = await supabaseAdmin
        .from('card_sessions')
        .insert({
          customer_email: customerEmail,
          cards_drawn_today_count: 0,
          last_24_drawn_cards: [], // JSONB array
          period_start_date: null, // İlk kart çekildiğinde set edilecek
        })
        .select()
        .single();

      if (createError || !newSession) {
        logger.error('Card session oluşturma hatası', createError, {
          action: 'create_card_session',
          resource: 'card_sessions',
        });
        return NextResponse.json<DrawCardResponse>(
          { success: false, error: 'Session oluşturulamadı' },
          { status: 500 }
        );
      }

      cardSession = newSession;
    } else if (sessionError) {
      logger.error('Card session okuma hatası', sessionError, {
        action: 'read_card_session',
        resource: 'card_sessions',
      });
      return NextResponse.json<DrawCardResponse>(
        { success: false, error: 'Session okunamadı' },
        { status: 500 }
      );
    }

    if (!cardSession) {
      return NextResponse.json<DrawCardResponse>(
        { success: false, error: 'Session bulunamadı' },
        { status: 404 }
      );
    }

    // Günlük hak kontrolü
    const lastDrawDate = cardSession.last_draw_date
      ? new Date(cardSession.last_draw_date)
      : null;

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
    const periodStartDate = cardSession.period_start_date
      ? new Date(cardSession.period_start_date)
      : null;

    if (periodStartDate) {
      const daysSinceStart =
        (now.getTime() - periodStartDate.getTime()) / (1000 * 60 * 60 * 24);

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
      }
    }

    // 24 saat geçtiyse sayacı sıfırla ve database'e kaydet
    if (lastDrawDate) {
      const hoursSinceLastDraw =
        (now.getTime() - lastDrawDate.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastDraw >= 24) {
        cardSession.cards_drawn_today_count = 0;
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

    // Günlük limit kontrolü (test token için kontrol yapma)
    if (!isTestToken && cardSession.cards_drawn_today_count >= dailyLimit) {
      return NextResponse.json<DrawCardResponse>(
        {
          success: false,
          error: `Günlük ${dailyLimit} kart çekme hakkınızı doldurdunuz. Yeni hakkınız için bekleyiniz.`,
          dailyLimitReached: true,
          remainingCards: 0,
        },
        { status: 429 }
      );
    }

    // Tüm kartları al
    const { data: allCards, error: cardsError } = await supabaseAdmin
      .from('all_cards')
      .select('*')
      .order('card_number', { ascending: true });

    if (cardsError || !allCards || allCards.length === 0) {
      logger.error('Kartlar okunamadı', cardsError, {
        action: 'read_all_cards',
        resource: 'all_cards',
      });
      return NextResponse.json<DrawCardResponse>(
        { success: false, error: 'Kartlar yüklenemedi' },
        { status: 500 }
      );
    }

    // Son 24 saat içinde çekilen kartları filtrele (tekrar çekilemez)
    const recentlyDrawnCardNumbers = new Set(
      validDrawnCards.map(drawnCard => drawnCard.cardNumber)
    );
    const availableCards = allCards.filter(
      card => !recentlyDrawnCardNumbers.has(card.card_number)
    );

    // Eğer tüm kartlar çekildiyse, listeyi sıfırla
    const cardsToUse = availableCards.length > 0 ? availableCards : allCards;

    // Rastgele kart seç
    const randomIndex = Math.floor(Math.random() * cardsToUse.length);
    const selectedCard = cardsToUse[randomIndex];

    // Yeni çekilen kartı ekle (zaman damgası ile)
    const newDrawnCard: DrawnCard = {
      cardNumber: selectedCard.card_number,
      drawnAt: now.toISOString(),
    };

    // FIFO mantığıyla en fazla 24 kart tut (24 saat kontrolü ile - açılan kartlar 24 saat sonra kapanır)
    const newLast24DrawnCards = [newDrawnCard, ...validDrawnCards].slice(0, 24);

    // İlk kart çekildiğinde period_start_date'i kaydet
    const updateData: any = {
      cards_drawn_today_count: cardSession.cards_drawn_today_count + 1,
      last_24_drawn_cards: newLast24DrawnCards,
      last_draw_date: now.toISOString(),
      updated_at: now.toISOString(),
    };

    // Eğer period_start_date yoksa (ilk kart çekiliyorsa), kaydet
    if (!cardSession.period_start_date) {
      updateData.period_start_date = now.toISOString();
    }

    const { error: updateError } = await supabaseAdmin
      .from('card_sessions')
      .update(updateData)
      .eq('id', cardSession.id);

    if (updateError) {
      logger.error('Card session güncelleme hatası', updateError, {
        action: 'update_card_session',
        resource: 'card_sessions',
      });
      return NextResponse.json<DrawCardResponse>(
        { success: false, error: 'Session güncellenemedi' },
        { status: 500 }
      );
    }

    const remainingCards = isTestToken
      ? undefined // Test token için sınırsız, undefined döndür
      : Math.max(0, dailyLimit - (cardSession.cards_drawn_today_count + 1));

    // Period start date ve reset countdown hesapla
    const finalPeriodStartDate =
      updateData.period_start_date || cardSession.period_start_date;
    let resetCountdown: number | undefined = undefined;
    let periodDaysRemaining: number | undefined = undefined;
    let resetDaysRemaining: number | undefined = undefined;

    if (finalPeriodStartDate) {
      const periodStartDateObj = new Date(finalPeriodStartDate);
      const resetDate = new Date(
        periodStartDateObj.getTime() + 31 * 24 * 60 * 60 * 1000
      ); // +31 gün
      const remainingTime = resetDate.getTime() - now.getTime();

      if (remainingTime > 0) {
        resetCountdown = remainingTime;

        // 30 günlük aktif dönem kontrolü
        const periodEndDate = new Date(
          periodStartDateObj.getTime() + 30 * 24 * 60 * 60 * 1000
        ); // +30 gün

        if (now < periodEndDate) {
          // Hala 30 günlük aktif dönemde
          const periodRemainingTime = periodEndDate.getTime() - now.getTime();
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
      } else {
        // Süre dolmuş, sıfırlanmış olmalı
        resetCountdown = 0;
      }
    }

    return NextResponse.json<DrawCardResponse>({
      success: true,
      card: {
        id: selectedCard.id,
        card_number: selectedCard.card_number,
        card_name: selectedCard.card_name,
        image_path: selectedCard.image_path,
      },
      ...(remainingCards !== undefined && { remainingCards }),
      ...(finalPeriodStartDate && { periodStartDate: finalPeriodStartDate }),
      ...(resetCountdown !== undefined && { resetCountdown }),
      ...(periodDaysRemaining !== undefined && { periodDaysRemaining }),
      ...(resetDaysRemaining !== undefined && { resetDaysRemaining }),
    });
  } catch (error) {
    logger.error('Kart çekme hatası', error, {
      action: 'draw_card',
      resource: 'card_sessions',
    });

    return NextResponse.json<DrawCardResponse>(
      {
        success: false,
        error: 'Kart çekilirken bir hata oluştu',
      },
      { status: 500 }
    );
  }
}
