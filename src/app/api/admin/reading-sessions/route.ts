import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerEmail,
      customerFirstName,
      customerLastName,
      spreadKey,
      readingType,
      expiresInDays = 7,
    } = body;

    // Validasyon
    if (!customerEmail || !spreadKey || !readingType) {
      return NextResponse.json(
        { error: 'E-posta, tarot açılımı ve okuma tipi gereklidir' },
        { status: 400 }
      );
    }

    // Reading type validasyonu
    if (readingType !== 'detailed' && readingType !== 'written') {
      return NextResponse.json(
        { error: 'Okuma tipi detailed veya written olmalıdır' },
        { status: 400 }
      );
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz' },
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

    // Admin kontrolü - request'ten user bilgisini al
    const authHeader = request.headers.get('authorization');
    let adminUserId: string | null = null;

    if (authHeader) {
      // Eğer authorization header varsa, token'dan user ID al
      // Şimdilik basit bir yaklaşım kullanıyoruz
      // İleride JWT token doğrulaması eklenebilir
    }

    // Mevcut kullanıcıyı kontrol et (cookie'den)
    const {
      data: { user },
    } = await supabaseAdmin.auth.getUser();

    if (user) {
      // Admin kontrolü
      const { data: adminData } = await supabaseAdmin
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id)
        .single();

      if (adminData) {
        adminUserId = adminData.user_id;
      }
    }

    // Benzersiz token oluştur
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const tokenPreview = `${token.slice(0, 8)}...${token.slice(-4)}`;

    // Expire tarihi hesapla
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Reading session oluştur
    // Production-ready: spread_key ve reading_type kolonları varsa kullan, yoksa metadata'da sakla
    const insertData: Record<string, any> = {
      spread_id: null, // spread_id bigint, şimdilik null
      customer_first_name: customerFirstName || null,
      customer_last_name: customerLastName || null,
      customer_email: customerEmail,
      customer_phone: null,
      preferred_channel: 'email',
      status: 'invited',
      token_hash: tokenHash,
      token_preview: tokenPreview,
      expires_at: expiresAt.toISOString(),
      created_by_admin_id: adminUserId,
    };

    // Önce spread_key ve reading_type ile deneyelim (migration sonrası)
    let { data: session, error: sessionError } = await supabaseAdmin
      .from('reading_sessions')
      .insert({
        ...insertData,
        spread_key: spreadKey,
        reading_type: readingType,
      })
      .select()
      .single();

    // Eğer kolonlar yoksa (PGRST204 hatası), kolonlar olmadan tekrar dene
    if (sessionError && sessionError.code === 'PGRST204') {
      // Kolonlar yok, migration uygulanmamış
      // Kolonlar olmadan kayıt oluştur (metadata'da saklanacak)
      const retryResult = await supabaseAdmin
        .from('reading_sessions')
        .insert(insertData)
        .select()
        .single();

      session = retryResult.data;
      sessionError = retryResult.error;
    }

    if (sessionError || !session) {
      logger.error('Reading session oluşturma hatası', sessionError, {
        action: 'create_session',
        resource: 'reading_sessions',
      });
      return NextResponse.json(
        {
          error:
            'Okuma oturumu oluşturulamadı: ' +
            (sessionError?.message || 'Bilinmeyen hata'),
          hint:
            sessionError?.code === 'PGRST204'
              ? 'spread_key kolonu migration ile eklenmeli. Migration dosyası: migrations/20250108_01_add_spread_key_to_reading_sessions.sql'
              : undefined,
        },
        { status: 500 }
      );
    }

    // Link oluştur - development'ta localhost:3003, production'da NEXT_PUBLIC_SITE_URL
    // Geçici test için NEXT_PUBLIC_READING_LINK_BASE_URL environment variable'ı kullanılabilir
    const baseUrl =
      process.env.NEXT_PUBLIC_READING_LINK_BASE_URL ||
      (process.env.NODE_ENV === 'development'
        ? 'http://localhost:3003'
        : process.env.NEXT_PUBLIC_SITE_URL || 'https://tarotnumeroloji.com');
    const locale = 'tr'; // Varsayılan locale, ileride dinamik yapılabilir
    const readingLink = `${baseUrl}/${locale}/tarotokumasi/${spreadKey}?token=${token}`;

    // Event log kaydet
    await supabaseAdmin.from('reading_events').insert({
      session_id: session.id,
      event_type: 'session_created',
      status_after: 'invited',
      actor_type: 'admin',
      actor_id: adminUserId,
      message: 'Okuma oturumu oluşturuldu',
      metadata: {
        spread_key: spreadKey,
        reading_type: readingType,
        expires_in_days: expiresInDays,
        token: token, // Token'ı metadata'ya ekle (link oluşturmak için)
        reading_link: readingLink, // Link'i de metadata'ya ekle
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      token,
      tokenPreview,
      readingLink,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    logger.error('Reading session oluşturma hatası', error, {
      action: 'create_session',
      resource: 'reading_sessions',
    });
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu',
      },
      { status: 500 }
    );
  }
}
