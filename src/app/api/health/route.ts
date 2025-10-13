import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * Health check endpoint for monitoring and deployment verification
 * Returns system status and database connectivity
 */
export async function GET() {
  const startTime = Date.now();

  try {
    // Check database connectivity
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();

    const responseTime = Date.now() - startTime;

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" which is acceptable for health check
      return NextResponse.json(
        {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          checks: {
            database: 'down',
            api: 'up',
          },
          error: error.message,
          responseTime: `${responseTime}ms`,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'up',
          api: 'up',
        },
        environment: process.env.NODE_ENV || 'unknown',
        responseTime: `${responseTime}ms`,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Response-Time': `${responseTime}ms`,
        },
      }
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'unknown',
          api: 'up',
        },
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: `${responseTime}ms`,
      },
      { status: 503 }
    );
  }
}
