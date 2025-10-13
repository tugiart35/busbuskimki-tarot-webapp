#!/usr/bin/env node

/**
 * Eksik Anahtarları Ekleyen Script
 *
 * Tespit edilen 40 eksik anahtarı tr, en, sr dosyalarına ekler
 */

const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = './messages';

// Eksik anahtarlar ve çevirileri
const missingKeys = {
  tr: {
    auth: {
      page: {
        nameTooShort: 'Ad en az 2 karakter olmalıdır',
        surnameTooShort: 'Soyad en az 2 karakter olmalıdır',
        signingIn: 'Giriş yapılıyor...',
        loginSuccess: 'Giriş başarılı!',
        emailConfirmationRequired:
          'E-posta adresinizi onaylamanız gerekmektedir',
        signingUp: 'Kayıt olunuyor...',
        registerSuccess: 'Kayıt başarılı! Hoş geldiniz!',
        rateLimitExceeded:
          'Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.',
        googleLogin: 'Google ile Giriş',
        googleRegister: 'Google ile Kayıt Ol',
        sendingEmail: 'E-posta gönderiliyor...',
        resendEmail: 'E-postayı Tekrar Gönder',
        passwordResetDescription:
          'E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.',
        retryAfter: 'saniye sonra tekrar deneyin',
        genderSelect: 'Cinsiyet Seçin',
        loginButton: 'Giriş Yap',
        registerButton: 'Kayıt Ol',
        passwordResetTitle: 'Şifremi Unuttum',
        sendEmail: 'E-posta Gönder',
        emailConfirmationTitle: 'E-posta Onayı',
        switchToRegister: 'Hesabınız yok mu? Kayıt olun',
        switchToLogin: 'Zaten hesabınız var mı? Giriş yapın',
      },
      messages: {
        loginRequired: 'Bu işlem için giriş yapmanız gerekiyor',
      },
    },
    password: {
      rules:
        'Şifre en az 6 karakter olmalı, bir büyük harf, bir küçük harf ve bir rakam içermelidir',
    },
    readings: {
      newLoverReading: 'Yeni Aşk Açılımı',
      relationshipProblemsReading: 'İlişki Sorunları Açılımı',
      tarotReading: 'Tarot Okuması',
      moneyReading: 'Para ve Finans Okuması',
    },
    statistics: {
      readingHabits: 'Okuma Alışkanlıkları',
      trendAnalysis: 'Trend Analizi',
      readingTypes: 'Okuma Türleri',
      monthlyTrend: 'Aylık Trend',
      weeklyActivity: 'Haftalık Aktivite',
      personalCycles: 'Kişisel Döngüler',
      lifePinnacles: 'Hayat Zirveleri',
      lifeChallenges: 'Hayat Zorlukları',
      activityPatterns: 'Aktivite Desenleri',
      achievementsGoals: 'Başarılar ve Hedefler',
      readingTypesDistribution: 'Okuma Türleri Dağılımı',
      personalInsights: 'Kişisel İçgörüler',
    },
  },
  en: {
    auth: {
      page: {
        nameTooShort: 'Name must be at least 2 characters',
        surnameTooShort: 'Surname must be at least 2 characters',
        signingIn: 'Signing in...',
        loginSuccess: 'Login successful!',
        emailConfirmationRequired: 'You need to confirm your email address',
        signingUp: 'Signing up...',
        registerSuccess: 'Registration successful! Welcome!',
        rateLimitExceeded: 'Too many attempts. Please try again later.',
        googleLogin: 'Sign in with Google',
        googleRegister: 'Sign up with Google',
        sendingEmail: 'Sending email...',
        resendEmail: 'Resend Email',
        passwordResetDescription:
          "Enter your email address and we'll send you a password reset link.",
        retryAfter: 'try again after seconds',
        genderSelect: 'Select Gender',
        loginButton: 'Sign In',
        registerButton: 'Sign Up',
        passwordResetTitle: 'Forgot Password',
        sendEmail: 'Send Email',
        emailConfirmationTitle: 'Email Confirmation',
        switchToRegister: "Don't have an account? Sign up",
        switchToLogin: 'Already have an account? Sign in',
      },
      messages: {
        loginRequired: 'You need to be logged in for this action',
      },
    },
    password: {
      rules:
        'Password must be at least 6 characters and contain one uppercase letter, one lowercase letter, and one number',
    },
    readings: {
      newLoverReading: 'New Love Reading',
      relationshipProblemsReading: 'Relationship Problems Reading',
      tarotReading: 'Tarot Reading',
      moneyReading: 'Money and Finance Reading',
    },
    statistics: {
      readingHabits: 'Reading Habits',
      trendAnalysis: 'Trend Analysis',
      readingTypes: 'Reading Types',
      monthlyTrend: 'Monthly Trend',
      weeklyActivity: 'Weekly Activity',
      personalCycles: 'Personal Cycles',
      lifePinnacles: 'Life Pinnacles',
      lifeChallenges: 'Life Challenges',
      activityPatterns: 'Activity Patterns',
      achievementsGoals: 'Achievements and Goals',
      readingTypesDistribution: 'Reading Types Distribution',
      personalInsights: 'Personal Insights',
    },
  },
  sr: {
    auth: {
      page: {
        nameTooShort: 'Ime mora imati najmanje 2 karaktera',
        surnameTooShort: 'Prezime mora imati najmanje 2 karaktera',
        signingIn: 'Prijavljivanje...',
        loginSuccess: 'Prijava uspešna!',
        emailConfirmationRequired: 'Morate potvrditi svoju email adresu',
        signingUp: 'Registracija...',
        registerSuccess: 'Registracija uspešna! Dobrodošli!',
        rateLimitExceeded: 'Previše pokušaja. Molimo pokušajte kasnije.',
        googleLogin: 'Prijavi se sa Google',
        googleRegister: 'Registruj se sa Google',
        sendingEmail: 'Slanje email-a...',
        resendEmail: 'Pošalji ponovo email',
        passwordResetDescription:
          'Unesite svoju email adresu i poslaćemo vam link za resetovanje lozinke.',
        retryAfter: 'pokušajte ponovo nakon sekundi',
        genderSelect: 'Izaberite pol',
        loginButton: 'Prijavi se',
        registerButton: 'Registruj se',
        passwordResetTitle: 'Zaboravljena lozinka',
        sendEmail: 'Pošalji email',
        emailConfirmationTitle: 'Potvrda email-a',
        switchToRegister: 'Nemate nalog? Registrujte se',
        switchToLogin: 'Već imate nalog? Prijavite se',
      },
      messages: {
        loginRequired: 'Morate biti prijavljeni za ovu radnju',
      },
    },
    password: {
      rules:
        'Lozinka mora imati najmanje 6 karaktera i sadržati jedno veliko slovo, jedno malo slovo i jedan broj',
    },
    readings: {
      newLoverReading: 'Čitanje nove ljubavi',
      relationshipProblemsReading: 'Čitanje problema u vezi',
      tarotReading: 'Tarot čitanje',
      moneyReading: 'Čitanje novca i finansija',
    },
    statistics: {
      readingHabits: 'Navike čitanja',
      trendAnalysis: 'Analiza trenda',
      readingTypes: 'Tipovi čitanja',
      monthlyTrend: 'Mesečni trend',
      weeklyActivity: 'Nedeljne aktivnosti',
      personalCycles: 'Lični ciklusi',
      lifePinnacles: 'Životni vrhunci',
      lifeChallenges: 'Životni izazovi',
      activityPatterns: 'Obrasci aktivnosti',
      achievementsGoals: 'Postignuća i ciljevi',
      readingTypesDistribution: 'Distribucija tipova čitanja',
      personalInsights: 'Lični uvidi',
    },
  },
};

