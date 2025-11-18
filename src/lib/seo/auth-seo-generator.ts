import { Metadata } from 'next';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateServiceSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from './schema-markup';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';

// SEO data for Auth page
const authSeoData: Record<
  string,
  {
    title: string;
    description: string;
    keywords: string[];
    canonicalPath: string;
    ogImage: string;
    twitterImage: string;
    breadcrumbs: Array<{ name: string; url: string }>;
    faq: Array<{ question: string; answer: string }>;
  }
> = {
  tr: {
    title: 'Giriş — Büşbüşkimki',
    description:
      'Büşbüşkimki hesabınıza güvenli şekilde giriş yapın. Tarot ve numeroloji hizmetlerinize erişim sağlayın.',
    keywords: [
      'giriş yap',
      'hesap girişi',
      'kullanıcı girişi',
      'güvenli giriş',
      'tarot hesabı',
      'numeroloji hesabı',
      'mistik rehberlik',
      'kişisel hesap',
    ],
    canonicalPath: '/tr/auth',
    ogImage: '/assets/logo/social-og-auth.jpg',
    twitterImage: '/assets/logo/twitter-card-auth.jpg',
    breadcrumbs: [
      { name: 'Anasayfa', url: `${baseUrl}/tr` },
      { name: 'Giriş', url: `${baseUrl}/tr/auth` },
    ],
    faq: [
      {
        question: 'Hesabıma nasıl giriş yapabilirim?',
        answer:
          'E-posta adresiniz ve şifrenizle güvenli şekilde giriş yapabilirsiniz.',
      },
      {
        question: 'Şifremi unuttum, ne yapmalıyım?',
        answer: 'Şifre sıfırlama linkini e-posta adresinize gönderebiliriz.',
      },
      {
        question: 'Hesabım güvenli mi?',
        answer:
          'Tüm verileriniz şifrelenmiş olarak saklanır ve güvenli bağlantı kullanılır.',
      },
    ],
  },
  en: {
    title: 'Sign In — Büşbüşkimki',
    description:
      'Sign in to your Büşbüşkimki account securely. Access your tarot and numerology services.',
    keywords: [
      'sign in',
      'account login',
      'user login',
      'secure login',
      'tarot account',
      'numerology account',
      'mystical guidance',
      'personal account',
    ],
    canonicalPath: '/en/auth',
    ogImage: '/assets/logo/social-og-auth.jpg',
    twitterImage: '/assets/logo/twitter-card-auth.jpg',
    breadcrumbs: [
      { name: 'Home', url: `${baseUrl}/en` },
      { name: 'Sign In', url: `${baseUrl}/en/auth` },
    ],
    faq: [
      {
        question: 'How can I sign in to my account?',
        answer:
          'You can sign in securely using your email address and password.',
      },
      {
        question: 'I forgot my password, what should I do?',
        answer: 'We can send a password reset link to your email address.',
      },
      {
        question: 'Is my account secure?',
        answer:
          'All your data is encrypted and stored securely with secure connections.',
      },
    ],
  },
  sr: {
    title: 'Büşbüşkimki',
    description:
      'Prijavite se na svoj Büşbüşkimki nalog sigurno. Pristupite svojim tarot i numerološkim uslugama.',
    keywords: [
      'prijava',
      'prijava na nalog',
      'korisnička prijava',
      'sigurna prijava',
      'tarot nalog',
      'numerološki nalog',
      'mističko vođstvo',
      'lični nalog',
    ],
    canonicalPath: '/sr/auth',
    ogImage: '/assets/logo/social-og-auth.jpg',
    twitterImage: '/assets/logo/twitter-card-auth.jpg',
    breadcrumbs: [
      { name: 'Početna', url: `${baseUrl}/sr` },
      { name: 'Prijava', url: `${baseUrl}/sr/auth` },
    ],
    faq: [
      {
        question: 'Kako se mogu prijaviti na svoj nalog?',
        answer:
          'Možete se sigurno prijaviti koristeći svoju e-mail adresu i lozinku.',
      },
      {
        question: 'Zaboravio sam lozinku, šta da radim?',
        answer:
          'Možemo poslati link za resetovanje lozinke na vašu e-mail adresu.',
      },
      {
        question: 'Da li je moj nalog siguran?',
        answer:
          'Svi vaši podaci su šifrovani i bezbedno čuvani sa sigurnim vezama.',
      },
    ],
  },
};

// Metadata generation function for Auth page
export function generateAuthPageMetadata(locale: string): Metadata {
  const data =
    authSeoData[locale as keyof typeof authSeoData] ?? authSeoData.tr;

  return {
    title: data!.title,
    description: data!.description,
    keywords: data!.keywords.join(', '),
    alternates: {
      canonical: `${baseUrl}${data!.canonicalPath}`,
      languages: {
        'x-default': `${baseUrl}/tr/giris`,
        tr: `${baseUrl}/tr/giris`,
        en: `${baseUrl}/en/login`,
        sr: `${baseUrl}/sr/prijava`,
      },
    },
    openGraph: {
      title: data!.title,
      description: data!.description,
      url: `${baseUrl}${data!.canonicalPath}`,
      siteName: 'Büşbüşkimki',
      images: [
        {
          url: data!.ogImage,
          width: 1200,
          height: 630,
          alt: data!.title,
        },
      ],
      type: 'website',
      locale: locale === 'tr' ? 'tr_TR' : locale === 'en' ? 'en_US' : 'sr_RS',
    },
    twitter: {
      card: 'summary',
      title: data!.title,
      description: data!.description,
      images: [data!.twitterImage],
    },
    robots: {
      index: false, // Auth pages should not be indexed
      follow: false,
      nocache: true,
    },
  };
}

// Structured data generation function for Auth page
export function generateAuthPageStructuredData(locale: string) {
  const data =
    authSeoData[locale as keyof typeof authSeoData] ?? authSeoData.tr;

  return {
    organization: generateOrganizationSchema(),
    website: generateWebSiteSchema(),
    service: generateServiceSchema(),
    breadcrumb: generateBreadcrumbSchema(data!.breadcrumbs),
    faq: generateFAQSchema(locale),
  };
}
