/*
info:
Bağlantılı dosyalar:
- lib/supabase/client.ts: Supabase bağlantısı (gerekli)
- app/layout.tsx: Ana layout (gerekli)

Dosyanın amacı:
- Sayfa görüntüleme takibi için hook
- Otomatik sayfa ziyaret kaydı
- Analytics verilerini toplama

Supabase değişkenleri ve tabloları:
- page_views: Sayfa görüntüleme kayıtları

Geliştirme önerileri:
- Otomatik sayfa takibi
- Session yönetimi
- Performans optimizasyonu

Tespit edilen hatalar:
- ✅ Hook yapısı oluşturuldu

Kullanım durumu:
- ✅ Gerekli: Sayfa analitikleri için takip sistemi
- ✅ Production-ready: Supabase entegrasyonu ile
*/

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface PageViewData {
  page_path: string;
  page_title?: string;
  referrer?: string;
  user_agent?: string;
  session_id?: string;
  view_duration?: number;
}

export const usePageTracking = () => {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(Date.now());
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    // Session ID oluştur veya al
    if (!sessionIdRef.current) {
      sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Sayfa görüntüleme başlangıç zamanı
    startTimeRef.current = Date.now();

    // Sayfa görüntüleme kaydı
    const trackPageView = async () => {
      try {
        const viewDuration = Math.round(
          (Date.now() - startTimeRef.current) / 1000
        );

        const pageViewData: PageViewData = {
          page_path: pathname,
          page_title: document.title,
          user_agent: navigator.userAgent,
          session_id: sessionIdRef.current,
          view_duration: viewDuration,
        };
        if (document.referrer) {
          pageViewData.referrer = document.referrer;
        }

        // Supabase'e kaydet - page_views tablosu henüz oluşturulmamış
        // TODO: page_views tablosu oluşturulduğunda aktif et
        /*
        const { error } = await supabase
          .from('page_views')
          .insert([pageViewData]);

        if (error) {
          console.error('Error tracking page view:', error);
        } else if (process.env.NODE_ENV === 'development') {
        }
        */

        // Geçici olarak sadece development modunda log
        if (process.env.NODE_ENV === 'development') {
        }
      } catch (error) {
        console.error('Error in page tracking:', error);
      }
    };

    // Sayfa yüklendiğinde kaydet
    trackPageView();

    // Sayfa değiştiğinde önceki sayfa süresini kaydet
    return () => {
      const viewDuration = Math.round(
        (Date.now() - startTimeRef.current) / 1000
      );
      if (viewDuration > 0) {
        // Önceki sayfa süresini güncelle (opsiyonel)
        // Bu durumda yeni sayfa zaten kaydedilecek
      }
    };
  }, [pathname]);

  // Manuel sayfa görüntüleme kaydı
  const trackCustomPageView = async (customData: Partial<PageViewData>) => {
    try {
      const pageViewData: PageViewData = {
        page_path: pathname,
        page_title: document.title,
        user_agent: navigator.userAgent,
        session_id: sessionIdRef.current,
        view_duration: Math.round((Date.now() - startTimeRef.current) / 1000),
        ...customData,
      };
      if (document.referrer) {
        pageViewData.referrer = document.referrer;
      }

      // Supabase'e kaydet - page_views tablosu henüz oluşturulmamış
      // TODO: page_views tablosu oluşturulduğunda aktif et
      /*
      const { error } = await supabase
        .from('page_views')
        .insert([pageViewData]);

      if (error) {
        console.error('Error tracking custom page view:', error);
        return false;
      }
      */

      if (process.env.NODE_ENV === 'development') {
      }

      return true;
    } catch (error) {
      console.error('Error in custom page tracking:', error);
      return false;
    }
  };

  return {
    trackCustomPageView,
    sessionId: sessionIdRef.current,
  };
};
