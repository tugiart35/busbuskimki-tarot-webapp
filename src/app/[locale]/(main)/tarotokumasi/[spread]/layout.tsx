/*
 * Spread Layout - SEO Metadata for Individual Spread Pages
 * Dynamic metadata generation for each spread type in each locale
 * 
 * Features:
 * - Dynamic title and description per spread
 * - Canonical URLs for SEO
 * - hreflang tags for multilingual support
 * - OpenGraph metadata for social sharing
 * - Twitter Card metadata
 */

import { Metadata } from 'next';
import { locales } from '@/lib/i18n/config';

// Spread IDs (must match tarotSpreads.ts)
const SPREAD_IDS = [
  'love-spread',
  'career-spread',
  'problem-solving-spread',
  'situation-analysis-spread',
  'relationship-analysis-spread',
  'relationship-problems-spread',
  'marriage-spread',
  'new-lover-spread',
  'money-spread',
];

interface SpreadLayoutProps {
  params: Promise<{ spread: string; locale: string }>;
  children: React.ReactNode;
}

// Spread names by locale for SEO
const spreadMetadata: Record<string, Record<string, { title: string; description: string }>> = {
  'love-spread': {
    tr: {
      title: 'Aşk Açılımı - Tarot Falı',
      description: 'Aşk hayatınız hakkında detaylı tarot açılımı. İlişkinizin geleceği, partnerinizin duyguları ve aşk hayatınızdaki fırsatlar hakkında rehberlik alın.',
    },
    en: {
      title: 'Love Spread - Tarot Reading',
      description: 'Detailed tarot spread about your love life. Get guidance about your relationship future, partner\'s feelings, and opportunities in your love life.',
    },
    sr: {
      title: 'Ljubavno Širenje - Tarot Čitanje',
      description: 'Detaljan tarot za vaš ljubavni život. Dobijte vodič o budućnosti vaše veze, osećanjima partnera i prilikama u vašem ljubavnom životu.',
    },
  },
  'career-spread': {
    tr: {
      title: 'Kariyer Açılımı - Tarot Falı',
      description: 'Kariyer yolculuğunuz için detaylı tarot açılımı. İş hayatınızdaki fırsatlar, engeller ve başarı yolları hakkında rehberlik alın.',
    },
    en: {
      title: 'Career Spread - Tarot Reading',
      description: 'Detailed tarot spread for your career journey. Get guidance about opportunities, obstacles, and paths to success in your professional life.',
    },
    sr: {
      title: 'Karijerno Širenje - Tarot Čitanje',
      description: 'Detaljan tarot za vašu karijeru. Dobijte vodič o prilikama, preprekama i putevima uspeha u vašem profesionalnom životu.',
    },
  },
  'money-spread': {
    tr: {
      title: 'Para Açılımı - Tarot Falı',
      description: 'Finansal durumunuz için detaylı tarot açılımı. Para akışı, yatırım fırsatları ve maddi kazançlar hakkında rehberlik alın.',
    },
    en: {
      title: 'Money Spread - Tarot Reading',
      description: 'Detailed tarot spread for your finances. Get guidance about cash flow, investment opportunities, and financial gains.',
    },
    sr: {
      title: 'Novčano Širenje - Tarot Čitanje',
      description: 'Detaljan tarot za vaše finansije. Dobijte vodič o novčanom toku, investicionim prilikama i finansijskim dobicima.',
    },
  },
  'problem-solving-spread': {
    tr: {
      title: 'Problem Çözme Açılımı - Tarot Falı',
      description: 'Sorunlarınıza çözüm bulmak için detaylı tarot açılımı. Problemin kaynağı, çözüm yolları ve atılması gereken adımlar hakkında rehberlik alın.',
    },
    en: {
      title: 'Problem Solving Spread - Tarot Reading',
      description: 'Detailed tarot spread to find solutions to your problems. Get guidance about root causes, solution paths, and steps to take.',
    },
    sr: {
      title: 'Rešavanje Problema - Tarot Čitanje',
      description: 'Detaljan tarot za pronalaženje rešenja vaših problema. Dobijte vodič o uzrocima, putevima rešenja i koracima koje treba preduzeti.',
    },
  },
  'situation-analysis-spread': {
    tr: {
      title: 'Durum Analizi Açılımı - Tarot Falı',
      description: 'Mevcut durumunuzu anlamak için detaylı tarot açılımı. Olayların arka planı, etkileyici faktörler ve gelecek gelişmeler hakkında rehberlik alın.',
    },
    en: {
      title: 'Situation Analysis Spread - Tarot Reading',
      description: 'Detailed tarot spread to understand your current situation. Get guidance about background, influencing factors, and future developments.',
    },
    sr: {
      title: 'Analiza Situacije - Tarot Čitanje',
      description: 'Detaljan tarot za razumevanje vaše trenutne situacije. Dobijte vodič o pozadini, uticajnim faktorima i budućim razvijima.',
    },
  },
  'relationship-analysis-spread': {
    tr: {
      title: 'İlişki Analizi Açılımı - Tarot Falı',
      description: 'İlişkinizi derinlemesine analiz etmek için tarot açılımı. İkinizin duyguları, bağ gücü ve ilişkinin geleceği hakkında rehberlik alın.',
    },
    en: {
      title: 'Relationship Analysis Spread - Tarot Reading',
      description: 'Tarot spread for in-depth relationship analysis. Get guidance about both feelings, bond strength, and relationship future.',
    },
    sr: {
      title: 'Analiza Veze - Tarot Čitanje',
      description: 'Tarot za detaljnu analizu veze. Dobijte vodič o osećanjima, snazi veze i budućnosti odnosa.',
    },
  },
  'relationship-problems-spread': {
    tr: {
      title: 'İlişki Sorunları Açılımı - Tarot Falı',
      description: 'İlişki problemlerinize çözüm bulmak için tarot açılımı. Sorunların nedenleri, çözüm yolları ve ilişkiyi güçlendirme önerileri.',
    },
    en: {
      title: 'Relationship Problems Spread - Tarot Reading',
      description: 'Tarot spread to find solutions to relationship problems. Causes, solution paths, and suggestions to strengthen the relationship.',
    },
    sr: {
      title: 'Problemi u Vezi - Tarot Čitanje',
      description: 'Tarot za pronalaženje rešenja problema u vezi. Uzroci, putevi rešenja i predlozi za jačanje veze.',
    },
  },
  'marriage-spread': {
    tr: {
      title: 'Evlilik Açılımı - Tarot Falı',
      description: 'Evlilik yolculuğunuz için detaylı tarot açılımı. Evlilik planları, gelecek, uyum ve mutlu bir birliktelik için rehberlik alın.',
    },
    en: {
      title: 'Marriage Spread - Tarot Reading',
      description: 'Detailed tarot spread for your marriage journey. Get guidance about marriage plans, future, compatibility, and happy union.',
    },
    sr: {
      title: 'Bračno Širenje - Tarot Čitanje',
      description: 'Detaljan tarot za vaše bračno putovanje. Dobijte vodič o bračnim planovima, budućnosti, kompatibilnosti i srećnoj vezi.',
    },
  },
  'new-lover-spread': {
    tr: {
      title: 'Yeni Aşk Açılımı - Tarot Falı',
      description: 'Yeni bir aşk için tarot açılımı. Gelecekteki partner, ilişkinin özellikleri ve aşk hayatınızdaki yeni fırsatlar hakkında rehberlik.',
    },
    en: {
      title: 'New Lover Spread - Tarot Reading',
      description: 'Tarot spread for new love. Guidance about future partner, relationship characteristics, and new opportunities in your love life.',
    },
    sr: {
      title: 'Nova Ljubav - Tarot Čitanje',
      description: 'Tarot za novu ljubav. Vodič o budućem partneru, karakteristikama veze i novim prilikama u ljubavnom životu.',
    },
  },
};

