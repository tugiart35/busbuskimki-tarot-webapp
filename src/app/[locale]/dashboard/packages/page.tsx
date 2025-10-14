/*
info:
Bağlantılı dosyalar:
- @/hooks/useAuth: Kullanıcı giriş durumu kontrolü için (gerekli)
- @/lib/supabase/client: Supabase bağlantısı için (gerekli)
- @/lib/constants/reading-credits: Kredi sabitleri için (gerekli)
- lucide-react: İkonlar için (gerekli)

Dosyanın amacı:
- Kredi paketleri satın alma sayfası oluşturur
- 100, 300, 500 kredi paketlerini kart şeklinde gösterir
- Ödeme işlemleri için backend entegrasyonu hazırlar

Backend bağlantısı:
- Supabase auth ile kullanıcı doğrulama
- profiles tablosundan kredi bakiyesi güncelleme
- transactions tablosuna satın alma kaydı ekleme
- Burada backend'e bağlanılacak - ödeme işlemleri

Geliştirme ve öneriler:
- useAuth hook'u ile tutarlı auth kontrolü
- Responsive tasarım ve modern UI
- Kullanıcı deneyimi odaklı paket seçimi
- Güvenli ödeme işleme ve veri işleme

Hatalar / Geliştirmeye Açık Noktalar:
- Auth kontrolü useAuth hook'u ile güçlendirilebilir
- Loading state'leri daha detaylı hale getirilebilir
- Error handling iyileştirilebilir
- PWA desteği eklenebilir

Kodun okunabilirliği, optimizasyonu, yeniden kullanılabilirliği ve güvenliği:
- Okunabilirlik: Temiz kod yapısı, açık fonksiyon isimleri
- Optimizasyon: Gereksiz re-render'lar önlenmiş
- Yeniden Kullanılabilirlik: Modüler bileşen yapısı
- Güvenlik: Auth kontrolü ve güvenli veri işleme

Gereklilik ve Kullanım Durumu:
- PackagesPage: Gerekli, kredi paketleri satın alma için ana bileşen
- checkAuth: Gerekli, kullanıcı doğrulama için
- purchasePackage: Gerekli, paket satın alma işlemi için
- refreshCreditBalance: Gerekli, kredi bakiyesi güncelleme için
*/

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/auth/useAuth';
import { useTranslations } from '@/hooks/useTranslations';
import { useDashboardActions } from '@/hooks/useDashboardActions';
import { useCurrency } from '@/hooks/useCurrency';
import { BottomNavigation } from '@/features/shared/layout';
import {
  Coins,
  Star,
  ShoppingCart,
  CreditCard,
  Gift,
  Shield,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import type { Package, UserProfile } from '@/types/dashboard.types';
import { getPackageStyle } from '@/utils/dashboard-utils';

export default function PackagesPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  // Pathname'den locale'i çıkar
  const locale = pathname.split('/')[1] || 'tr';
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Supabase'den kredi paketlerini çek
  const [creditPackages, setCreditPackages] = useState<Package[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);

  // Para birimi tespiti
  const { currency, symbol, isLoading: currencyLoading } = useCurrency();

  // Dashboard actions hook - Shopier entegrasyonu için
  const { handlePackagePurchase, paymentLoading } = useDashboardActions(
    profile,
    user,
    locale,
    setProfile,
    currency
  );

  // Supabase'den paketleri çek
  const fetchPackages = useCallback(async () => {
    try {
      setPackagesLoading(true);
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('active', true)
        .order('credits', { ascending: true });

      if (error) {
        console.error('Paketler yükleme hatası:', error);
        return;
      }

      // Supabase verilerini Package tipine dönüştür
      const packages: Package[] = (data || []).map((pkg: any) => ({
        id: pkg.id,
        name: pkg.name,
        credits: pkg.credits,
        price_try: parseFloat(pkg.price_try),
        price_usd: parseFloat(pkg.price_usd || 0),
        price_eur: parseFloat(pkg.price_eur || 0),
        description: pkg.description || '',
        shopier_product_id: pkg.shopier_product_id || null,
        active: pkg.active,
        created_at: pkg.created_at,
      }));

      setCreditPackages(packages);
    } catch (error) {
      console.error('Paketler yüklenirken hata:', error);
    } finally {
      setPackagesLoading(false);
    }
  }, []);

  // Kullanıcı profilini çek
  const fetchUserProfile = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('id, credit_balance, display_name, email')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Profil yükleme hatası:', error);
        setError(
          t('dashboard.packages.profileError', 'Profil bilgileri yüklenemedi')
        );
        return;
      }

      setProfile(profileData);
    } catch (error) {
      console.error('Profil yükleme hatası:', error);
      setError(
        t('dashboard.packages.profileError', 'Profil bilgileri yüklenemedi')
      );
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  // Auth kontrolü ve paketleri çek
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace(`/${locale}/auth`);
        return;
      }
      fetchUserProfile();
      fetchPackages(); // Supabase'den paketleri çek
    }
  }, [authLoading, user, router, locale, fetchPackages, fetchUserProfile]);

  // Loading state
  if (authLoading || loading || packagesLoading) {
    return (
      <div className='flex flex-col min-h-screen bg-cosmic-black pb-16'>
        <div className='flex-1 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4'></div>
            <div className='text-text-celestial text-lg'>
              {t(
                'dashboard.packages.loading',
                '🔮 Kredi paketleri yükleniyor...'
              )}
            </div>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className='flex flex-col min-h-screen bg-cosmic-black text-white pb-16'>
      {/* Header */}
      <header className='border-b border-cosmic-fog p-4'>
        <div className='container mx-auto flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <ShoppingCart className='h-8 w-8 text-gold' />
            <span className='text-xl font-bold text-text-celestial'>
              {t('dashboard.packages.title', 'Kredi Paketleri')}
            </span>
          </div>
          <Link
            href={`/${locale}/dashboard`}
            className='text-text-mystic hover:text-gold transition-colors flex items-center space-x-1'
          >
            <ArrowLeft className='h-4 w-4' />
            <span>{t('dashboard.backToDashboard', "Dashboard'a Dön")}</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 container mx-auto px-4 py-8'>
        {/* Page Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold mb-4 text-text-celestial'>
            💎 {t('dashboard.packages.pageTitle', 'Kredi Paketleri')}
          </h1>
          <p className='text-xl text-text-mystic mb-6'>
            {t(
              'dashboard.packages.description',
              'Tarot okumalarınız için ihtiyacınız olan kredileri satın alın'
            )}
          </p>

          {/* Mevcut Kredi Bakiyesi */}
          {profile && (
            <div className='inline-flex items-center space-x-2 bg-gold/10 border border-gold/30 rounded-lg px-6 py-3'>
              <Coins className='h-5 w-5 text-gold' />
              <span className='text-gold font-semibold'>
                {t('dashboard.packages.currentBalance', 'Mevcut Bakiyeniz')}:{' '}
                {profile.credit_balance || 0}{' '}
                {t('dashboard.packages.credits', 'kredi')}
              </span>
            </div>
          )}
        </div>

        {/* Error Messages */}
        {error && (
          <div className='mb-8 p-4 bg-danger/10 border border-danger/30 rounded-lg'>
            <div className='flex items-center space-x-2'>
              <Shield className='h-5 w-5 text-danger' />
              <p className='text-danger'>{error}</p>
            </div>
          </div>
        )}

        {/* Packages Grid */}
        <div className='grid md:grid-cols-3 gap-8 mb-12'>
          {creditPackages.length > 0 ? (
            creditPackages.map((pkg, index) => {
              const style = getPackageStyle(pkg.credits);
              const IconComponent = style.icon;
              const isPopular = index === 1; // İkinci paket popüler

              // Para birimi seçimi
              const price = currency === 'TRY' ? pkg.price_try : pkg.price_eur;
              const pricePerCredit = price / pkg.credits;

              return (
                <div
                  key={pkg.id}
                  className={`relative card hover-lift p-8 ${
                    isPopular ? 'ring-2 ring-gold/50' : ''
                  }`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                      <div className='bg-gold text-cosmic-black px-4 py-1 rounded-full text-sm font-bold flex items-center space-x-1'>
                        <Star className='h-4 w-4' />
                        <span>
                          {t('dashboard.packages.mostPopular', 'En Popüler')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Package Icon */}
                  <div
                    className={`inline-flex p-4 rounded-lg ${style.bgColor} border ${style.borderColor} mb-6`}
                  >
                    <IconComponent className={`h-8 w-8 ${style.iconColor}`} />
                  </div>

                  {/* Package Info */}
                  <div className='text-center mb-6'>
                    <h3 className='text-2xl font-bold text-text-celestial mb-2'>
                      {pkg.name}
                    </h3>
                    <p className='text-text-mystic mb-4'>{pkg.description}</p>

                    {/* Credits */}
                    <div className='mb-4'>
                      <div className='text-4xl font-bold text-gold mb-1'>
                        {pkg.credits.toLocaleString()}
                      </div>
                      <div className='text-sm text-text-muted'>
                        {t('dashboard.packages.credits', 'kredi')}
                      </div>
                    </div>

                    {/* Price */}
                    <div className='mb-6'>
                      {currencyLoading ? (
                        <div className='text-2xl text-text-celestial'>
                          Yükleniyor...
                        </div>
                      ) : (
                        <>
                          <div className='text-3xl font-bold text-text-celestial'>
                            {price.toFixed(2)} {symbol}
                          </div>
                          <div className='text-sm text-text-muted'>
                            {pricePerCredit.toFixed(2)} {symbol}/kredi
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <button
                    onClick={() => handlePackagePurchase(pkg)}
                    disabled={paymentLoading}
                    className={`w-full btn ${
                      isPopular ? 'btn-primary' : 'btn-secondary'
                    } flex items-center justify-center space-x-2 ${
                      paymentLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {paymentLoading ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                        <span>
                          {t(
                            'dashboard.packages.processing',
                            'Yönlendiriliyor...'
                          )}
                        </span>
                      </>
                    ) : (
                      <>
                        <CreditCard className='h-4 w-4' />
                        <span>
                          {t('dashboard.packages.buyNow', 'Satın Al')}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <div className='col-span-full text-center py-12'>
              <div className='text-text-mystic text-lg'>
                {t(
                  'dashboard.packages.noPackages',
                  'Henüz aktif paket bulunmuyor. Lütfen daha sonra tekrar kontrol edin.'
                )}
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className='grid md:grid-cols-3 gap-6 mb-12'>
          <div className='card p-6 text-center'>
            <Shield className='h-8 w-8 text-success mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-text-celestial mb-2'>
              {t('dashboard.packages.securePayment', 'Güvenli Ödeme')}
            </h3>
            <p className='text-text-mystic text-sm'>
              {t(
                'dashboard.packages.securePaymentDesc',
                'Tüm ödemeler SSL şifreleme ile korunur'
              )}
            </p>
          </div>

          <div className='card p-6 text-center'>
            <Clock className='h-8 w-8 text-info mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-text-celestial mb-2'>
              {t('dashboard.packages.instantActivation', 'Anında Aktif')}
            </h3>
            <p className='text-text-mystic text-sm'>
              {t(
                'dashboard.packages.instantActivationDesc',
                'Kredileriniz hemen hesabınıza eklenir'
              )}
            </p>
          </div>

          <div className='card p-6 text-center'>
            <Gift className='h-8 w-8 text-warning mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-text-celestial mb-2'>
              {t('dashboard.packages.bonusCredits', 'Bonus Krediler')}
            </h3>
            <p className='text-text-mystic text-sm'>
              {t(
                'dashboard.packages.bonusCreditsDesc',
                'Büyük paketlerde ekstra kredi kazanın'
              )}
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className='card p-8'>
          <h2 className='text-2xl font-bold text-text-celestial mb-6 text-center'>
            ❓ {t('dashboard.packages.faq', 'Sıkça Sorulan Sorular')}
          </h2>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-lg font-semibold text-gold mb-2'>
                {t(
                  'dashboard.packages.faq1Question',
                  'Krediler ne kadar süre geçerli?'
                )}
              </h3>
              <p className='text-text-mystic text-sm'>
                {t(
                  'dashboard.packages.faq1Answer',
                  'Kredileriniz satın alma tarihinden itibaren 1 yıl geçerlidir.'
                )}
              </p>
            </div>
            <div>
              <h3 className='text-lg font-semibold text-gold mb-2'>
                {t('dashboard.packages.faq2Question', 'İade politikası nedir?')}
              </h3>
              <p className='text-text-mystic text-sm'>
                {t(
                  'dashboard.packages.faq2Answer',
                  'Kullanılmayan krediler için 7 gün içinde iade alabilirsiniz.'
                )}
              </p>
            </div>
            <div>
              <h3 className='text-lg font-semibold text-gold mb-2'>
                {t(
                  'dashboard.packages.faq3Question',
                  'Hangi ödeme yöntemleri kabul ediliyor?'
                )}
              </h3>
              <p className='text-text-mystic text-sm'>
                {t(
                  'dashboard.packages.faq3Answer',
                  'Kredi kartı, banka kartı ve dijital cüzdanlar kabul edilir.'
                )}
              </p>
            </div>
            <div>
              <h3 className='text-lg font-semibold text-gold mb-2'>
                {t(
                  'dashboard.packages.faq4Question',
                  'Bonus krediler nasıl hesaplanıyor?'
                )}
              </h3>
              <p className='text-text-mystic text-sm'>
                {t(
                  'dashboard.packages.faq4Answer',
                  'Popüler pakette %10, Premium pakette %20 bonus kredi verilir.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className='mt-12 text-center'>
          <Link href={`/${locale}/dashboard`} className='btn btn-primary'>
            {t('dashboard.backToDashboard', "Dashboard'a Dön")}
          </Link>
        </div>
      </main>
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
