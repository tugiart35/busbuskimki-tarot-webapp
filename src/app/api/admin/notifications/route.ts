import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

/**
 * GET - Okunmamış bildirimleri çek
 */
export async function GET(request: NextRequest) {
  try {
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

    // Query parametrelerinden read filtresi al (opsiyonel)
    const { searchParams } = new URL(request.url);
    const readFilter = searchParams.get('read');

    let query = supabaseAdmin
      .from('admin_notifications')
      .select('*')
      .order('created_at', { ascending: false });

    // Eğer read filtresi varsa uygula
    if (readFilter !== null) {
      query = query.eq('read', readFilter === 'true');
    } else {
      // Varsayılan olarak sadece okunmamış bildirimleri getir
      query = query.eq('read', false);
    }

    const { data: notifications, error } = await query;

    if (error) {
      logger.error('Bildirimler çekilirken hata', error, {
        action: 'fetch_notifications',
        resource: 'admin_notifications',
      });
      return NextResponse.json(
        { error: 'Bildirimler yüklenemedi' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      notifications: notifications || [],
      count: notifications?.length || 0,
    });
  } catch (error) {
    logger.error('Bildirimler hatası', error, {
      action: 'fetch_notifications',
      resource: 'admin_notifications',
    });
    return NextResponse.json(
      { error: 'Bildirimler yüklenemedi' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Bildirimi okundu olarak işaretle
 */
export async function PATCH(request: NextRequest) {
  try {
    const { notificationId } = await request.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Bildirim ID gereklidir' },
        { status: 400 }
      );
    }

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

    const { error } = await supabaseAdmin
      .from('admin_notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (error) {
      logger.error('Bildirim güncelleme hatası', error, {
        action: 'update_notification',
        resource: 'admin_notifications',
        metadata: { notificationId },
      });
      return NextResponse.json(
        { error: 'Bildirim güncellenemedi' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Bildirim güncelleme hatası', error, {
      action: 'update_notification',
      resource: 'admin_notifications',
    });
    return NextResponse.json(
      { error: 'Bildirim güncellenemedi' },
      { status: 500 }
    );
  }
}