function deepMerge(target, source) {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }

  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function addMissingKeys(locale) {
  console.log(
    `\n🔧 ${locale.toUpperCase()} dosyasına eksik anahtarlar ekleniyor...`
  );

  const jsonPath = path.join(MESSAGES_DIR, `${locale}.json`);

  if (!fs.existsSync(jsonPath)) {
    console.log(`❌ ${locale}.json bulunamadı, atlanıyor...`);
    return;
  }

  // Backup oluştur
  const backupPath = path.join(
    MESSAGES_DIR,
    `${locale}.backup-missing-keys-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  );
  fs.copyFileSync(jsonPath, backupPath);
  console.log(`✅ Backup: ${path.basename(backupPath)}`);

  // JSON'u yükle
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  // Eksik anahtarları birleştir
  const updatedData = deepMerge(data, missingKeys[locale]);

  // Kaydet
  fs.writeFileSync(jsonPath, JSON.stringify(updatedData, null, 2), 'utf-8');

  console.log(`✅ ${locale}.json güncellendi`);

  // Eklenen anahtar sayısını hesapla
  let addedCount = 0;

  // auth.page anahtarları
  Object.keys(missingKeys[locale].auth.page).forEach(key => {
    if (!data.auth?.page?.[key]) addedCount++;
  });

  // auth.messages
  if (!data.auth?.messages?.loginRequired) addedCount++;

  // password.rules
  if (!data.password?.rules) addedCount++;

  // readings
  Object.keys(missingKeys[locale].readings).forEach(key => {
    if (!data.readings?.[key]) addedCount++;
  });

  // statistics
  Object.keys(missingKeys[locale].statistics).forEach(key => {
    if (!data.statistics?.[key]) addedCount++;
  });

  console.log(`   📊 ${addedCount} yeni anahtar eklendi`);

  return addedCount;
}

// Ana fonksiyon
async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║          EKSİK ANAHTARLARI EKLE - 40 Anahtar          ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  const locales = ['tr', 'en', 'sr'];
  const results = {};

  for (const locale of locales) {
    const count = addMissingKeys(locale);
    results[locale] = count;
  }

  console.log('\n\n╔════════════════════════════════════════════════════════╗');
  console.log('║                        ÖZET                             ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  Object.entries(results).forEach(([locale, count]) => {
    console.log(`${locale.toUpperCase()}: ${count || 0} anahtar eklendi`);
  });

  console.log('\n✨ İşlem tamamlandı!');
  console.log('\n💡 Sonraki adım: node find-missing-translations.js');
  console.log('   (Tüm anahtarların eklendiğini doğrula)\n');
}

main().catch(error => {
  console.error('❌ Hata:', error);
  process.exit(1);
});
