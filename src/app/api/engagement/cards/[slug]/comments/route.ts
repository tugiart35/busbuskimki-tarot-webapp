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
    const { searchParams } = new URL(_request.url);
    const locale = searchParams.get('locale') || 'tr';

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get approved comments for this card
    const { data: comments, error } = await supabase
      .from('card_comments')
      .select('id, author_name, comment, created_at')
      .eq('card_slug', slug)
      .eq('locale', locale)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch comments' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        comments: comments || [],
        total: comments?.length || 0,
      },
    });
  } catch (error) {
    console.error('Error in card comments GET:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { author_name, comment, fingerprint, locale = 'tr' } = body;

    // Validate inputs
    if (!author_name || author_name.length < 2 || author_name.length > 50) {
      return NextResponse.json(
        {
          success: false,
          error: 'Author name must be between 2-50 characters',
        },
        { status: 400 }
      );
    }

    if (!comment || comment.length < 10 || comment.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Comment must be between 10-500 characters' },
        { status: 400 }
      );
    }

    if (!fingerprint) {
      return NextResponse.json(
        { success: false, error: 'Fingerprint required' },
        { status: 400 }
      );
    }

    if (!['tr', 'en', 'sr'].includes(locale)) {
      return NextResponse.json(
        { success: false, error: 'Invalid locale' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Check rate limiting - max 3 comments per fingerprint per card
    const { data: existingComments } = await supabase
      .from('card_comments')
      .select('id')
      .eq('card_slug', slug)
      .eq('user_fingerprint', fingerprint);

    if (existingComments && existingComments.length >= 3) {
      return NextResponse.json(
        { success: false, error: 'Maximum 3 comments per card reached' },
        { status: 429 }
      );
    }

    // Insert comment (will require approval)
    const { error } = await supabase.from('card_comments').insert({
      card_slug: slug,
      author_name: author_name.trim(),
      comment: comment.trim(),
      user_fingerprint: fingerprint,
      locale,
      is_approved: false, // Requires admin approval
    });

    if (error) {
      throw error;
    }

    // Update comment count in stats
    await updateCommentCount(slug, supabase);

    return NextResponse.json({
      success: true,
      data: {
        message:
          'Comment submitted successfully. It will appear after approval.',
      },
    });
  } catch (error) {
    console.error('Error in card comments POST:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to update comment count in stats
async function updateCommentCount(slug: string, supabase: any) {
  const { data: comments } = await supabase
    .from('card_comments')
    .select('id')
    .eq('card_slug', slug)
    .eq('is_approved', true);

  const count = comments?.length || 0;

  // Upsert stats
  await supabase.from('card_stats').upsert(
    {
      card_slug: slug,
      comment_count: count,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'card_slug' }
  );
}
