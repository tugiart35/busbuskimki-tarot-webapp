/**
 * Products API - AI Shopping Agents & External Integrations
 * 
 * Bu endpoint, AI alışveriş ajanları ve harici servisler için
 * ürün kataloğu sunar. LLMO/GEO optimizasyonu kapsamında eklendi.
 * 
 * Desteklenen kullanım senaryoları:
 * - ChatGPT, Claude gibi AI asistanların ürün önerileri
 * - Price comparison websites
 * - Affiliate platforms
 * - Shopping aggregators
 */

import { NextRequest, NextResponse } from 'next/server';

// Ürün tipi tanımı
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: 'tarot-reading' | 'numerology' | 'premium';
  availability: 'in_stock' | 'out_of_stock';
  url: string;
  image?: string;
  features?: string[];
}

// Statik ürün kataloğu
const PRODUCTS: Product[] = [
  {
    id: 'tarot-reading-3-card',
    name: 'Temel Tarot Okuması (3 Kart)',
    description: 'AI destekli 3 kartlık tarot okuması ile geçmiş-şimdi-gelecek analizi. Groq llama-3.3-70b modeli ile anlık yorumlama.',
    price: 99,
    currency: 'TRY',
    category: 'tarot-reading',
    availability: 'in_stock',
    url: 'https://busbuskimki.com/tr/tarotokumasi',
    image: 'https://busbuskimki.com/cards/CardBack.webp',
    features: [
      'AI destekli yorum (Groq llama-3.3-70b)',
      'Geçmiş, şimdi, gelecek analizi',
      'Anlık sonuç',
      'Kayıt ve tekrar erişim',
    ],
  },
  {
    id: 'love-spread',
    name: 'Aşk Açılımı (5 Kart)',
    description: 'İlişki dinamikleri ve duygusal durum analizi için özel tasarlanmış 5 kartlık açılım.',
    price: 149,
    currency: 'TRY',
    category: 'tarot-reading',
    availability: 'in_stock',
    url: 'https://busbuskimki.com/tr/tarotokumasi/love-spread',
    image: 'https://busbuskimki.com/Spread/Durugoru.webp',
    features: [
      'İlişki dinamikleri analizi',
      'Duygusal durum değerlendirmesi',
      'Gelecek beklentileri',
      'Detaylı AI yorumu',
    ],
  },
  {
    id: 'career-spread',
    name: 'Kariyer Açılımı (5 Kart)',
    description: 'İş hayatı, profesyonel gelişim ve fırsatlar için kariyer odaklı tarot okuması.',
    price: 149,
    currency: 'TRY',
    category: 'tarot-reading',
    availability: 'in_stock',
    url: 'https://busbuskimki.com/tr/tarotokumasi/career-spread',
    features: [
      'Kariyer yol haritası',
      'Profesyonel fırsatlar',
      'Potansiyel zorluklar',
      'Eylem önerileri',
    ],
  },
  {
    id: 'situation-analysis',
    name: 'Durum Analizi (3 Kart)',
    description: 'Genel durum değerlendirmesi için hızlı ve etkili 3 kartlık açılım.',
    price: 99,
    currency: 'TRY',
    category: 'tarot-reading',
    availability: 'in_stock',
    url: 'https://busbuskimki.com/tr/tarotokumasi/situation-analysis',
    features: [
      'Genel durum analizi',
      'Hızlı sonuç',
      'Pratik öneriler',
    ],
  },
  {
    id: 'new-lover',
    name: 'Yeni İlişki Açılımı (7 Kart)',
    description: 'Yeni bir ilişkinin potansiyelini değerlendiren detaylı 7 kartlık açılım.',
    price: 199,
    currency: 'TRY',
    category: 'tarot-reading',
    availability: 'in_stock',
    url: 'https://busbuskimki.com/tr/tarotokumasi/new-lover',
    features: [
      '7 kartlık detaylı analiz',
      'İlişki potansiyeli',
      'Uyumluluk değerlendirmesi',
      'Geleceğe yönelik öngörüler',
    ],
  },
  {
    id: 'relationship-problems',
    name: 'İlişki Sorunları Açılımı (6 Kart)',
    description: 'Mevcut ilişki sorunlarını analiz eden ve çözüm önerileri sunan özel açılım.',
    price: 179,
    currency: 'TRY',
    category: 'tarot-reading',
    availability: 'in_stock',
    url: 'https://busbuskimki.com/tr/tarotokumasi/relationship-problems',
    features: [
      'Sorun analizi',
      'Çözüm önerileri',
      'Her iki tarafın perspektifi',
      'Eylem planı',
    ],
  },
  {
    id: 'numerology-basic',
    name: 'Temel Numeroloji Analizi',
    description: 'Doğum tarihi ve isim bazlı numeroloji hesaplaması ve yorumlama.',
    price: 79,
    currency: 'TRY',
    category: 'numerology',
    availability: 'in_stock',
    url: 'https://busbuskimki.com/tr/numeroloji',
    features: [
      'Yaşam yolu sayısı',
      'Kader sayısı',
      'Ruh sayısı',
      'Detaylı analiz raporu',
    ],
  },
];

/**
 * GET /api/products
 * 
 * Query Parameters:
 * - type: 'reading' | 'numerology' | 'all' (default: 'all')
 * - category: 'tarot-reading' | 'numerology' | 'premium'
 * - minPrice: number
 * - maxPrice: number
 * 
 * Response:
 * {
 *   success: true,
 *   products: Product[],
 *   total: number,
 *   currency: string
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    let filtered = [...PRODUCTS];

    // Kategori filtresi
    if (type === 'reading') {
      filtered = filtered.filter(p => p.category === 'tarot-reading');
    } else if (type === 'numerology') {
      filtered = filtered.filter(p => p.category === 'numerology');
    } else if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    // Fiyat aralığı filtresi
    if (minPrice) {
      const min = parseFloat(minPrice);
      filtered = filtered.filter(p => p.price >= min);
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      filtered = filtered.filter(p => p.price <= max);
    }

    // Sadece stokta olan ürünler
    filtered = filtered.filter(p => p.availability === 'in_stock');

    return NextResponse.json(
      {
        success: true,
        products: filtered,
        total: filtered.length,
        currency: 'TRY',
        message: 'Products retrieved successfully',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve products',
        products: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * 
 * Body: {
 *   productIds: string[]
 * }
 * 
 * Birden fazla ürünü ID ile getir
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds } = body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid productIds array',
        },
        { status: 400 }
      );
    }

    const filtered = PRODUCTS.filter(p => productIds.includes(p.id));

    return NextResponse.json(
      {
        success: true,
        products: filtered,
        total: filtered.length,
        currency: 'TRY',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Products POST API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve products',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/products
 * CORS preflight support
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

