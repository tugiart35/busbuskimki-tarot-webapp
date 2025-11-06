/**
 * Dynamic Dashboard Widgets
 * 
 * Bu dosya dashboard component'lerini lazy loading ile yükler.
 * Performans optimizasyonu için oluşturuldu.
 * 
 * Faydaları:
 * - Initial bundle boyutunu küçültür
 * - İlk sayfa yükleme hızını artırır  
 * - Kullanıcı etkileşimine göre yükleme yapar
 */

'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="animate-pulse">
    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
  </div>
);

// Kart tipi loading
const LoadingCard = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
  </div>
);

// Liste tipi loading
const LoadingList = () => (
  <div className="animate-pulse space-y-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    ))}
  </div>
);

/**
 * Credit Packages Component
 * Paket satın alma arayüzü - kullanıcı etkileşimine göre yüklenir
 * SSR: false - Client-side only (ödeme işlemleri için)
 */
export const DynamicCreditPackages = dynamic(
  () => import('./CreditPackages'),
  {
    loading: () => <LoadingCard />,
    ssr: false, // Client-side only - ödeme widget'ları için
  }
);

/**
 * Profile Management Component
 * Profil düzenleme arayüzü - kullanıcı etkileşimine göre yüklenir
 * SSR: false - Client-side only (form işlemleri için)
 */
export const DynamicProfileManagement = dynamic(
  () => import('./ProfileManagement'),
  {
    loading: () => <LoadingCard />,
    ssr: false, // Client-side only - form state için
  }
);

/**
 * Recent Activity Component
 * Son aktiviteler listesi - SEO için server-side render edilir
 * SSR: true - İçerik önemli ve SEO'ya katkı sağlar
 */
export const DynamicRecentActivity = dynamic(
  () => import('./RecentActivity'),
  {
    loading: () => <LoadingList />,
    ssr: true, // Server-side render - SEO için önemli
  }
);

/**
 * Stats Cards Component
 * İstatistik kartları - Critical component, hemen yüklenmeli
 * NOT: Bu component'i dynamic yapmıyoruz çünkü "above the fold" içeriği
 * Ancak ileride gerekirse buraya eklenebilir
 */
// export const DynamicStatsCards = dynamic(
//   () => import('./StatsCards'),
//   {
//     loading: () => <LoadingCard />,
//     ssr: true,
//   }
// );

/**
 * Profile Modal Component  
 * Profil düzenleme modal'ı - sadece açıldığında yüklenir
 * SSR: false - Modal client-side component
 */
export const DynamicProfileModal = dynamic(
  () => import('./ProfileModal'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

/**
 * Navigation Header Component
 * Üst navigasyon - Critical component olduğu için dynamic yapma
 * Kullanıcı hemen görür, initial load'da olmalı
 */
// NOT: NavigationHeader'ı dynamic yapmıyoruz - above the fold

/**
 * Welcome Section Component
 * Hoş geldin mesajı - Critical component
 * İlk görünen içerik olduğu için dynamic yapma
 */
// NOT: WelcomeSection'ı dynamic yapmıyoruz - LCP için önemli

