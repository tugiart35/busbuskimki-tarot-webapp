import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query params
    const title = searchParams.get('title') || 'Büşbüşkimki';
    const subtitle = searchParams.get('subtitle') || 'Profesyonel Tarot Okuması ve Numeroloji';
    const locale = searchParams.get('locale') || 'tr';

    // Locale-specific text
    const taglines = {
      tr: 'Profesyonel Tarot ve Numeroloji',
      en: 'Professional Tarot & Numerology',
      sr: 'Profesionalni Tarot i Numerologija',
    };

    const tagline = taglines[locale as keyof typeof taglines] || taglines.tr;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f0f23',
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(99, 102, 241, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(139, 92, 246, 0.1) 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            position: 'relative',
          }}
        >
          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 50%, rgba(167, 139, 250, 0.2) 100%)',
            }}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 60px',
              zIndex: 1,
            }}
          >
            {/* Logo/Icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px',
                  boxShadow: '0 20px 60px rgba(99, 102, 241, 0.4)',
                }}
              >
                🔮
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textAlign: 'center',
                marginBottom: '20px',
                maxWidth: '1000px',
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: '36px',
                color: '#c7d2fe',
                textAlign: 'center',
                maxWidth: '900px',
                marginBottom: '30px',
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>

            {/* Tagline */}
            <div
              style={{
                fontSize: '24px',
                color: '#a5b4fc',
                textAlign: 'center',
                padding: '12px 32px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              {tagline}
            </div>
          </div>

          {/* Bottom decoration */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '60px',
              right: '60px',
              height: '4px',
              background: 'linear-gradient(90deg, transparent 0%, #6366f1 50%, transparent 100%)',
              borderRadius: '2px',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('OG Image Generation Error:', e.message);
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}

