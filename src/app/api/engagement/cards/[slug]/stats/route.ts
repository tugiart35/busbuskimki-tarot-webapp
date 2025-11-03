import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get stats for this card
    const { data: stats, error } = await supabase
      .from('card_stats')
      .select('*')
      .eq('card_slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = not found, which is ok
      console.error('Error fetching stats:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch stats' },
        { status: 500 }
      );
    }

    // Return stats or default values
    return NextResponse.json({
      success: true,
      data: stats || {
        card_slug: slug,
        view_count: 0,
        reaction_count: 0,
        comment_count: 0,
        last_viewed_at: null,
      },
    });
  } catch (error) {
    console.error('Error in card stats GET:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { action } = body;

    if (action !== 'increment_view') {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get current stats
    const { data: currentStats } = await supabase
      .from('card_stats')
      .select('view_count')
      .eq('card_slug', slug)
      .single();

    const newViewCount = (currentStats?.view_count || 0) + 1;

    // Upsert stats
    const { error } = await supabase.from('card_stats').upsert(
      {
        card_slug: slug,
        view_count: newViewCount,
        last_viewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'card_slug' }
    );

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: { view_count: newViewCount },
    });
  } catch (error) {
    console.error('Error in card stats PATCH:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


