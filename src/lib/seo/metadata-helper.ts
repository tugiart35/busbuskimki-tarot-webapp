import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  path: string;
  locale: string;
  keywords?: string[];
  noindex?: boolean;
  image?: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';
const SITE_NAME = 'Büşbüşkimki - Tarot ve Numeroloji';

export class MetadataHelper {
  private static normalizeUrl(url: string): string {
    return url.replace(/^https?:\/\/(www\.)?/, 'https://').replace(/\/$/, '');
  }

  private static getFullUrl(path: string): string {
    const baseUrl = this.normalizeUrl(SITE_URL);
    return `${baseUrl}${path}`;
  }

  private static getLocalizedPaths(
    path: string,
    currentLocale: string
  ): Record<string, string> {
    const locales = ['tr', 'en', 'sr'];
    const paths: Record<string, string> = {};

    locales.forEach((locale) => {
      if (locale === currentLocale) {
        paths[locale] = this.getFullUrl(path);
      } else {
        const localizedPath = path.replace(`/${currentLocale}/`, `/${locale}/`);
        paths[locale] = this.getFullUrl(localizedPath);
      }
    });

    return paths;
  }

  static generateMetadata(config: SEOConfig): Metadata {
    const {
      title,
      description,
      path,
      locale,
      keywords = [],
      noindex = false,
      image = '/og-image.png',
    } = config;

    const fullUrl = this.getFullUrl(path);
    const localizedPaths = this.getLocalizedPaths(path, locale);
    const fullImageUrl = image.startsWith('http')
      ? image
      : this.getFullUrl(image);

    const metadata: Metadata = {
      title,
      description,
      keywords: keywords.join(', '),
      openGraph: {
        title,
        description,
        url: fullUrl,
        siteName: SITE_NAME,
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: locale === 'tr' ? 'tr_TR' : locale === 'en' ? 'en_US' : 'sr_RS',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [fullImageUrl],
        site: '@busbuskimki',
        creator: '@busbuskimki',
      },
      alternates: {
        canonical: fullUrl,
        languages: localizedPaths,
      },
      robots: noindex
        ? {
            index: false,
            follow: false,
          }
        : {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              'max-video-preview': -1,
              'max-image-preview': 'large',
              'max-snippet': -1,
            },
          },
    };

