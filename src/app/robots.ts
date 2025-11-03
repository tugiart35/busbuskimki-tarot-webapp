import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/_next/',
          '/auth/confirm',
          '/payment/',
        ],
      },
      // Traditional Search Engines
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/auth/confirm'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/auth/confirm'],
      },
      // 🤖 AI Crawlers - LLMO/GEO Optimization
      {
        userAgent: 'GPTBot', // ChatGPT web crawler
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/auth/'],
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT browsing feature
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/auth/'],
      },
      {
        userAgent: 'ClaudeBot', // Claude (Anthropic)
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/auth/'],
      },
      {
        userAgent: 'PerplexityBot', // Perplexity AI
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/auth/'],
      },
      {
        userAgent: 'Google-Extended', // Google Bard/Gemini training
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/auth/'],
      },
      {
        userAgent: 'anthropic-ai', // Claude web scraper
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/auth/'],
      },
      {
        userAgent: 'CCBot', // Common Crawl (AI training data)
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/auth/'],
      },
      {
        userAgent: 'cohere-ai', // Cohere AI
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/auth/'],
      },
      {
        userAgent: 'Omgilibot', // Omgili news aggregator
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/auth/'],
      },
      {
        userAgent: 'Bytespider', // ByteDance (TikTok)
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/auth/'],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/llms.txt`, // ✨ AI'lar için özel içerik haritası
    ],
  };
}
