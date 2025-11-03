import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    const { searchParams } = new URL(_request.url);
    const fingerprint = searchParams.get('fingerprint');

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get all reactions for this page
    const { data: reactions, error } = await supabase
      .from('page_reactions')
      .select('emoji')
      .eq('page_id', pageId);

    if (error) {
      console.error('Error fetching page reactions:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch reactions' },
        { status: 500 }
      );
    }

    // Count reactions by emoji
    const reactionCounts = reactions.reduce((acc: any, r: any) => {
      acc[r.emoji] = (acc[r.emoji] || 0) + 1;
      return acc;
    }, {});

    // Format response
    const formattedReactions = ['😍', '👍', '🤔', '⭐', '🎯'].map(emoji => ({
      emoji,
      count: reactionCounts[emoji] || 0,
    }));

    // Get user's reaction if fingerprint provided
    let userReaction = null;
    if (fingerprint) {
      const { data: userReactionData } = await supabase
        .from('page_reactions')
        .select('emoji')
        .eq('page_id', pageId)
        .eq('user_fingerprint', fingerprint)
        .single();

      userReaction = userReactionData?.emoji || null;
    }

    return NextResponse.json({
      success: true,
      data: {
        reactions: formattedReactions,
        userReaction,
      },
    });
  } catch (error) {
    console.error('Error in page reactions GET:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    const body = await request.json();
    const { emoji, fingerprint } = body;

    // Validate inputs
    if (!emoji || !['😍', '👍', '🤔', '⭐', '🎯'].includes(emoji)) {
      return NextResponse.json(
        { success: false, error: 'Invalid emoji' },
        { status: 400 }
      );
    }

    if (!fingerprint) {
      return NextResponse.json(
        { success: false, error: 'Fingerprint required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Check if user already reacted
    const { data: existingReaction } = await supabase
      .from('page_reactions')
      .select('id, emoji')
      .eq('page_id', pageId)
      .eq('user_fingerprint', fingerprint)
      .single();

    if (existingReaction) {
      // If same emoji, remove reaction
      if (existingReaction.emoji === emoji) {
        const { error } = await supabase
          .from('page_reactions')
          .delete()
          .eq('id', existingReaction.id);

        if (error) throw error;

        return NextResponse.json({
          success: true,
          data: { action: 'removed', emoji: null },
        });
      }

      // Different emoji, update reaction
      const { error } = await supabase
        .from('page_reactions')
        .update({ emoji })
        .eq('id', existingReaction.id);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data: { action: 'updated', emoji },
      });
    }

    // No existing reaction, create new one
    const { error } = await supabase.from('page_reactions').insert({
      page_id: pageId,
      emoji,
      user_fingerprint: fingerprint,
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: { action: 'added', emoji },
    });
  } catch (error) {
    console.error('Error in page reactions POST:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