    return metadata;
  }

  static generateLegalMetadata(
    pageName: string,
    locale: string,
    path: string
  ): Metadata {
    const titles: Record<string, Record<string, string>> = {
      about: {
        tr: 'Hakkımızda - Büşbüşkimki',
        en: 'About Us - Busbuskimki',
        sr: 'O nama - Busbuskimki',
      },
      'privacy-policy': {
        tr: 'Gizlilik Politikası - Büşbüşkimki',
        en: 'Privacy Policy - Busbuskimki',
        sr: 'Politika Privatnosti - Busbuskimki',
      },
      'terms-of-use': {
        tr: 'Kullanım Şartları - Büşbüşkimki',
        en: 'Terms of Use - Busbuskimki',
        sr: 'Uslovi Korišćenja - Busbuskimki',
      },
      disclaimer: {
        tr: 'Sorumluluk Reddi - Büşbüşkimki',
        en: 'Disclaimer - Busbuskimki',
        sr: 'Odricanje Odgovornosti - Busbuskimki',
      },
      contact: {
        tr: 'İletişim - Büşbüşkimki',
        en: 'Contact - Busbuskimki',
        sr: 'Kontakt - Busbuskimki',
      },
      'cookie-policy': {
        tr: 'Çerez Politikası - Büşbüşkimki',
        en: 'Cookie Policy - Busbuskimki',
        sr: 'Politika Kolačića - Busbuskimki',
      },
      'payment-terms': {
        tr: 'Ödeme Koşulları - Büşbüşkimki',
        en: 'Payment Terms - Busbuskimki',
        sr: 'Uslovi Plaćanja - Busbuskimki',
      },
      'refund-policy': {
        tr: 'İade Politikası - Büşbüşkimki',
        en: 'Refund Policy - Busbuskimki',
        sr: 'Politika Povraćaja - Busbuskimki',
      },
      'security-policy': {
        tr: 'Güvenlik Politikası - Büşbüşkimki',
        en: 'Security Policy - Busbuskimki',
        sr: 'Bezbednosna Politika - Busbuskimki',
      },
      'copyright-policy': {
        tr: 'Telif Hakkı Politikası - Büşbüşkimki',
        en: 'Copyright Policy - Busbuskimki',
        sr: 'Politika Autorskih Prava - Busbuskimki',
      },
      accessibility: {
        tr: 'Erişilebilirlik - Büşbüşkimki',
        en: 'Accessibility - Busbuskimki',
        sr: 'Pristupačnost - Busbuskimki',
      },
      'child-privacy': {
        tr: 'Çocuk Gizliliği - Büşbüşkimki',
        en: 'Child Privacy - Busbuskimki',
        sr: 'Privatnost Dece - Busbuskimki',
      },
      'kvkk-disclosure': {
        tr: 'KVKK Aydınlatma Metni - Büşbüşkimki',
        en: 'KVKK Disclosure - Busbuskimki',
        sr: 'KVKK Obaveštenje - Busbuskimki',
      },
    };

    const descriptions: Record<string, Record<string, string>> = {
      about: {
        tr: 'Büşbüşkimki tarot ve numeroloji platformu hakkında bilgi edinin.',
        en: 'Learn about Busbuskimki tarot and numerology platform.',
        sr: 'Saznajte o Busbuskimki tarot i numerologija platformi.',
      },
      'privacy-policy': {
        tr: 'Gizlilik politikamızı okuyun ve kişisel verilerinizin nasıl korunduğunu öğrenin.',
        en: 'Read our privacy policy and learn how your personal data is protected.',
        sr: 'Pročitajte našu politiku privatnosti i saznajte kako su vaši lični podaci zaštićeni.',
      },
      'terms-of-use': {
        tr: 'Platform kullanım şartlarımızı okuyun ve kabul edin.',
        en: 'Read and accept our platform terms of use.',
        sr: 'Pročitajte i prihvatite naše uslove korišćenja platforme.',
      },
      disclaimer: {
        tr: 'Platform sorumluluk reddi ve yasal bilgilendirme.',
        en: 'Platform disclaimer and legal information.',
        sr: 'Odricanje odgovornosti platforme i pravne informacije.',
      },
      contact: {
        tr: 'Büşbüşkimki ile iletişime geçin.',
        en: 'Contact Busbuskimki.',
        sr: 'Kontaktirajte Busbuskimki.',
      },
      'cookie-policy': {
        tr: 'Çerez kullanım politikamız hakkında bilgi edinin.',
        en: 'Learn about our cookie usage policy.',
        sr: 'Saznajte o našoj politici korišćenja kolačića.',
      },
      'payment-terms': {
        tr: 'Ödeme koşulları ve güvenli ödeme bilgileri.',
        en: 'Payment terms and secure payment information.',
        sr: 'Uslovi plaćanja i informacije o bezbednom plaćanju.',
      },
      'refund-policy': {
        tr: 'İade politikamız ve iade koşulları hakkında bilgi edinin.',
        en: 'Learn about our refund policy and conditions.',
        sr: 'Saznajte o našoj politici povraćaja i uslovima.',
      },
      'security-policy': {
        tr: 'Güvenlik politikamız ve veri koruma önlemleri.',
        en: 'Our security policy and data protection measures.',
        sr: 'Naša bezbednosna politika i mere zaštite podataka.',
      },
      'copyright-policy': {
        tr: 'Telif hakkı politikası ve fikri mülkiyet hakları.',
        en: 'Copyright policy and intellectual property rights.',
        sr: 'Politika autorskih prava i intelektualna svojina.',
      },
      accessibility: {
        tr: 'Erişilebilirlik taahhüdümüz ve özellikler.',
        en: 'Our accessibility commitment and features.',
        sr: 'Naša posvećenost pristupačnosti i funkcije.',
      },
      'child-privacy': {
        tr: 'Çocukların gizliliği ve veri koruma politikası.',
        en: 'Children privacy and data protection policy.',
        sr: 'Privatnost dece i politika zaštite podataka.',
      },
      'kvkk-disclosure': {
        tr: 'KVKK kapsamında kişisel verilerin korunması aydınlatma metni.',
        en: 'Personal data protection disclosure under KVKK.',
        sr: 'Obaveštenje o zaštiti ličnih podataka u skladu sa KVKK.',
      },
    };

    const title =
      titles[pageName]?.[locale] || `${pageName} - Büşbüşkimki`;
    const description =
      descriptions[pageName]?.[locale] ||
      'Büşbüşkimki - Tarot ve Numeroloji Platformu';

    return this.generateMetadata({
      title,
      description,
      path,
      locale,
      keywords: ['tarot', 'numeroloji', pageName],
    });
  }
}
