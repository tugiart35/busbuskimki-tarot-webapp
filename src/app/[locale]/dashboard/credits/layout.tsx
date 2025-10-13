import { MetadataHelper } from '@/lib/seo/metadata-helper';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const titles = {
  "tr": "Kredi Yönetimi",
  "en": "Credits Management",
  "sr": "Upravljanje Kreditima"
};
  const descriptions = {
  "tr": "Kredinizi yönetin ve paket satın alın",
  "en": "Manage your credits and buy packages",
  "sr": "Upravljajte svojim kreditima i kupite pakete"
};

  const path = `/${locale}/dashboard`;

  return MetadataHelper.generateMetadata({
    title: titles[locale as keyof typeof titles] || titles.tr,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.tr,
    path,
    locale,
    keywords: ['tarot', 'numeroloji', 'dashboard'],
    noindex: true,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
