import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

/**
 * Reading'i ID'ye göre getir
 * Token-based okumalar için tamamlanmış reading'i göstermek için kullanılır
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Reading ID gereklidir' },
        { status: 400 }
      );
    }

    // UUID format kontrolü
    const isValidUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id
      );

    if (!isValidUUID) {
      return NextResponse.json(
        { error: 'Geçersiz reading ID formatı' },
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

    const { data: reading, error } = await supabaseAdmin
      .from('readings')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !reading) {
      return NextResponse.json({ error: 'Okuma bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      reading: reading,
    });
  } catch (error) {
    logger.error('Reading fetch hatası', error, {
      action: 'fetch_reading',
      resource: 'readings',
    });
    return NextResponse.json(
      {
        error: 'Okuma getirilemedi',
        message: error instanceof Error ? error.message : 'Bilinmeyen hata',
      },
      { status: 500 }
    );
  }
}