export async function generateMetadata({ params }: SpreadLayoutProps): Promise<Metadata> {
  const { spread: spreadId, locale } = await params;
  
  if (!SPREAD_IDS.includes(spreadId)) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';
  const metadata = spreadMetadata[spreadId]?.[locale] || {
    title: `${spreadId} - Tarot`,
    description: `Tarot reading for ${spreadId}`,
  };

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/tarotokumasi/${spreadId}`,
      languages: locales.reduce((acc, loc) => {
        acc[loc] = `${baseUrl}/${loc}/tarotokumasi/${spreadId}`;
        return acc;
      }, {} as Record<string, string>),
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: `${baseUrl}/${locale}/tarotokumasi/${spreadId}`,
      siteName: 'BüşBüşKimKi',
      locale: locale,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/assets/logo/social-og-tarot.jpg`,
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: [`${baseUrl}/assets/logo/twitter-card-tarot.jpg`],
    },
    keywords: [
      'tarot',
      'tarot okuma',
      'tarot falı',
      'online tarot',
      spreadId.replace(/-/g, ' '),
      metadata.title,
    ],
  };
}

export default function SpreadLayout({ children }: SpreadLayoutProps) {
  return children;
}

// Generate static params for all spreads × all locales (27 pages)
export async function generateStaticParams() {
  return locales.flatMap(locale =>
    SPREAD_IDS.map(spread => ({
      locale,
      spread,
    }))
  );
}

