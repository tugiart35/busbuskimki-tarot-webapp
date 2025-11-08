import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface CardStat {
  card_slug: string;
  view_count: number;
  reaction_count: number;
  comment_count: number;
  last_viewed_at: string | null;
  popularity_score?: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const timeframe = searchParams.get('timeframe') || 'week'; // week, month, all

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Zaman filtresi için tarih hesapla
    let dateFilter: Date | null = null;
    if (timeframe === 'week') {
      dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - 7);
    } else if (timeframe === 'month') {
      dateFilter = new Date();
      dateFilter.setMonth(dateFilter.getMonth() - 1);
    }

    // Temel sorgu
    let query = supabase
      .from('card_stats')
      .select(
        'card_slug, view_count, reaction_count, comment_count, last_viewed_at'
      );

    // Zaman filtresini uygula (eğer varsa)
    if (dateFilter) {
      query = query.gte('last_viewed_at', dateFilter.toISOString());
    }

    // En fazla limit * 3 kayıt al (filtreleme için yeterli)
    const { data: cardStats, error } = await query.limit(limit * 3);

    if (error) {
      console.error('Error fetching trending cards:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch trending cards' },
        { status: 500 }
      );
    }

    if (!cardStats || cardStats.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No trending cards found',
      });
    }

    // Popülerlik skorunu hesapla: view_count + (reaction_count * 2)
    // Reaksiyonlar daha değerli olduğu için 2 ile çarpılıyor
    const statsWithScore: CardStat[] = cardStats.map(card => ({
      ...card,
      popularity_score: (card.view_count || 0) + (card.reaction_count || 0) * 2,
    }));

    // Popülerlik skoruna göre sırala ve limit kadar al
    const trending = statsWithScore
      .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      data: trending,
      metadata: {
        timeframe,
        limit,
        total: trending.length,
      },
    });
  } catch (error) {
    console.error('Error in trending cards GET:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
