import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import crypto from 'crypto';
import { logger } from '@/lib/logger';
import {
  CreateCustomerLinkRequest,
  CreateCustomerLinkResponse,
  GetLinksResponse,
} from '@/types/aklindaki-kisi.types';
import {
  getTodayInTimezone,
  getDateFromTimestamp,
} from '@/lib/aklindaki-kisi/utils';

// GET - Link listesi
export async function GET(request: NextRequest) {
  try {
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

    // Cookie'lerden user bilgisini al (createServerClient ile)
    const supabaseClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {
            // API route'larında cookie set edilemez
          },
        },
      }
    );

    let isAdmin = false;

    try {
      const {
        data: { user },
        error: userError,
      } = await supabaseClient.auth.getUser();

      if (user && !userError) {
        const { data: adminData } = await supabaseAdmin
          .from('admins')
          .select('user_id')
          .eq('user_id', user.id)
          .single();

        if (adminData) {
          isAdmin = true;
        }
      }
    } catch (error) {
      logger.warn('Admin kontrolü hatası', error, {
        action: 'admin_auth_check',
        resource: 'customer_links',
      });
    }

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin yetkisi gereklidir' },
        { status: 403 }
      );
    }

    // Tüm linkleri al ve card_sessions ile join et
    const { data: links, error: linksError } = await supabaseAdmin
      .from('customer_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (linksError) {
      logger.error('Link listesi okuma hatası', linksError, {
        action: 'list_customer_links',
        resource: 'customer_links',
      });
      return NextResponse.json(
        { error: 'Linkler yüklenemedi' },
        { status: 500 }
      );
    }

    // Türkiye timezone'u kullan
    const timezone = 'Europe/Istanbul';
    const today = getTodayInTimezone(timezone);

    // Her link için card_session bilgilerini al
    const linksWithActivity = await Promise.all(
      (links || []).map(async link => {
        const { data: cardSession } = await supabaseAdmin
          .from('card_sessions')
          .select('*')
          .eq('customer_email', link.customer_email)
          .single();

        // Link durumunu kontrol et
        let status = link.status;
        if (status === 'active' && link.expiry_date) {
          const expiryDate = new Date(link.expiry_date);
          if (expiryDate < new Date()) {
            status = 'expired';
          }
        }

        // Gece yarısı kontrolü - cards_drawn_today_count hesaplama
        let totalCardsDrawn = 0;
        if (cardSession) {
          if (cardSession.last_draw_date) {
            const lastDrawDate = new Date(cardSession.last_draw_date);
            const lastDrawDateStr = getDateFromTimestamp(
              lastDrawDate.toISOString(),
              timezone
            );

            // Eğer son çekilen kart bugünden farklı bir günde çekildiyse, sayacı 0 yap
            if (lastDrawDateStr !== today) {
              totalCardsDrawn = 0;
            } else {
              // Bugün çekilen kartlar için, database'deki değeri kullan
              totalCardsDrawn = cardSession.cards_drawn_today_count || 0;
            }
          } else {
            // last_draw_date null ise, bugün hiç kart çekilmemiş
            totalCardsDrawn = 0;
          }
        }

        return {
          ...link,
          status,
          cardSession: cardSession || null,
          totalCardsDrawn,
          lastDrawDate: cardSession?.last_draw_date || null,
        };
      })
    );

    return NextResponse.json<GetLinksResponse>({
      success: true,
      links: linksWithActivity,
    });
  } catch (error) {
    logger.error('Link listesi hatası', error, {
      action: 'list_customer_links',
      resource: 'customer_links',
    });

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Linkler yüklenemedi',
      },
      { status: 500 }
    );
  }
}

// POST - Link oluşturma
export async function POST(request: NextRequest) {
  try {
    const body: CreateCustomerLinkRequest = await request.json();
    const { customerEmail, expiresInDays = 7 } = body;

    // Validasyon
    if (!customerEmail) {
      return NextResponse.json<CreateCustomerLinkResponse>(
        { success: false, error: 'Müşteri e-postası gereklidir' },
        { status: 400 }
      );
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json<CreateCustomerLinkResponse>(
        { success: false, error: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400 }
      );
    }

    // Supabase admin client (service role ile)
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

    // Cookie'lerden user bilgisini al (createServerClient ile)
    const supabaseClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {
            // API route'larında cookie set edilemez
          },
        },
      }
    );

    let adminUserId: string | null = null;

    try {
      // Cookie'lerden user bilgisini al
      const {
        data: { user },
        error: userError,
      } = await supabaseClient.auth.getUser();

      if (user && !userError) {
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
    } catch (error) {
      logger.warn('Admin kontrolü hatası', error, {
        action: 'admin_auth_check',
        resource: 'customer_links',
      });
    }

    // Admin kontrolü başarısız
    if (!adminUserId) {
      logger.warn('Admin yetkisi kontrolü başarısız', {
        action: 'create_customer_link',
        resource: 'customer_links',
      });
      return NextResponse.json<CreateCustomerLinkResponse>(
        {
          success: false,
          error: 'Admin yetkisi gereklidir. Lütfen admin olarak giriş yapın.',
        },
        { status: 403 }
      );
    }

    // Benzersiz token oluştur
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const tokenPreview = `${token.slice(0, 8)}...${token.slice(-4)}`;

    // Expire tarihi hesapla (opsiyonel - expiresInDays 0 veya negatif ise null)
    const expiresAt =
      expiresInDays > 0
        ? (() => {
            const date = new Date();
            date.setDate(date.getDate() + expiresInDays);
            return date.toISOString();
          })()
        : null;

    // Customer link oluştur
    const { data: customerLink, error: linkError } = await supabaseAdmin
      .from('customer_links')
      .insert({
        customer_email: customerEmail,
        token,
        token_hash: tokenHash,
        token_preview: tokenPreview,
        expiry_date: expiresAt,
        status: 'active',
        created_by_admin_id: adminUserId,
      })
      .select()
      .single();

    if (linkError || !customerLink) {
      logger.error('Customer link oluşturma hatası', linkError, {
        action: 'create_customer_link',
        resource: 'customer_links',
      });
      return NextResponse.json<CreateCustomerLinkResponse>(
        {
          success: false,
          error:
            'Link oluşturulamadı: ' + (linkError?.message || 'Bilinmeyen hata'),
        },
        { status: 500 }
      );
    }

    // Link oluştur
    const baseUrl =
      process.env.NEXT_PUBLIC_READING_LINK_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://www.busbuskimki.com';
    const locale = 'tr'; // Varsayılan locale
    const link = `${baseUrl}/${locale}/aklindaki-kisi?token=${token}`;

    logger.info('Customer link oluşturuldu', {
      action: 'create_customer_link',
      resource: 'customer_links',
      metadata: {
        linkId: customerLink.id,
        customerEmail,
        expiresAt: expiresAt || 'süresiz',
      },
    });

    return NextResponse.json<CreateCustomerLinkResponse>({
      success: true,
      token,
      link,
      ...(expiresAt && { expiresAt }),
      linkId: customerLink.id,
    });
  } catch (error) {
    logger.error('Customer link oluşturma hatası', error, {
      action: 'create_customer_link',
      resource: 'customer_links',
    });

    return NextResponse.json<CreateCustomerLinkResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Link oluşturulamadı',
      },
      { status: 500 }
    );
  }
}
