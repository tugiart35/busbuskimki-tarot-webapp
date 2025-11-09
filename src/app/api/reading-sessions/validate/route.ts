import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token gereklidir' },
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

    // Token hash hesapla
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Session bul
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('reading_sessions')
      .select('*')
      .eq('token_hash', tokenHash)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Geçersiz veya bulunamayan token' },
        { status: 404 }
      );
    }

    // Süresi dolmuş mu kontrol et
    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      // Status'u expired olarak güncelle
      await supabaseAdmin
        .from('reading_sessions')
        .update({ status: 'expired' })
        .eq('id', session.id);

      // Event log kaydet
      await supabaseAdmin.from('reading_events').insert({
        session_id: session.id,
        event_type: 'session_expired',
        status_after: 'expired',
        actor_type: 'system',
        message: 'Token süresi doldu',
      });

      return NextResponse.json(
        { error: 'Bu okuma linkinin süresi dolmuş' },
        { status: 410 }
      );
    }

    // İptal edilmiş mi kontrol et
    if (session.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Bu okuma iptal edilmiş' },
        { status: 410 }
      );
    }

    // Tamamlanmış mı kontrol et
    if (session.status === 'completed') {
      return NextResponse.json(
        { error: 'Bu okuma zaten tamamlanmış' },
        { status: 410 }
      );
    }

    // Status'u form_started olarak güncelle (ilk kez tıklanıyorsa)
    if (session.status === 'invited') {
      await supabaseAdmin
        .from('reading_sessions')
        .update({ status: 'form_started' })
        .eq('id', session.id);

      // Event log kaydet
      await supabaseAdmin.from('reading_events').insert({
        session_id: session.id,
        event_type: 'status_changed',
        status_after: 'form_started',
        actor_type: 'customer',
        message: 'Müşteri linke tıkladı',
      });
    }

    // Reading type'ı belirle (kolondan veya metadata'dan)
    let readingType: 'detailed' | 'written' | null = null;
    
    if (session.reading_type) {
      // Kolondan al
      readingType = session.reading_type as 'detailed' | 'written';
    } else {
      // Metadata'dan al (migration öncesi kayıtlar için)
      const event = await supabaseAdmin
        .from('reading_events')
        .select('metadata')
        .eq('session_id', session.id)
        .eq('event_type', 'session_created')
        .single();

      if (event.data?.metadata?.reading_type) {
        readingType = event.data.metadata.reading_type as 'detailed' | 'written';
      }
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      customerFirstName: session.customer_first_name,
      customerLastName: session.customer_last_name,
      customerEmail: session.customer_email,
      spreadKey: session.spread_key,
      readingType: readingType,
      status: session.status,
      expiresAt: session.expires_at,
    });
  } catch (error) {
    console.error('Token doğrulama hatası:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Token doğrulanamadı',
      },
      { status: 500 }
    );
  }
}

