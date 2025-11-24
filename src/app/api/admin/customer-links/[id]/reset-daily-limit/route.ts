import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { logger } from '@/lib/logger';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Admin kontrolü
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (!user || userError) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const { data: adminData } = await supabaseAdmin
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    if (!adminData) {
      return NextResponse.json(
        { error: 'Admin yetkisi gereklidir' },
        { status: 403 }
      );
    }

    const linkId = params.id;

    // Customer link'i bul
    const { data: customerLink, error: linkError } = await supabaseAdmin
      .from('customer_links')
      .select('customer_email')
      .eq('id', linkId)
      .single();

    if (linkError || !customerLink) {
      return NextResponse.json(
        { error: 'Link bulunamadı' },
        { status: 404 }
      );
    }

    // Card session'ı bul ve günlük limiti sıfırla
    const { data: cardSession, error: sessionError } = await supabaseAdmin
      .from('card_sessions')
      .select('id')
      .eq('customer_email', customerLink.customer_email)
      .single();

    if (sessionError && sessionError.code !== 'PGRST116') {
      logger.error('Card session okuma hatası', sessionError, {
        action: 'reset_daily_limit',
        resource: 'card_sessions',
      });
      return NextResponse.json(
        { error: 'Session okunamadı' },
        { status: 500 }
      );
    }

    if (cardSession) {
      // Sadece cards_drawn_today_count sıfırla
      const { error: updateError } = await supabaseAdmin
        .from('card_sessions')
        .update({
          cards_drawn_today_count: 0,
          updated_at: new Date().toISOString(),
        })
        .eq('id', cardSession.id);

      if (updateError) {
        logger.error('Günlük limit sıfırlama hatası', updateError, {
          action: 'reset_daily_limit',
          resource: 'card_sessions',
        });
        return NextResponse.json(
          { error: 'Günlük limit sıfırlanamadı' },
          { status: 500 }
        );
      }

      logger.info('Günlük limit sıfırlandı', {
        action: 'reset_daily_limit',
        resource: 'card_sessions',
        metadata: {
          linkId,
          customerEmail: customerLink.customer_email,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Günlük limit başarıyla sıfırlandı',
    });
  } catch (error) {
    logger.error('Günlük limit sıfırlama hatası', error, {
      action: 'reset_daily_limit',
      resource: 'card_sessions',
    });

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Günlük limit sıfırlanamadı',
      },
      { status: 500 }
    );
  }
}

