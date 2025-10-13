import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query params
    const cardName = searchParams.get('name') || 'Tarot Kartı';
    const cardType = searchParams.get('type') || 'major'; // major or minor
    const locale = searchParams.get('locale') || 'tr';

    // Locale-specific labels
    const labels = {
      tr: {
        major: 'Büyük Arkana',
        minor: 'Küçük Arkana',
        meaning: 'Kart Anlamı',
      },
      en: {
        major: 'Major Arcana',
        minor: 'Minor Arcana',
        meaning: 'Card Meaning',
      },
      sr: {
        major: 'Velika Arkana',
        minor: 'Mala Arkana',
        meaning: 'Značenje Karte',
      },
    };

    const label = labels[locale as keyof typeof labels] || labels.tr;
    const arcanaType = cardType === 'major' ? label.major : label.minor;

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
            backgroundColor: '#1e1b4b',
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
            position: 'relative',
          }}
        >
          {/* Decorative elements */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              left: '40px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              right: '60px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
            }}
          />

          {/* Main content container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
              background: 'rgba(30, 27, 75, 0.7)',
              borderRadius: '40px',
              border: '2px solid rgba(99, 102, 241, 0.3)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              maxWidth: '1000px',
            }}
          >
            {/* Arcana Type Badge */}
            <div
              style={{
                fontSize: '20px',
                color: '#e0e7ff',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                marginBottom: '20px',
                padding: '8px 24px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(99, 102, 241, 0.4)',
              }}
            >
              {arcanaType}
            </div>

            {/* Card Icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '30px',
              }}
            >
              <div
                style={{
                  width: '140px',
                  height: '200px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '80px',
                  boxShadow: '0 20px 60px rgba(99, 102, 241, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                  border: '3px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                🃏
              </div>
            </div>

            {/* Card Name */}
            <div
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textAlign: 'center',
                marginBottom: '20px',
                maxWidth: '800px',
                lineHeight: 1.2,
              }}
            >
              {cardName}
            </div>

            {/* Meaning Label */}
            <div
              style={{
                fontSize: '28px',
                color: '#c7d2fe',
                textAlign: 'center',
                marginTop: '10px',
              }}
            >
              {label.meaning}
            </div>

            {/* Branding */}
            <div
              style={{
                fontSize: '24px',
                color: '#a5b4fc',
                marginTop: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '28px' }}>🔮</span>
              <span>Büşbüşkimki</span>
            </div>
          </div>

          {/* Bottom decoration line */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: 'linear-gradient(90deg, transparent 0%, #6366f1 25%, #8b5cf6 50%, #a78bfa 75%, transparent 100%)',
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
    console.error('Card OG Image Generation Error:', e.message);
    return new Response(`Failed to generate card image: ${e.message}`, {
      status: 500,
    });
  }
}

