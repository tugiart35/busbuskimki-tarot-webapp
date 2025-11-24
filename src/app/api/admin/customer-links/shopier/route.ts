import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { logger } from '@/lib/logger';
import {
  getTodayInTimezone,
  getDateFromTimestamp,
} from '@/lib/aklindaki-kisi/utils';

export interface ShopierLink {
  id: string;
  customer_email: string;
  token: string;
  token_preview?: string;
  status: 'active' | 'expired' | 'used';
  expiry_date?: string | null;
  created_at: string;
  cardSession?: {
    cards_drawn_today_count: number;
    last_draw_date: string | null;
  } | null;
  totalCardsDrawn: number;
  lastDrawDate: string | null;
}

export interface GetShopierLinksResponse {
  success: boolean;
  links?: ShopierLink[];
  error?: string;
}

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

    // Cookie'lerden user bilgisini al
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
      return NextResponse.json<GetShopierLinksResponse>(
        { success: false, error: 'Admin yetkisi gereklidir' },
        { status: 403 }
      );
    }

    // Shopier'den gelen linkleri al (created_by_admin_id null olanlar)
    const { data: links, error: linksError } = await supabaseAdmin
      .from('customer_links')
      .select('*')
      .is('created_by_admin_id', null) // Shopier'den gelen linkler
      .order('created_at', { ascending: false });

    if (linksError) {
      logger.error('Shopier link listesi okuma hatası', linksError, {
        action: 'list_shopier_links',
        resource: 'customer_links',
      });
      return NextResponse.json<GetShopierLinksResponse>(
        { success: false, error: 'Linkler yüklenemedi' },
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
          id: link.id,
          customer_email: link.customer_email,
          token: link.token,
          token_preview: link.token_preview,
          status,
          expiry_date: link.expiry_date,
          created_at: link.created_at,
          cardSession: cardSession || null,
          totalCardsDrawn,
          lastDrawDate: cardSession?.last_draw_date || null,
        };
      })
    );

    return NextResponse.json<GetShopierLinksResponse>({
      success: true,
      links: linksWithActivity,
    });
  } catch (error) {
    logger.error('Shopier link listesi hatası', error, {
      action: 'list_shopier_links',
      resource: 'customer_links',
    });

    return NextResponse.json<GetShopierLinksResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Linkler yüklenemedi',
      },
      { status: 500 }
    );
  }
}


