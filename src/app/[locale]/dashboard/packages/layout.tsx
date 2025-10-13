import { MetadataHelper } from '@/lib/seo/metadata-helper';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const titles = {
  "tr": "Paketler",
  "en": "Packages",
  "sr": "Paketi"
};
  const descriptions = {
  "tr": "Tarot okuma paketlerini görüntüleyin ve satın alın",
  "en": "View and purchase tarot reading packages",
  "sr": "Pogledajte i kupite pakete tarot čitanja"
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
