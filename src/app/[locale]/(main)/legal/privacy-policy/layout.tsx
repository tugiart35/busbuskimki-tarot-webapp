import { MetadataHelper } from '@/lib/seo/metadata-helper';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: LayoutProps) {
  const { locale } = await params;
  const path = `/${locale}/legal/privacy-policy`;

  return MetadataHelper.generateLegalMetadata('privacy-policy', locale, path);
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
