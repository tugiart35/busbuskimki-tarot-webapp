import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Büşbüşkimki',
  description: 'Yönetim paneli - Yalnızca yetkili kullanıcılar için',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function AdminPageLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
