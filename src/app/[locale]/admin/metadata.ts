import { Metadata } from 'next';

export const adminMetadata: Metadata = {
  title: 'Admin Panel - Büşbüşkimki',
  description: 'Yönetim paneli - Yalnızca yetkili kullanıcılar için',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
};
