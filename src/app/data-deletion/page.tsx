/*
 * Data Deletion Page - Facebook GDPR Compliance
 *
 * Bu sayfa Facebook App ayarları için gerekli olan "User Data Deletion URL" için oluşturulmuştur.
 * Facebook'tan yönlendirilen kullanıcılara verilerini nasıl silebileceklerini açıklar.
 *
 * URL: https://busbuskimki.com/data-deletion
 * Statik URL (locale parametresi yok) - Facebook App ayarlarında kullanılacak
 */

'use client';

import React, { useEffect, useState, Suspense } from 'react';
import {
  FaTrashAlt,
  FaUserShield,
  FaEnvelope,
  FaDatabase,
  FaShieldAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type SupportedLocale = 'tr' | 'en' | 'sr';

interface Translations {
  title: string;
  subtitle: string;
  lastUpdated: string;
  introduction: {
    title: string;
    content: string;
  };
  howToDelete: {
    title: string;
    steps: {
      step1: string;
      step2: string;
      step3: string;
      step4: string;
    };
  };
  whatWillBeDeleted: {
    title: string;
    content: string;
    items: {
      account: string;
      profile: string;
      readings: string;
      preferences: string;
      analytics: string;
    };
  };
  importantNotes: {
    title: string;
    warning: string;
    note1: string;
    note2: string;
    note3: string;
  };
  contact: {
    title: string;
    content: string;
    email: string;
    emailSubject: string;
  };
  links: {
    privacyPolicy: string;
    termsOfUse: string;
    backToHome: string;
  };
}

const translations: Record<SupportedLocale, Translations> = {
  tr: {
    title: 'Veri Silme Talimatları',
    subtitle:
      'Hesabınızı ve tüm kişisel verilerinizi silmek için aşağıdaki talimatları takip edin.',
    lastUpdated: 'Son Güncelleme: Ocak 2025',
    introduction: {
      title: 'Veri Silme Hakkınız',
      content:
        'GDPR (Genel Veri Koruma Yönetmeliği) ve Karadağ PDPL (Kişisel Verilerin Korunması Kanunu) kapsamında, hesabınızı ve tüm kişisel verilerinizi silme hakkına sahipsiniz. Bu sayfa, verilerinizi nasıl silebileceğiniz konusunda adım adım talimatlar sunar.',
    },
    howToDelete: {
      title: 'Verilerinizi Nasıl Silebilirsiniz?',
      steps: {
        step1:
          'Hesabınıza giriş yapın ve Dashboard sayfasına gidin (Giriş yapmadıysanız, önce giriş yapmanız gerekmektedir).',
        step2:
          "Dashboard'da 'Ayarlar' (Settings) bölümüne gidin ve 'Hesabı Sil' (Delete Account) seçeneğini bulun.",
        step3:
          'Hesap silme işlemini başlatın ve onaylayın. İşlem geri alınamaz olduğu için dikkatli olun.',
        step4:
          'Alternatif olarak, aşağıdaki e-posta adresine hesap silme talebinizi gönderebilirsiniz.',
      },
    },
    whatWillBeDeleted: {
      title: 'Silinecek Veriler',
      content:
        'Hesap silme işlemi gerçekleştirildiğinde, aşağıdaki tüm veriler kalıcı olarak silinecektir:',
      items: {
        account: 'Hesap bilgileriniz (e-posta, kullanıcı adı)',
        profile: 'Profil bilgileriniz (ad, soyad, doğum tarihi, cinsiyet)',
        readings: 'Tüm tarot okumalarınız ve sonuçları',
        preferences: 'Hesap tercihleriniz ve ayarlarınız',
        analytics: 'İstatistikleriniz ve kullanım geçmişiniz',
      },
    },
    importantNotes: {
      title: 'Önemli Notlar',
      warning:
        '⚠️ Hesap silme işlemi geri alınamaz! Tüm verileriniz kalıcı olarak silinecektir.',
      note1:
        'Hesap silindikten sonra, silinen verilerinizi geri getirmek mümkün olmayacaktır.',
      note2:
        'Hesap silme işlemi genellikle 24-48 saat içinde tamamlanır. İşlem tamamlandığında e-posta ile bilgilendirileceksiniz.',
      note3:
        'Yasal yükümlülüklerimiz nedeniyle, bazı veriler belirli bir süre boyunca saklanabilir (örneğin, mali kayıtlar).',
    },
    contact: {
      title: 'Yardıma mı İhtiyacınız Var?',
      content:
        'Hesap silme konusunda sorularınız veya yardıma ihtiyacınız varsa, lütfen bizimle iletişime geçin:',
      email: 'destek@busbuskimki.com',
      emailSubject: 'Hesap Silme Talebi - Data Deletion Request',
    },
    links: {
      privacyPolicy: 'Gizlilik Politikası',
      termsOfUse: 'Kullanım Şartları',
      backToHome: 'Ana Sayfaya Dön',
    },
  },
  en: {
    title: 'Data Deletion Instructions',
    subtitle:
      'Follow the instructions below to delete your account and all your personal data.',
    lastUpdated: 'Last Updated: January 2025',
    introduction: {
      title: 'Your Right to Delete Data',
      content:
        'Under GDPR (General Data Protection Regulation) and Montenegro PDPL (Personal Data Protection Law), you have the right to delete your account and all your personal data. This page provides step-by-step instructions on how to delete your data.',
    },
    howToDelete: {
      title: 'How to Delete Your Data?',
      steps: {
        step1:
          'Log in to your account and go to the Dashboard page (If you are not logged in, you need to log in first).',
        step2:
          "In the Dashboard, go to the 'Settings' section and find the 'Delete Account' option.",
        step3:
          'Start and confirm the account deletion process. Please be careful as the process cannot be undone.',
        step4:
          'Alternatively, you can send your account deletion request to the email address below.',
      },
    },
    whatWillBeDeleted: {
      title: 'Data That Will Be Deleted',
      content:
        'When the account deletion process is performed, all of the following data will be permanently deleted:',
      items: {
        account: 'Your account information (email, username)',
        profile:
          'Your profile information (name, surname, date of birth, gender)',
        readings: 'All your tarot readings and results',
        preferences: 'Your account preferences and settings',
        analytics: 'Your statistics and usage history',
      },
    },
    importantNotes: {
      title: 'Important Notes',
      warning:
        '⚠️ Account deletion cannot be undone! All your data will be permanently deleted.',
      note1:
        'After the account is deleted, it will not be possible to recover your deleted data.',
      note2:
        'The account deletion process is usually completed within 24-48 hours. You will be notified by email when the process is completed.',
      note3:
        'Due to our legal obligations, some data may be retained for a certain period (for example, financial records).',
    },
    contact: {
      title: 'Need Help?',
      content:
        'If you have questions or need help regarding account deletion, please contact us:',
      email: 'support@busbuskimki.com',
      emailSubject: 'Account Deletion Request - Data Deletion Request',
    },
    links: {
      privacyPolicy: 'Privacy Policy',
      termsOfUse: 'Terms of Use',
      backToHome: 'Back to Home',
    },
  },
  sr: {
    title: 'Uputstva za Brisanje Podataka',
    subtitle:
      'Pratite uputstva ispod da biste obrisali svoj nalog i sve vaše lične podatke.',
    lastUpdated: 'Poslednje Ažuriranje: Januar 2025',
    introduction: {
      title: 'Vaše Pravo na Brisanje Podataka',
      content:
        'Prema GDPR-u (Opšti propis o zaštiti podataka) i Crnogorskom Zakonu o zaštiti ličnih podataka, imate pravo da obrišete svoj nalog i sve vaše lične podatke. Ova stranica pruža korak-po-korak uputstva o tome kako da obrišete svoje podatke.',
    },
    howToDelete: {
      title: 'Kako da Obrišete Svoje Podatke?',
      steps: {
        step1:
          'Ulogujte se na svoj nalog i idite na stranicu Kontrolne table (Ako niste ulogovani, prvo se morate ulogovati).',
        step2:
          "Na Kontrolnoj tabli, idite na sekciju 'Podešavanja' i pronađite opciju 'Obriši Nalog'.",
        step3:
          'Pokrenite i potvrdite proces brisanja naloga. Molimo budite pažljivi jer proces ne može biti poništen.',
        step4:
          'Alternativno, možete poslati zahtev za brisanje naloga na email adresu ispod.',
      },
    },
    whatWillBeDeleted: {
      title: 'Podaci Koji će Biti Obrisani',
      content:
        'Kada se izvrši proces brisanja naloga, svi sledeći podaci će biti trajno obrisani:',
      items: {
        account: 'Vaše informacije o nalogu (email, korisničko ime)',
        profile: 'Vaše profilne informacije (ime, prezime, datum rođenja, pol)',
        readings: 'Sva vaša tarot čitanja i rezultati',
        preferences: 'Vaša podešavanja naloga i postavke',
        analytics: 'Vaša statistika i istorija korišćenja',
      },
    },
    importantNotes: {
      title: 'Važne Napomene',
      warning:
        '⚠️ Brisanje naloga ne može biti poništeno! Svi vaši podaci će biti trajno obrisani.',
      note1:
        'Nakon što je nalog obrisan, neće biti moguće povratiti vaše obrisane podatke.',
      note2:
        'Proces brisanja naloga obično se završava za 24-48 sati. Bićete obavešteni putem email-a kada se proces završi.',
      note3:
        'Zbog naših pravnih obaveza, neki podaci mogu biti zadržani određeni period (na primer, finansijski zapisi).',
    },
    contact: {
      title: 'Trebate Pomoć?',
      content:
        'Ako imate pitanja ili vam treba pomoć u vezi brisanja naloga, molimo kontaktirajte nas:',
      email: 'support@busbuskimki.com',
      emailSubject: 'Zahtev za Brisanje Naloga - Data Deletion Request',
    },
    links: {
      privacyPolicy: 'Politika Privatnosti',
      termsOfUse: 'Uslovi Korišćenja',
      backToHome: 'Nazad na Početnu',
    },
  },
};

function DataDeletionContent() {
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState<SupportedLocale>('tr');

  useEffect(() => {
    // Locale'i belirle: query param > cookie > default
    const paramLocale = searchParams.get('locale');
    if (
      paramLocale &&
      (paramLocale === 'tr' || paramLocale === 'en' || paramLocale === 'sr')
    ) {
      setLocale(paramLocale as SupportedLocale);
      return;
    }

    // Cookie'den locale oku
    if (typeof document !== 'undefined') {
      const cookieLocale = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1];

      if (
        cookieLocale &&
        (cookieLocale === 'tr' ||
          cookieLocale === 'en' ||
          cookieLocale === 'sr')
      ) {
        setLocale(cookieLocale as SupportedLocale);
        return;
      }
    }

    // Default: Türkçe
    setLocale('tr');
  }, [searchParams]);

  const t = translations[locale];

  // Locale'e göre legal sayfa linkleri
  const legalLinks = {
    privacyPolicy: `/${locale}/legal/privacy-policy`,
    termsOfUse: `/${locale}/legal/terms-of-use`,
    home: `/${locale}`,
  };

  return (
    <div className='min-h-screen bg-cosmic-black'>
      {/* Mystical Background Effects */}
      <div className='absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-purple-800/20'></div>
      <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent'></div>

      <main className='relative z-10 max-w-4xl mx-auto px-4 py-12'>
        {/* Header Section */}
        <section className='mb-12 text-center'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full mb-6 backdrop-blur-sm border border-red-500/30'>
            <FaTrashAlt className='w-10 h-10 text-red-300' />
          </div>
          <h1 className='text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 via-orange-300 to-yellow-300 bg-clip-text text-transparent'>
            {t.title}
          </h1>
          <div className='flex items-center justify-center space-x-4 text-sm text-cosmic-300 mb-2'>
            <div className='flex items-center space-x-2'>
              <FaShieldAlt className='w-4 h-4 text-golden-400' />
              <span>GDPR & PDPL Uyumlu</span>
            </div>
            <div className='w-1 h-1 bg-cosmic-400 rounded-full'></div>
            <div className='flex items-center space-x-2'>
              <FaCheckCircle className='w-4 h-4 text-green-400' />
              <span>{t.lastUpdated}</span>
            </div>
          </div>
          <p className='text-cosmic-300 max-w-2xl mx-auto leading-relaxed'>
            {t.subtitle}
          </p>
        </section>

        {/* Content Sections */}
        <div className='space-y-8'>
          {/* Introduction */}
          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg'>
                <FaInfoCircle className='w-5 h-5 text-purple-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t.introduction.title}
              </h2>
            </div>
            <p className='text-cosmic-200 leading-relaxed'>
              {t.introduction.content}
            </p>
          </section>

          {/* How to Delete */}
          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg'>
                <FaDatabase className='w-5 h-5 text-blue-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t.howToDelete.title}
              </h2>
            </div>
            <ol className='space-y-4 text-cosmic-200'>
              <li className='flex items-start space-x-3'>
                <span className='flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center text-blue-300 font-bold'>
                  1
                </span>
                <span className='pt-1'>{t.howToDelete.steps.step1}</span>
              </li>
              <li className='flex items-start space-x-3'>
                <span className='flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center text-blue-300 font-bold'>
                  2
                </span>
                <span className='pt-1'>{t.howToDelete.steps.step2}</span>
              </li>
              <li className='flex items-start space-x-3'>
                <span className='flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center text-blue-300 font-bold'>
                  3
                </span>
                <span className='pt-1'>{t.howToDelete.steps.step3}</span>
              </li>
              <li className='flex items-start space-x-3'>
                <span className='flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center text-blue-300 font-bold'>
                  4
                </span>
                <span className='pt-1'>{t.howToDelete.steps.step4}</span>
              </li>
            </ol>
          </section>

          {/* What Will Be Deleted */}
          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg'>
                <FaUserShield className='w-5 h-5 text-red-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t.whatWillBeDeleted.title}
              </h2>
            </div>
            <p className='text-cosmic-200 mb-4 leading-relaxed'>
              {t.whatWillBeDeleted.content}
            </p>
            <ul className='space-y-2 text-cosmic-200'>
              <li className='flex items-start space-x-3'>
                <FaCheckCircle className='w-5 h-5 text-red-400 mt-0.5 flex-shrink-0' />
                <span>{t.whatWillBeDeleted.items.account}</span>
              </li>
              <li className='flex items-start space-x-3'>
                <FaCheckCircle className='w-5 h-5 text-red-400 mt-0.5 flex-shrink-0' />
                <span>{t.whatWillBeDeleted.items.profile}</span>
              </li>
              <li className='flex items-start space-x-3'>
                <FaCheckCircle className='w-5 h-5 text-red-400 mt-0.5 flex-shrink-0' />
                <span>{t.whatWillBeDeleted.items.readings}</span>
              </li>
              <li className='flex items-start space-x-3'>
                <FaCheckCircle className='w-5 h-5 text-red-400 mt-0.5 flex-shrink-0' />
                <span>{t.whatWillBeDeleted.items.preferences}</span>
              </li>
              <li className='flex items-start space-x-3'>
                <FaCheckCircle className='w-5 h-5 text-red-400 mt-0.5 flex-shrink-0' />
                <span>{t.whatWillBeDeleted.items.analytics}</span>
              </li>
            </ul>
          </section>

          {/* Important Notes */}
          <section className='card p-6 hover-lift border-2 border-red-500/30'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg'>
                <FaExclamationTriangle className='w-5 h-5 text-red-300' />
              </div>
              <h2 className='text-2xl font-bold text-red-300'>
                {t.importantNotes.title}
              </h2>
            </div>
            <div className='space-y-3'>
              <div className='p-4 bg-red-500/10 border border-red-500/30 rounded-lg'>
                <p className='text-red-300 font-semibold'>
                  {t.importantNotes.warning}
                </p>
              </div>
              <ul className='space-y-2 text-cosmic-200'>
                <li className='flex items-start space-x-3'>
                  <FaCheckCircle className='w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0' />
                  <span>{t.importantNotes.note1}</span>
                </li>
                <li className='flex items-start space-x-3'>
                  <FaCheckCircle className='w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0' />
                  <span>{t.importantNotes.note2}</span>
                </li>
                <li className='flex items-start space-x-3'>
                  <FaCheckCircle className='w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0' />
                  <span>{t.importantNotes.note3}</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className='card p-6 hover-lift'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg'>
                <FaEnvelope className='w-5 h-5 text-green-300' />
              </div>
              <h2 className='text-2xl font-bold text-golden-300'>
                {t.contact.title}
              </h2>
            </div>
            <p className='text-cosmic-200 mb-4 leading-relaxed'>
              {t.contact.content}
            </p>
            <div className='p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg'>
              <a
                href={`mailto:${t.contact.email}?subject=${encodeURIComponent(t.contact.emailSubject)}`}
                className='text-green-300 hover:text-green-200 font-semibold flex items-center space-x-2 transition-colors'
              >
                <FaEnvelope className='w-5 h-5' />
                <span>{t.contact.email}</span>
              </a>
            </div>
          </section>

          {/* Legal Links */}
          <section className='card p-6 hover-lift'>
            <div className='flex flex-wrap gap-4 justify-center'>
              <Link
                href={legalLinks.privacyPolicy}
                className='px-4 py-2 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 border border-purple-500/30 rounded-lg text-purple-300 hover:text-purple-200 transition-all duration-300'
              >
                {t.links.privacyPolicy}
              </Link>
              <Link
                href={legalLinks.termsOfUse}
                className='px-4 py-2 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 border border-purple-500/30 rounded-lg text-purple-300 hover:text-purple-200 transition-all duration-300'
              >
                {t.links.termsOfUse}
              </Link>
              <Link
                href={legalLinks.home}
                className='px-4 py-2 bg-gradient-to-r from-gold/20 to-amber-400/20 hover:from-gold/30 hover:to-amber-400/30 border border-gold/30 rounded-lg text-gold hover:text-amber-300 transition-all duration-300'
              >
                {t.links.backToHome}
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function DataDeletionPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-cosmic-black flex items-center justify-center'>
          <div className='text-cosmic-300'>Loading...</div>
        </div>
      }
    >
      <DataDeletionContent />
    </Suspense>
  );
}
