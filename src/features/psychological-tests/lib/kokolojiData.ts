/*
  Psikolojik Test Verileri - Genişletilmiş Versiyon
  ----------------------------------------------------------------------
  Bu dosya ne işe yarar?
  - 10 farklı psikolojik testin sorularını ve yorumlarını içerir
  - Her test için detaylı psikolojik analizler sunar
  - Test verilerini merkezi olarak yönetir
  - MBTI, Aşk Dili, Stres, Yaratıcılık ve Kariyer testlerini kapsar
*/

export interface TestQuestion {
  text: string;
  answers: {
    value: string;
    text: string;
    meaning: string;
    score?: number; // MBTI için puan sistemi
  }[];
}

export interface PsychologicalTest {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: TestQuestion[];
  resultType:
    | 'kokoloji'
    | 'mbti'
    | 'love-language'
    | 'stress'
    | 'creativity'
    | 'career'
    | 'big-five'
    | 'enneagram'
    | 'friend-energy'
    | 'love-vibration'
    | 'numerology-tarot';
  totalQuestions: number;
}

// MBTI Kişilik Tipleri ve Açıklamaları
const mbtiTypes = {
  INTJ: {
    title: 'Mimar',
    description: 'Stratejik düşünür, planlayıcı ve bağımsız',
    traits: 'Analitik, yaratıcı, kararlı, bağımsız',
    career: 'Bilim insanı, mühendis, stratejist, yazar',
  },
  INTP: {
    title: 'Mantıkçı',
    description: 'Yaratıcı yenilikçi, teorik düşünür',
    traits: 'Mantıklı, yaratıcı, meraklı, objektif',
    career: 'Bilim insanı, matematikçi, filozof, programcı',
  },
  ENTJ: {
    title: 'Komutan',
    description: 'Cesur, kararlı, doğal lider',
    traits: 'Kararlı, lider, stratejik, direkt',
    career: 'CEO, avukat, yönetici, girişimci',
  },
  ENTP: {
    title: 'Münazır',
    description: 'Akıllı ve meraklı düşünür',
    traits: 'Yaratıcı, esnek, zeki, cesur',
    career: 'Girişimci, avukat, satış, danışman',
  },
  INFJ: {
    title: 'Avukat',
    description: 'Sessiz ve gizemli idealist',
    traits: 'İdealist, kararlı, yaratıcı, empatik',
    career: 'Yazar, psikolog, öğretmen, danışman',
  },
  INFP: {
    title: 'Arabulucu',
    description: 'Şair ruhlu, yardımsever idealist',
    traits: 'İdealist, yaratıcı, empatik, esnek',
    career: 'Yazar, sanatçı, psikolog, öğretmen',
  },
  ENFJ: {
    title: 'Protagonist',
    description: 'Karizmatik ve ilham verici lider',
    traits: 'Lider, karizmatik, empatik, kararlı',
    career: 'Öğretmen, danışman, yönetici, eğitmen',
  },
  ENFP: {
    title: 'Kampanyacı',
    description: 'Özgür ruhlu, yaratıcı sosyal',
    traits: 'Yaratıcı, enerjik, sosyal, esnek',
    career: 'Gazeteci, sanatçı, eğitmen, satış',
  },
  ISTJ: {
    title: 'Mantıkçı',
    description: 'Pratik ve gerçekçi düzenli',
    traits: 'Pratik, güvenilir, düzenli, kararlı',
    career: 'Muhasebeci, yönetici, polis, asker',
  },
  ISFJ: {
    title: 'Savunucu',
    description: 'Çok özverili ve koruyucu',
    traits: 'Güvenilir, özverili, pratik, sıcak',
    career: 'Hemşire, öğretmen, sosyal hizmet, sekreter',
  },
  ESTJ: {
    title: 'Yönetici',
    description: 'Mükemmel yönetici, pratik',
    traits: 'Lider, pratik, kararlı, organize',
    career: 'Yönetici, asker, polis, avukat',
  },
  ESFJ: {
    title: 'Konsül',
    description: 'Çok sosyal ve popüler',
    traits: 'Sosyal, güvenilir, özverili, pratik',
    career: 'Öğretmen, hemşire, satış, yönetici',
  },
  ISTP: {
    title: 'Virtüöz',
    description: 'Cesur ve pratik deneyselci',
    traits: 'Pratik, esnek, cesur, analitik',
    career: 'Teknisyen, pilot, atlet, polis',
  },
  ISFP: {
    title: 'Maceraperest',
    description: 'Esnek ve çekici sanatçı',
    traits: 'Yaratıcı, esnek, sıcak, pratik',
    career: 'Sanatçı, tasarımcı, hemşire, öğretmen',
  },
  ESTP: {
    title: 'Girişimci',
    description: 'Akıllı, enerjik ve çok algılı',
    traits: 'Enerjik, pratik, cesur, esnek',
    career: 'Girişimci, satış, atlet, pilot',
  },
  ESFP: {
    title: 'Eğlendirici',
    description: 'Spontane, enerjik ve eğlenceli',
    traits: 'Enerjik, sosyal, esnek, pratik',
    career: 'Sanatçı, eğlendirici, satış, öğretmen',
  },
};

// Aşk Dili Tipleri
const loveLanguages = {
  words: {
    title: 'Onaylayıcı Sözler',
    description: 'Sözlerle sevgi ifade etmeyi önemser',
    traits: 'Teşekkür, övgü, sevgi sözleri önemli',
    tips: 'Sık sık "seni seviyorum" deyin, övgüde bulunun',
  },
  acts: {
    title: 'Hizmet Davranışları',
    description: 'Yardım ve hizmetle sevgi gösterir',
    traits: 'Yardım etmek, destek olmak önemli',
    tips: 'Günlük işlerde yardım edin, sorumluluk alın',
  },
  gifts: {
    title: 'Hediye Alma',
    description: 'Hediyelerle sevgi ifade eder',
    traits: 'Sembolik hediyeler, sürprizler önemli',
    tips: 'Küçük hediyeler, sürprizler yapın',
  },
  time: {
    title: 'Kaliteli Zaman',
    description: 'Birlikte geçirilen zamanı önemser',
    traits: 'Birlikte aktiviteler, sohbet önemli',
    tips: 'Telefonu kapatın, tam dikkat verin',
  },
  touch: {
    title: 'Fiziksel Dokunma',
    description: 'Fiziksel temasla sevgi hisseder',
    traits: 'Sarılmak, el tutmak, öpücük önemli',
    tips: 'Sık sık dokunun, fiziksel temas kurun',
  },
};

// İsim Enerjisi - Numeroloji ve Tarot Eşleştirmeleri
// Pythagoras numerolojisi + Rider-Waite tarot sembolizmi
// Kaynak: Pythagorean numerology, Rider-Waite tarot symbolism
// İsim Enerjisi Tarot Kartları - i18n destekli
const getNameTarotCards = (t: (_key: string) => string) => ({
  1: {
    number: 1,
    card: t('psychTests.tests.nameTarot.cards.1.card'),
    cardTurkish: t('psychTests.tests.nameTarot.cards.1.cardTurkish'),
    emoji: t('psychTests.tests.nameTarot.cards.1.emoji'),
    theme: t('psychTests.tests.nameTarot.cards.1.theme'),
    message: t('psychTests.tests.nameTarot.cards.1.message'),
    description: t('psychTests.tests.nameTarot.cards.1.description'),
    keyWords: (() => {
      try {
        return JSON.parse(t('psychTests.tests.nameTarot.cards.1.keyWords'));
      } catch {
        return [];
      }
    })(),
    advice: t('psychTests.tests.nameTarot.cards.1.advice'),
    element: t('psychTests.tests.nameTarot.cards.1.element'),
    astrology: t('psychTests.tests.nameTarot.cards.1.astrology'),
  },
  2: {
    number: 2,
    card: t('psychTests.tests.nameTarot.cards.2.card'),
    cardTurkish: t('psychTests.tests.nameTarot.cards.2.cardTurkish'),
    emoji: t('psychTests.tests.nameTarot.cards.2.emoji'),
    theme: t('psychTests.tests.nameTarot.cards.2.theme'),
    message: t('psychTests.tests.nameTarot.cards.2.message'),
    description: t('psychTests.tests.nameTarot.cards.2.description'),
    keyWords: (() => {
      try {
        return JSON.parse(t('psychTests.tests.nameTarot.cards.2.keyWords'));
      } catch {
        return [];
      }
    })(),
    advice: t('psychTests.tests.nameTarot.cards.2.advice'),
    element: t('psychTests.tests.nameTarot.cards.2.element'),
    astrology: t('psychTests.tests.nameTarot.cards.2.astrology'),
  },
  3: {
    number: 3,
    card: t('psychTests.tests.nameTarot.cards.3.card'),
    cardTurkish: t('psychTests.tests.nameTarot.cards.3.cardTurkish'),
    emoji: t('psychTests.tests.nameTarot.cards.3.emoji'),
    theme: t('psychTests.tests.nameTarot.cards.3.theme'),
    message: t('psychTests.tests.nameTarot.cards.3.message'),
    description: t('psychTests.tests.nameTarot.cards.3.description'),
    keyWords: (() => {
      try {
        return JSON.parse(t('psychTests.tests.nameTarot.cards.3.keyWords'));
      } catch {
        return [];
      }
    })(),
    advice: t('psychTests.tests.nameTarot.cards.3.advice'),
    element: t('psychTests.tests.nameTarot.cards.3.element'),
    astrology: t('psychTests.tests.nameTarot.cards.3.astrology'),
  },
  4: {
    number: 4,
    card: t('psychTests.tests.nameTarot.cards.4.card'),
    cardTurkish: t('psychTests.tests.nameTarot.cards.4.cardTurkish'),
    emoji: t('psychTests.tests.nameTarot.cards.4.emoji'),
    theme: t('psychTests.tests.nameTarot.cards.4.theme'),
    message: t('psychTests.tests.nameTarot.cards.4.message'),
    description: t('psychTests.tests.nameTarot.cards.4.description'),
    keyWords: (() => {
      try {
        return JSON.parse(t('psychTests.tests.nameTarot.cards.4.keyWords'));
      } catch {
        return [];
      }
    })(),
    advice: t('psychTests.tests.nameTarot.cards.4.advice'),
    element: t('psychTests.tests.nameTarot.cards.4.element'),
    astrology: t('psychTests.tests.nameTarot.cards.4.astrology'),
  },
  5: {
    number: 5,
    card: t('psychTests.tests.nameTarot.cards.5.card'),
    cardTurkish: t('psychTests.tests.nameTarot.cards.5.cardTurkish'),
    emoji: t('psychTests.tests.nameTarot.cards.5.emoji'),
    theme: t('psychTests.tests.nameTarot.cards.5.theme'),
    message: t('psychTests.tests.nameTarot.cards.5.message'),
    description: t('psychTests.tests.nameTarot.cards.5.description'),
    keyWords: (() => {
      try {
        return JSON.parse(t('psychTests.tests.nameTarot.cards.5.keyWords'));
      } catch {
        return [];
      }
    })(),
    advice: t('psychTests.tests.nameTarot.cards.5.advice'),
    element: t('psychTests.tests.nameTarot.cards.5.element'),
    astrology: t('psychTests.tests.nameTarot.cards.5.astrology'),
  },
  6: {
    number: 6,
    card: t('psychTests.tests.nameTarot.cards.6.card'),
    cardTurkish: t('psychTests.tests.nameTarot.cards.6.cardTurkish'),
    emoji: t('psychTests.tests.nameTarot.cards.6.emoji'),
    theme: t('psychTests.tests.nameTarot.cards.6.theme'),
    message: t('psychTests.tests.nameTarot.cards.6.message'),
    description: t('psychTests.tests.nameTarot.cards.6.description'),
    keyWords: (() => {
      try {
        return JSON.parse(t('psychTests.tests.nameTarot.cards.6.keyWords'));
      } catch {
        return [];
      }
    })(),
    advice: t('psychTests.tests.nameTarot.cards.6.advice'),
    element: t('psychTests.tests.nameTarot.cards.6.element'),
    astrology: t('psychTests.tests.nameTarot.cards.6.astrology'),
  },
  7: {
    number: 7,
    card: t('psychTests.tests.nameTarot.cards.7.card'),
    cardTurkish: t('psychTests.tests.nameTarot.cards.7.cardTurkish'),
    emoji: t('psychTests.tests.nameTarot.cards.7.emoji'),
    theme: t('psychTests.tests.nameTarot.cards.7.theme'),
    message: t('psychTests.tests.nameTarot.cards.7.message'),
    description: t('psychTests.tests.nameTarot.cards.7.description'),
    keyWords: (() => {
      try {
        return JSON.parse(t('psychTests.tests.nameTarot.cards.7.keyWords'));
      } catch {
        return [];
      }
    })(),
    advice: t('psychTests.tests.nameTarot.cards.7.advice'),
    element: t('psychTests.tests.nameTarot.cards.7.element'),
    astrology: t('psychTests.tests.nameTarot.cards.7.astrology'),
  },
  8: {
    number: 8,
    card: t('psychTests.tests.nameTarot.cards.8.card'),
    cardTurkish: t('psychTests.tests.nameTarot.cards.8.cardTurkish'),
    emoji: t('psychTests.tests.nameTarot.cards.8.emoji'),
    theme: t('psychTests.tests.nameTarot.cards.8.theme'),
    message: t('psychTests.tests.nameTarot.cards.8.message'),
    description: t('psychTests.tests.nameTarot.cards.8.description'),
    keyWords: (() => {
      try {
        return JSON.parse(t('psychTests.tests.nameTarot.cards.8.keyWords'));
      } catch {
        return [];
      }
    })(),
    advice: t('psychTests.tests.nameTarot.cards.8.advice'),
    element: t('psychTests.tests.nameTarot.cards.8.element'),
    astrology: t('psychTests.tests.nameTarot.cards.8.astrology'),
  },
  9: {
    number: 9,
    card: t('psychTests.tests.nameTarot.cards.9.card'),
    cardTurkish: t('psychTests.tests.nameTarot.cards.9.cardTurkish'),
    emoji: t('psychTests.tests.nameTarot.cards.9.emoji'),
    theme: t('psychTests.tests.nameTarot.cards.9.theme'),
    message: t('psychTests.tests.nameTarot.cards.9.message'),
    description: t('psychTests.tests.nameTarot.cards.9.description'),
    keyWords: (() => {
      try {
        return JSON.parse(t('psychTests.tests.nameTarot.cards.9.keyWords'));
      } catch {
        return [];
      }
    })(),
    advice: t('psychTests.tests.nameTarot.cards.9.advice'),
    element: t('psychTests.tests.nameTarot.cards.9.element'),
    astrology: t('psychTests.tests.nameTarot.cards.9.astrology'),
  },
  11: {
    number: 11,
    card: t('psychTests.tests.nameTarot.cards.11.card'),
    cardTurkish: t('psychTests.tests.nameTarot.cards.11.cardTurkish'),
    emoji: t('psychTests.tests.nameTarot.cards.11.emoji'),
    theme: t('psychTests.tests.nameTarot.cards.11.theme'),
    message: t('psychTests.tests.nameTarot.cards.11.message'),
    description: t('psychTests.tests.nameTarot.cards.11.description'),
    keyWords: (() => {
      try {
        return JSON.parse(t('psychTests.tests.nameTarot.cards.11.keyWords'));
      } catch {
        return [];
      }
    })(),
    advice: t('psychTests.tests.nameTarot.cards.11.advice'),
    element: t('psychTests.tests.nameTarot.cards.11.element'),
    astrology: t('psychTests.tests.nameTarot.cards.11.astrology'),
  },
  22: {
    number: 22,
    card: t('psychTests.tests.nameTarot.cards.22.card'),
    cardTurkish: t('psychTests.tests.nameTarot.cards.22.cardTurkish'),
    emoji: t('psychTests.tests.nameTarot.cards.22.emoji'),
    theme: t('psychTests.tests.nameTarot.cards.22.theme'),
    message: t('psychTests.tests.nameTarot.cards.22.message'),
    description: t('psychTests.tests.nameTarot.cards.22.description'),
    keyWords: (() => {
      try {
        return JSON.parse(t('psychTests.tests.nameTarot.cards.22.keyWords'));
      } catch {
        return [];
      }
    })(),
    advice: t('psychTests.tests.nameTarot.cards.22.advice'),
    element: t('psychTests.tests.nameTarot.cards.22.element'),
    astrology: t('psychTests.tests.nameTarot.cards.22.astrology'),
  },
});

// Stres Düzeyi Profilleri ve Meditasyon Önerileri
// DASS21 ve psikolojik stres değerlendirme ölçeklerine dayalı
// Kaynak: Lovibond & Lovibond (1995) DASS21, Harvard Medical School stres yönetimi araştırmaları
const stressProfiles = {
  low: {
    level: 'Düşük Stres',
    emoji: '😌',
    scoreRange: '0-15',
    description:
      'Stres seviyeniz oldukça düşük görünüyor! Hayatınızda dengeli bir durum var ve günlük stres faktörlerini iyi yönetiyorsunuz.',
    message:
      'Harika! Stres yönetiminiz güçlü. Mevcut dengenizi korumaya devam edin.',
    meditationTips: [
      '🧘‍♀️ Önleyici meditasyon: Günde 10-15 dakika nefes meditasyonu yaparak dengeyi koruyun',
      '🌿 Doğada zaman geçirin: Haftada 2-3 kez doğa yürüyüşleri stres direncinizi artırır',
      '📖 Farkındalık pratiği: Günlük 5 dakika mindfulness ile iç huzurunuzu pekiştirin',
      '💤 Uyku hijyeni: Düzenli uyku saatleri stres direncinizin temelidir',
    ],
    wellnessAdvice:
      'Mevcut dengenizi korumak için düzenli egzersiz, sağlıklı beslenme ve sosyal bağlantıları sürdürmeye devam edin.',
  },
  moderate: {
    level: 'Orta Düzey Stres',
    emoji: '😐',
    scoreRange: '16-30',
    description:
      'Orta düzeyde stres yaşıyorsunuz. Bu normal bir durum, ancak stres yönetimi teknikleri ile daha iyi bir denge kurabilirsiniz.',
    message:
      'Stres seviyeniz yönetilebilir. Meditasyon ve rahatlama teknikleri ile daha iyi bir denge kurabilirsiniz.',
    meditationTips: [
      '🧘‍♂️ Günlük meditasyon: Her gün 15-20 dakika nefes odaklı meditasyon yapın',
      '🎵 Rahatlama müziği: Gün içinde 10 dakika rahatlama müziği dinleyin',
      '💆‍♀️ Vücut tarama: Akşamları 10 dakika vücut tarama meditasyonu deneyin',
      '🌊 4-7-8 Nefes Tekniği: Stres anında 4 saniye nefes al, 7 saniye tut, 8 saniye ver',
      '🧘‍♀️ Yürüyüş meditasyonu: Haftada 2-3 kez 20 dakika yürüyüş sırasında farkındalık pratiği',
    ],
    wellnessAdvice:
      'Düzenli egzersiz, beslenme düzeni ve sosyal destek sisteminizi güçlendirin. Haftada en az 2 kez rahatlama aktiviteleri yapın.',
  },
  high: {
    level: 'Yüksek Stres',
    emoji: '😰',
    scoreRange: '31-45',
    description:
      'Yüksek düzeyde stres yaşıyorsunuz. Bu durum fiziksel ve duygusal sağlığınızı etkileyebilir. Stres yönetimi tekniklerini uygulamanız önemli.',
    message:
      'Stres seviyeniz yüksek. Düzenli meditasyon ve profesyonel destek almanız önerilir.',
    meditationTips: [
      '🧘‍♀️ Derin meditasyon: Günde 2 kez 20-30 dakika derin nefes meditasyonu',
      '🌙 Gece meditasyonu: Uyku öncesi 15 dakika rahatlama meditasyonu',
      '💆‍♂️ Aşamalı kas gevşetme: Günlük 20 dakika kas gevşetme teknikleri',
      '🍃 Doğa meditasyonu: Haftada 3 kez doğada 30 dakika mindfulness',
      '🎭 Farkındalık meditasyonu: Stres anlarında 5-10 dakika anlık farkındalık',
      '🧘‍♀️ Rehberli meditasyon: Uygulamalardan rehberli meditasyon dinleyin',
      '💧 Sıcak banyo meditasyonu: Haftada 2-3 kez sıcak banyo sırasında nefes pratiği',
    ],
    wellnessAdvice:
      'Acil öncelik: Düzenli uyku (7-9 saat), dengeli beslenme, günlük 30 dakika egzersiz. Profesyonel destek almayı düşünün.',
  },
  veryHigh: {
    level: 'Çok Yüksek Stres',
    emoji: '😱',
    scoreRange: '46-60',
    description:
      'Çok yüksek düzeyde stres yaşıyorsunuz. Bu durum günlük yaşamınızı ciddi şekilde etkileyebilir. Profesyonel destek almanız önemle tavsiye edilir.',
    message:
      'Stres seviyeniz çok yüksek. Lütfen profesyonel bir sağlık uzmanına danışın ve düzenli meditasyon pratiği başlatın.',
    meditationTips: [
      '🚨 Acil meditasyon: Gün içinde her 2-3 saatte bir 10 dakika nefes meditasyonu',
      '🧘‍♀️ Günde 3 kez derin meditasyon: Sabah, öğlen, akşam 30 dakika rehberli meditasyon',
      '💆‍♀️ 24/7 Farkındalık: Her stresli anı meditasyon fırsatına çevirin',
      '🌊 4-7-8 Tekniği: Her stres atak anında derhal uygulayın (günde 10+ kez)',
      '🧘‍♂️ Yoga meditasyonu: Haftada 4-5 kez 45 dakika yoga + meditasyon',
      '🎵 Sürekli rahatlama: Çalışırken veya dinlenirken arka planda meditasyon müziği',
      '💤 Uyku meditasyonu: Her gece uyku öncesi 20 dakika rahatlama meditasyonu',
      '🏥 Profesyonel destek: Bir psikolog veya terapist ile çalışın',
    ],
    wellnessAdvice:
      'Acil durum: Lütfen bir sağlık uzmanına danışın. Düzenli egzersiz, uyku hijyeni ve sağlıklı beslenme kritik. Sosyal destek sisteminizi güçlendirin.',
    urgentNote:
      '⚠️ Bu test sonuçları yalnızca bilgilendirme amaçlıdır. Stres belirtileriniz günlük yaşamınızı ciddi şekilde etkiliyorsa, lütfen bir psikolog, psikiyatrist veya aile hekiminize başvurun.',
  },
};

// Aşk Enerjisi (Love Vibration) Profilleri
// Astroloji ve Tarot temelli - Venüs, Mars, Merkür gezegen enerjileri
// Kaynak: Klasik astroloji ve modern kişilik psikolojisi sentezi
const loveVibrationProfiles = {
  venusHarmony: {
    name: 'Venüs Uyumu - Romantik Ruh 💕',
    title: 'Venüs Enerjisi',
    emoji: '💕',
    planet: 'Venüs',
    element: 'Hava/Su',
    tarotCard: 'The Lovers (Aşıklar)',
    tagline: 'Aşk senin doğal dilin',
    description:
      'Venüs enerjisi ile titreşiyorsun! Romantik, uyumlu ve sevgi dolu bir aşk enerjine sahipsin. İlişkilerde denge, güzellik ve uyum ararsın. Doğal bir romantiksin.',
    loveStyle: 'Romantik, uyumlu, estetik değerlere önem veren',
    strengths: [
      '💝 Romantizm ve şefkat',
      '🌹 Estetik ve güzellik duyarlılığı',
      '🤝 Uyum ve denge arayışı',
      '💞 Sevgi ifade etme yeteneği',
    ],
    compatibility: 'Venüs ve Merkür enerjileri ile uyumlu',
    astrologicalInsight:
      'Venüs, klasik astrolojide aşk, güzellik ve uyumun gezegenidir. Bu enerji, ilişkilerde romantizm, estetik ve duygusal bağ arayışını temsil eder.',
  },
  marsPassion: {
    name: 'Mars Tutkusu - Ateşli Kalp 🔥',
    title: 'Mars Enerjisi',
    emoji: '🔥',
    planet: 'Mars',
    element: 'Ateş',
    tarotCard: 'Strength (Güç)',
    tagline: 'Tutkun yıldızlara değer',
    description:
      'Mars enerjisi ile yanıp tutuşuyorsun! Tutkulu, cesur ve kararlı bir aşk enerjine sahipsin. İlişkilerde heyecan, tutku ve güçlü bağlar ararsın. Aşkını yoğun yaşarsın.',
    loveStyle: 'Tutkulu, cesur, kararlı, heyecan arayan',
    strengths: [
      '🔥 Yoğun tutku ve arzu',
      '💪 Cesaret ve kararlılık',
      '⚡ Enerji ve heyecan',
      '🎯 Amaç odaklı sevgi',
    ],
    compatibility: 'Mars ve Venüs enerjileri ile dengeli',
    astrologicalInsight:
      'Mars, klasik astrolojide arzu, eylem ve tutkunun gezegenidir. Bu enerji, ilişkilerde güçlü bağlar, heyecan ve kararlılık arayışını temsil eder.',
  },
  mercuryCommunication: {
    name: 'Merkür İletişimi - Zihinsel Bağ 💬',
    title: 'Merkür Enerjisi',
    emoji: '💬',
    planet: 'Merkür',
    element: 'Hava',
    tarotCard: 'The Magician (Büyücü)',
    tagline: 'Sözler senin aşk dilin',
    description:
      'Merkür enerjisi ile iletişim kuruyorsun! Akıllı, konuşkan ve zihinsel bağ arayan bir aşk enerjine sahipsin. İlişkilerde derin sohbetler, anlayış ve entelektüel bağ önemli.',
    loveStyle: 'İletişim odaklı, zihinsel, konuşkan, anlayışlı',
    strengths: [
      '💬 Güçlü iletişim',
      '🧠 Zihinsel uyum arayışı',
      '📚 Entelektüel bağ',
      '🗣️ Dürüst ve açık',
    ],
    compatibility: 'Merkür ve Venüs enerjileri ile uyumlu',
    astrologicalInsight:
      'Merkür, klasik astrolojide iletişim, akıl ve bağlantının gezegenidir. Bu enerji, ilişkilerde derin sohbetler, anlayış ve zihinsel uyum arayışını temsil eder.',
  },
  venusMarsMix: {
    name: 'Venüs-Mars Dengesi - Mükemmel Armoni ⚖️',
    title: 'Venüs-Mars Dengesi',
    emoji: '⚖️',
    planet: 'Venüs & Mars',
    element: 'Ateş & Hava',
    tarotCard: 'Temperance (Denge)',
    tagline: 'Romantizm ve tutkunun dengesi',
    description:
      'Hem Venüs hem Mars enerjisini dengeli yaşıyorsun! Hem romantik hem tutkulu, hem yumuşak hem güçlü bir aşk enerjine sahipsin. İdeal dengeli ilişkiler kurarsın.',
    loveStyle: 'Dengeli, hem romantik hem tutkulu, olgun',
    strengths: [
      '⚖️ Romantizm ve tutku dengesi',
      '💕 Hem yumuşak hem güçlü',
      '🎭 Duygusal zeka',
      '✨ Olgun sevgi yaklaşımı',
    ],
    compatibility: 'Tüm enerji tipleri ile uyumlu',
    astrologicalInsight:
      'Venüs ve Mars enerjilerinin dengesi, ilişkilerde hem romantizm hem tutku arayışını temsil eder. Bu denge, olgun ve sağlıklı ilişkilerin temelidir.',
  },
  mercuryVenusMix: {
    name: 'Merkür-Venüs Karışımı - Romantik Diyalog 💝',
    title: 'Merkür-Venüs Karışımı',
    emoji: '💝',
    planet: 'Merkür & Venüs',
    element: 'Hava',
    tarotCard: 'The Empress (İmparatoriçe)',
    tagline: 'Aşkı kelimelerle inşa edersin',
    description:
      'Merkür ve Venüs enerjilerini birleştiriyorsun! Romantik ama iletişim odaklı bir aşk enerjine sahipsin. Sevgi dolu sözler, derin sohbetler ve duygusal anlayış senin tarzın.',
    loveStyle: 'Romantik ve iletişim odaklı, şiirsel, anlayışlı',
    strengths: [
      '💌 Romantik iletişim',
      '📖 Sevgi sözleri',
      '🌸 Estetik duygusallık',
      '💭 Empati ve anlayış',
    ],
    compatibility: 'Venüs ve Merkür dominant profiller ile uyumlu',
    astrologicalInsight:
      'Merkür ve Venüs kombinasyonu, ilişkilerde hem romantizm hem güçlü iletişim arayışını temsil eder. Aşkı kelimelerle ifade etme yeteneği güçlüdür.',
  },
  marsMercuryMix: {
    name: 'Mars-Merkür Karışımı - Akıllı Tutku 🧠',
    title: 'Mars-Merkür Karışımı',
    emoji: '🧠',
    planet: 'Mars & Merkür',
    element: 'Ateş & Hava',
    tarotCard: 'The Chariot (Savaş Arabası)',
    tagline: 'Tutkulu ama stratejik',
    description:
      'Mars ve Merkür enerjilerini birleştiriyorsun! Tutkulu ama akıllı bir aşk enerjine sahipsin. İlişkilerde hem heyecan hem mantık ararsın. Stratejik romantiksin.',
    loveStyle: 'Tutkulu ama düşünceli, cesur, stratejik',
    strengths: [
      '🎯 Stratejik yaklaşım',
      '🔥 Akıllı tutku',
      '⚡ Hızlı karar verme',
      '🗣️ Açık sözlülük',
    ],
    compatibility: 'Mars ve Merkür enerjileri ile uyumlu',
    astrologicalInsight:
      'Mars ve Merkür kombinasyonu, ilişkilerde hem tutku hem zihinsel uyumluluk arayışını temsil eder. Akıllı ve kararlı sevgi yaklaşımı sergilenir.',
  },
  tripleHarmony: {
    name: 'Üçlü Armoni - Kozmik Denge 🌟',
    title: 'Venüs-Mars-Merkür Uyumu',
    emoji: '🌟',
    planet: 'Venüs & Mars & Merkür',
    element: 'Tüm Elementler',
    tarotCard: 'The Star (Yıldız)',
    tagline: 'Kozmik aşk enerjisi',
    description:
      'Üç gezegen enerjisini de dengeli taşıyorsun! Hem romantik, hem tutkulu, hem de iletişime açıksın. Nadir bulunan kozmik bir aşk enerjine sahipsin.',
    loveStyle: 'Dengeli, olgun, çok yönlü, kozmik',
    strengths: [
      '🌟 Tüm enerjilerin dengesi',
      '💫 Olgun aşk yaklaşımı',
      '✨ Çok yönlü sevgi dili',
      '🎭 Durum okuma yeteneği',
    ],
    compatibility: 'Tüm enerji profilleri ile uyumlu',
    astrologicalInsight:
      'Venüs, Mars ve Merkür enerjilerinin dengesi, ilişkilerde bütünlük ve kozmik uyum arayışını temsil eder. Bu nadir denge, olgun ve sağlıklı ilişkilerin göstergesidir.',
  },
  moonIntuition: {
    name: 'Ay Sezgisi - Duygusal Okyanus 🌙',
    title: 'Ay Enerjisi (Bonus)',
    emoji: '🌙',
    planet: 'Ay',
    element: 'Su',
    tarotCard: 'The Moon (Ay)',
    tagline: 'Sezginle seviyorsun',
    description:
      'Ay enerjisi ile derinlere iniyorsun! Sezgisel, duygusal ve gizemli bir aşk enerjine sahipsin. İlişkilerde derin duygusal bağlar ve ruhani uyum ararsın.',
    loveStyle: 'Sezgisel, duygusal, gizemli, ruhani',
    strengths: [
      '🌊 Derin duygusallık',
      '🔮 Güçlü sezgi',
      '💫 Ruhani bağ',
      '🌙 Gizemli çekicilik',
    ],
    compatibility: 'Venüs ve Su elementi enerjileri ile uyumlu',
    astrologicalInsight:
      'Ay, klasik astrolojide duyguların, sezginin ve iç dünyanın simgesidir. Bu enerji, ilişkilerde derin duygusal bağlar ve ruhani uyum arayışını temsil eder.',
  },
};

// Arkadaş Grubu Enerjisi Rolleri
// Sosyal psikoloji ve grup dinamikleri araştırmalarına dayalı, eğlenceli kişilik rolleri
const friendEnergyRoles = {
  wiseMentor: {
    name: 'Grubun Akıl Hocası 🧙‍♂️',
    title: 'Akıl Hocası',
    emoji: '🧙‍♂️',
    tagline: 'Sen grupta herkesin tavsiye aldığı kişisin',
    description:
      'Arkadaşların sorunlarını dinler, mantıklı çözümler sunar ve her zaman en iyi tavsiyeyi verirsin. Sakin, bilge ve güvenilir enerjiyle grubu dengeleyensin.',
    socialRole: 'Danışman ve Mentor',
    strengths: [
      'Olgun ve akıllı düşünür',
      'İyi dinleyici',
      'Sorun çözücü',
      'Güvenilir tavsiyeleri var',
    ],
    funFacts: [
      '📱 Grubun WhatsApp danışma hattısın',
      '🎯 "Ne yapmalıyım?" sorusunun adresisin',
      '🧠 En çok "Haklıymışsın" kelimesini duyarsın',
    ],
    shareText: 'Ben arkadaş grubumun Akıl Hocasıyım! 🧙‍♂️',
  },
  dramaQueen: {
    name: 'Drama Kraliçesi/Kralı 👑',
    title: 'Drama Kraliçesi',
    emoji: '👑',
    tagline: 'Hayatın bir pembe dizi ve sen başroldesin',
    description:
      'Grubun en renkli karakterisin! Her hikayende heyecan, her anında drama var. Hayatın sıkıcı anlarını bile sinema filmi gibi anlatırsın.',
    socialRole: 'Eğlence ve Heyecan Kaynağı',
    strengths: [
      'Hikaye anlatma yeteneği yüksek',
      'Gruba enerji ve heyecan katar',
      'Asla sıkıcı değil',
      'Duygusal ve açık',
    ],
    funFacts: [
      '🎬 Her hikayende plot twist var',
      '😱 "İnanamayacaksın ama..." cümlen meşhur',
      '💅 Grup sohbetlerinin ana karakterisin',
    ],
    shareText: 'Ben arkadaş grubumun Drama Kraliçesiyim! 👑',
  },
  spontaneousExplorer: {
    name: 'Plansız Gezgin 🌍',
    title: 'Plansız Gezgin',
    emoji: '🌍',
    tagline: 'Planlar seni değil, sen planları değiştirirsin',
    description:
      'Spontane, maceracı ve özgür ruhlusun. "Hadi gidelim!" dediğinde herkes hazırlanır. Son dakika planlarının kralısın.',
    socialRole: 'Macera Organizatörü',
    strengths: [
      'Spontane ve esnek',
      'Macera ruhlu',
      'Risk alıcı',
      'Yeni deneyimlere açık',
    ],
    funFacts: [
      '🎒 "5 dakikada hazırım" senin motton',
      '✈️ En iyi planlar plansızlıklardan çıkar diye düşünürsün',
      '🗺️ Google Maps şu an nerede gösterir bilinmez',
    ],
    shareText: 'Ben arkadaş grubumun Plansız Gezginiyim! 🌍',
  },
  momFriend: {
    name: 'Grup Annesi 🤱',
    title: 'Grup Annesi',
    emoji: '🤱',
    tagline: 'Çantan eczane, kalbin melekten',
    description:
      'Grubun koruyucusu ve bakıcısısın. Çantanda her şey var: ıslak mendil, şarj aleti, acil aspirin... Herkes senin yanında güvende hisseder.',
    socialRole: 'Koruyucu ve Destekleyici',
    strengths: ['Düşünceli ve özenli', 'Koruyucu', 'Organize', 'Şefkatli'],
    funFacts: [
      '🎒 Çantanda her acil durum için bir şey var',
      '⏰ "Geç kalmayın" mesajları senden gelir',
      '🌡️ "Üşümez misin?" sorusunun sahibisin',
    ],
    shareText: 'Ben arkadaş grubumun Annesiyim! 🤱',
  },
  partyStarter: {
    name: 'Parti Başlatıcı 🎉',
    title: 'Parti Başlatıcı',
    emoji: '🎉',
    tagline: 'Eğlence başlar, sen gelirsin',
    description:
      'Grubun sosyal organizatörü ve enerji bombasısın! Senden önce toplantı, senden sonra parti. Neşe ve coşku senin işin.',
    socialRole: 'Sosyal Organizatör',
    strengths: [
      'Enerjik ve coşkulu',
      'Organizatör',
      'Sosyal',
      'Pozitif enerji yayar',
    ],
    funFacts: [
      '📅 Tüm planları sen yaparsın',
      '🎵 Playlist uzmanısın',
      '📸 En çok fotoğraf çekilen kişisin',
    ],
    shareText: 'Ben arkadaş grubumun Parti Başlatıcısıyım! 🎉',
  },
  quietPower: {
    name: 'Sessiz Güç 🦉',
    title: 'Sessiz Güç',
    emoji: '🦉',
    tagline: 'Az konuşur, çok anlar',
    description:
      'Grubun sessiz ama güçlü üyesisin. Her sözün değerlidir. Az konuşursun ama konuştuğunda herkes dinler. Derin gözlemcisin.',
    socialRole: 'Gözlemci ve Stratejist',
    strengths: ['Gözlemci', 'Düşünceli', 'Sakin', 'Derin anlayış'],
    funFacts: [
      '👀 Her şeyi fark edersin ama söylemezsin',
      '🤐 "Sen ne düşünüyorsun?" sorusu hep sana gelir',
      '💭 Sözlerin az ama etkili',
    ],
    shareText: 'Ben arkadaş grubumun Sessiz Gücüyüm! 🦉',
  },
  comedian: {
    name: 'Stand-Up Komedyeni 😂',
    title: 'Komedyen',
    emoji: '😂',
    tagline: 'Hayat zor, sen komiksin',
    description:
      'Grubun kahkaha makinesisin! Her durumda espri yapabilir, en gergin anları bile güldürürsün. Mizah senin süper gücün.',
    socialRole: 'Mizah ve Eğlence Uzmanı',
    strengths: [
      'Mizah anlayışı yüksek',
      'Pozitif',
      'Stresi hafifletir',
      'Eğlenceli',
    ],
    funFacts: [
      '🎭 Hayat bir sahne, sen komedyensin',
      '😆 "Gülmekten öldüm" en çok duyduğun cümle',
      '🤡 Ciddi anları bile komik hale getirirsin',
    ],
    shareText: 'Ben arkadaş grubumun Komedyeniyim! 😂',
  },
  therapist: {
    name: 'Terapi Arkadaşı 💭',
    title: 'Terapi Arkadaşı',
    emoji: '💭',
    tagline: 'Bedava terapi, sınırsız empati',
    description:
      'Grubun psikoloğusun. Herkes sana dert anlatır, sen dinler ve anlar. Empatik, anlayışlı ve duygusal zeka canavarısın.',
    socialRole: 'Duygusal Destek Sağlayıcı',
    strengths: ['Empatik', 'İyi dinleyici', 'Anlayışlı', 'Duygusal zekalı'],
    funFacts: [
      '🛋️ Arkadaşların seninle konuşunca rahatlıyor',
      '💚 "Seni dinlemek iyi geldi" en çok duydukların',
      '🎧 3 saatlik telefon görüşmelerin rutin',
    ],
    shareText: 'Ben arkadaş grubumun Terapi Arkadaşıyım! 💭',
  },
  adventurer: {
    name: 'Adrenalin Avcısı 🚀',
    title: 'Adrenalin Avcısı',
    emoji: '🚀',
    tagline: 'Tehlike mi? Hadi gidelim!',
    description:
      'Grubun cesur maceracısısın! Her türlü aktiviteye hazırsın. Bungee jumping, parasailing ne olursa... "Ben varım!" dersin.',
    socialRole: 'Risk Alıcı ve Cesaret Kaynağı',
    strengths: ['Cesur', 'Maceracı', 'Risk alır', 'İlham verici'],
    funFacts: [
      "⛷️ Bucket list'in sonsuz",
      '🎢 "Korkmadım ki" en sevdiğin cümle',
      '📸 En çılgın fotoğraflar sende',
    ],
    shareText: 'Ben arkadaş grubumun Adrenalin Avcısıyım! 🚀',
  },
  peacekeeper: {
    name: 'Barış Elçisi ☮️',
    title: 'Barış Elçisi',
    emoji: '☮️',
    tagline: 'Kavga eden arkadaşları barıştırma ustası',
    description:
      'Grubun diplomatısın. İki arkadaş tartışınca araya giren, herkesi anla yan, dengeyi sağlayan sensin. Çatışma çözücü maestro.',
    socialRole: 'Arabulucu ve Moderatör',
    strengths: ['Arabulucu', 'Tarafsız', 'Dengeli', 'Uzlaşmacı'],
    funFacts: [
      '🕊️ "Hadi barışın" senin repliğin',
      '⚖️ Her iki tarafı da anlarsın',
      '🤝 Grubu bir arada tutan sensin',
    ],
    shareText: 'Ben arkadaş grubumun Barış Elçisiyim! ☮️',
  },
};

// Enneagram 9 Kişilik Tipi Açıklamaları
// Kaynak: Enneagram Institute ve bilimsel kişilik psikolojisi literatürü
const enneagramTypes = {
  type1: {
    name: 'Tip 1 - Reformcu (Mükemmeliyetçi)',
    title: 'Reformcu',
    subtitle: 'İdeal ve Prensipli',
    description:
      'Doğruluk, adalet ve mükemmellik peşinde koşan, ilkeli ve organize kişilerdir. Her şeyin doğru yapılması gerektiğine inanırlar.',
    coreMotivation:
      'Doğru olmak, her şeyi iyileştirmek, hata yapmaktan kaçınmak',
    coreFear: 'Yanlış olmak, bozuk olmak, kötü olmak',
    lightSide: {
      title: 'Işık Yönleri',
      traits:
        'Prensipli, adil, sorumlu, disiplinli, etik değerlere bağlı, iyileştirici, öz-kontrollü, idealist',
      description:
        'İlkeli, organize ve güvenilirdirler. Yüksek standartlara sahip olup işlerini mükemmel yaparlar. Topluma faydalı olmak isterler.',
    },
    shadowSide: {
      title: 'Gölge Yönleri',
      traits:
        'Eleştirel, katı, mükemmeliyetçi, öfkeli (bastırılmış), kendine/başkalarına sert, esnek olmayan',
      description:
        'Aşırı eleştirel olabilir, hem kendilerine hem başkalarına karşı çok sert olabilirler. Hata yapmaktan aşırı korkarlar.',
    },
  },
  type2: {
    name: 'Tip 2 - Yardımsever',
    title: 'Yardımsever',
    subtitle: 'Şefkatli ve Cömert',
    description:
      'Başkalarının ihtiyaçlarını önemseyen, yardımsever ve şefkatli kişilerdir. Sevgi ve takdir görme ihtiyacı duyarlar.',
    coreMotivation: 'Sevilmek, takdir edilmek, başkalarına yardım etmek',
    coreFear: 'Sevilmemek, ihtiyaç duyulmamak, değersiz olmak',
    lightSide: {
      title: 'Işık Yönleri',
      traits:
        'Empatik, cömert, şefkatli, yardımsever, sıcak, destekleyici, fedakar, sevgi dolu',
      description:
        'İçten ve cömert kişilerdir. Başkalarının duygularına duyarlıdırlar ve gerçekten yardım etmekten mutluluk duyarlar.',
    },
    shadowSide: {
      title: 'Gölge Yönleri',
      traits:
        'Manipülatif, sahiplenici, kendi ihtiyaçlarını ihmal eden, onay bağımlısı, sınır koyamayan',
      description:
        'Kendi ihtiyaçlarını görmezden gelebilir, onay için aşırı çaba gösterebilir. Yardım ederken gizli beklentiler olabilir.',
    },
  },
  type3: {
    name: 'Tip 3 - Başarılı (Başaran)',
    title: 'Başarılı',
    subtitle: 'Hırslı ve Uyumlu',
    description:
      'Başarı odaklı, hedef belirleyen ve imaj bilinçli kişilerdir. Başarılarıyla tanınmak isterler.',
    coreMotivation: 'Başarılı olmak, değerli hissetmek, takdir görmek',
    coreFear: 'Değersiz olmak, başarısız olmak, göze çarpmamak',
    lightSide: {
      title: 'Işık Yönleri',
      traits:
        'Başarılı, motive edici, verimli, uyumlu, karizmatik, hedef odaklı, enerjik, ilham verici',
      description:
        'Çok çalışkan ve başarılıdırlar. Başkalarına ilham verirler ve hedeflerine ulaşmak için büyük çaba gösterirler.',
    },
    shadowSide: {
      title: 'Gölge Yönleri',
      traits:
        'İmaj odaklı, rekabetçi, işkolik, sahtelik, duygularını gizleyen, kıskançlık',
      description:
        'İmajlarına aşırı önem verebilir, iş-yaşam dengesini kaybedebilir. Gerçek duygularını bastırarak sadece başarılı görünmeye odaklanabilirler.',
    },
  },
  type4: {
    name: 'Tip 4 - Bireyci (Romantik)',
    title: 'Bireyci',
    subtitle: 'Yaratıcı ve Hassas',
    description:
      'Özgün, yaratıcı ve duygusal olarak derin kişilerdir. Kendilerini ifade etme ve anlaşılma ihtiyacı duyarlar.',
    coreMotivation: 'Özgün olmak, kendini ifade etmek, anlaşılmak',
    coreFear: 'Kimliksiz olmak, anlamsız olmak, özgünlüğünü kaybetmek',
    lightSide: {
      title: 'Işık Yönleri',
      traits:
        'Yaratıcı, özgün, derin, empatik, estetik duyarlı, duygusal olarak dürüst, sanatsal',
      description:
        'Son derece yaratıcı ve özgündürler. Derin duygusal deneyimler yaşar ve sanat yoluyla kendilerini ifade ederler.',
    },
    shadowSide: {
      title: 'Gölge Yönleri',
      traits:
        'Melankolik, dramatik, kıskançlık, kendini kurban hissetme, aşırı duygusal, çekilme',
      description:
        'Melankoliye kayabilir, kendilerini yanlış anlaşılmış hissedebilir. Başkalarının hayatlarını idealleştirip kendi hayatlarından memnuniyetsiz olabilirler.',
    },
  },
  type5: {
    name: 'Tip 5 - Araştırmacı (Gözlemci)',
    title: 'Araştırmacı',
    subtitle: 'Meraklı ve Analitik',
    description:
      'Bilgi toplayan, analitik düşünen ve gözlemci kişilerdir. Bilgi ve yeterlilik arayışındadırlar.',
    coreMotivation: 'Bilgili olmak, yeterli olmak, her şeyi anlamak',
    coreFear: 'Yetersiz olmak, işe yaramaz olmak, boş olmak',
    lightSide: {
      title: 'Işık Yönleri',
      traits:
        'Analitik, bilgili, bağımsız, objektif, inovatif, meraklı, odaklanmış, uzman',
      description:
        'Derin düşünürler ve uzman olurlar. Karmaşık konuları anlama ve sistematik düşünme yeteneğine sahiptirler.',
    },
    shadowSide: {
      title: 'Gölge Yönleri',
      traits:
        'İzole, duygusal mesafeli, cimri (bilgi/zaman/enerji), sosyal beceri eksikliği, aşırı zihinsel',
      description:
        'Sosyal etkileşimden kaçınabilir, duygularını paylaşmakta zorlanabilir. Bilgi biriktirme uğruna yaşamı erteleyebilirler.',
    },
  },
  type6: {
    name: 'Tip 6 - Sadık (Sorgulayıcı)',
    title: 'Sadık',
    subtitle: 'Güvenilir ve Sorumlu',
    description:
      'Güvenlik odaklı, sadık ve sorumlu kişilerdir. Belirsizlikten kaçınır ve güvenilir sistemlere ihtiyaç duyarlar.',
    coreMotivation: 'Güvende olmak, desteklenmek, kesinlik',
    coreFear: 'Destek kaybı, yalnız kalmak, tehdit',
    lightSide: {
      title: 'Işık Yönleri',
      traits:
        'Sadık, güvenilir, sorumlu, cesaretli (fobik-karşıfobik), takım oyuncusu, problem çözücü',
      description:
        'Son derece sadık ve güvenilirdirler. İyi hazırlıklı olur ve riskler için plan yaparlar. Takıma bağlıdırlar.',
    },
    shadowSide: {
      title: 'Gölge Yönleri',
      traits:
        'Endişeli, şüpheci, kararsız, savunmacı, güven sorunları, aşırı düşünme',
      description:
        'Aşırı endişeli olabilir, en kötü senaryoları düşünebilir. Güven sorunları yaşayabilir ve sürekli onay arayabilirler.',
    },
  },
  type7: {
    name: 'Tip 7 - Coşkulu (Maceracı)',
    title: 'Coşkulu',
    subtitle: 'Spontane ve Heyecanlı',
    description:
      'Özgür ruhlu, heyecan arayan ve pozitif kişilerdir. Hayatın tadını çıkarmak ve yeni deneyimler yaşamak isterler.',
    coreMotivation: 'Mutlu olmak, tatmin olmak, özgür olmak',
    coreFear: 'Acı çekmek, mahrum kalmak, sıkılmak',
    lightSide: {
      title: 'Işık Yönleri',
      traits:
        'Neşeli, enerjik, yaratıcı, spontane, çok yönlü, iyimser, esnek, maceracı',
      description:
        'Hayat dolu ve pozitiftirler. Yeni fikirler ve olasılıklarla heyecanlanırlar. Başkalarına enerji verirler.',
    },
    shadowSide: {
      title: 'Gölge Yönleri',
      traits:
        'Kaçış eğilimi, yüzeysel, disiplinsiz, bağlanma sorunu, acıdan kaçma, aşırı tüketim',
      description:
        'Olumsuz duygulardan kaçabilir, sorumluluktan uzak durabilir. Sürekli yeni heyecan arayışı derinleşmeyi engelleyebilir.',
    },
  },
  type8: {
    name: 'Tip 8 - Meydan Okuyan (Lider)',
    title: 'Meydan Okuyan',
    subtitle: 'Güçlü ve Koruyucu',
    description:
      'Güçlü, kararlı ve kontrolcü kişilerdir. Adaleti savunur ve zayıfları korumak isterler.',
    coreMotivation: 'Güçlü olmak, kendini korumak, kontrolü elinde tutmak',
    coreFear: 'Zayıf olmak, kontrol edilmek, zarar görmek',
    lightSide: {
      title: 'Işık Yönleri',
      traits:
        'Güçlü, koruyucu, adil, lider, kararlı, cesaretli, kendine güvenen, doğrudan',
      description:
        'Doğal liderlerdir. Adaleti savunur ve zayıfları korurlar. Kararlı ve cesurdurlar.',
    },
    shadowSide: {
      title: 'Gölge Yönleri',
      traits:
        'Agresif, kontrolcü, baskın, zaaf gösterememe, öfke, güvensizlik, kırıcı',
      description:
        'Aşırı kontrolcü ve dominant olabilir. Zayıflık göstermekten korkar ve öfke sorunları yaşayabilir.',
    },
  },
  type9: {
    name: 'Tip 9 - Barışçı (Arabulucu)',
    title: 'Barışçı',
    subtitle: 'Uyumlu ve Destekleyici',
    description:
      'Huzur ve uyum arayan, rahat ve kabul edici kişilerdir. Çatışmadan kaçınır ve dengeyi önemserler.',
    coreMotivation: 'İç huzur, uyum, çatışmadan kaçınma',
    coreFear: 'Kayıp, ayrılık, çatışma, bağlantının kopması',
    lightSide: {
      title: 'Işık Yönleri',
      traits:
        'Barışçıl, kabul edici, sabırlı, destekleyici, arabulucu, rahat, empatik, uzlaşmacı',
      description:
        'Sakin ve barışçıldırlar. İyi dinleyici ve arabulucudurlar. Başkalarının bakış açılarını anlayabilirler.',
    },
    shadowSide: {
      title: 'Gölge Yönleri',
      traits:
        'Pasif, kararsız, erteleyici, kendi ihtiyaçlarını görmezden gelen, çatışmadan kaçan, inatçı',
      description:
        'Çatışmadan kaçmak için kendi ihtiyaçlarını ihmal edebilir. Karar vermekte zorlanır ve önemli konuları erteleyebilir.',
    },
  },
};

// Big Five Kişilik Boyutları Açıklamaları
const bigFiveTraits = {
  openness: {
    high: {
      title: 'Yüksek Açıklık',
      description:
        'Yaratıcı, meraklı ve yeni deneyimlere açıksınız. Sanat, kültür ve felsefe ilginizi çeker.',
      traits: 'Hayal gücü kuvvetli, yenilikçi, estetik duyarlılık yüksek',
    },
    medium: {
      title: 'Orta Açıklık',
      description:
        'Dengeli bir yaklaşıma sahipsiniz. Yeniliklerle geleneksel değerleri dengeleyebilirsiniz.',
      traits: 'Esnek, pratik, uyumlu',
    },
    low: {
      title: 'Düşük Açıklık',
      description:
        'Geleneksel, pratik ve somut düşünen birisiniz. Bilinen ve test edilmiş yöntemleri tercih edersiniz.',
      traits: 'Gelenekçi, gerçekçi, pratik',
    },
  },
  conscientiousness: {
    high: {
      title: 'Yüksek Sorumluluk',
      description:
        'Düzenli, disiplinli ve hedef odaklısınız. Görevlerinizi eksiksiz tamamlarsınız.',
      traits: 'Organize, güvenilir, planlı, azimli',
    },
    medium: {
      title: 'Orta Sorumluluk',
      description:
        'Duruma göre esnek davranabilirsiniz. Gerektiğinde organize, gerektiğinde spontane olabilirsiniz.',
      traits: 'Dengeli, uyumlu, makul',
    },
    low: {
      title: 'Düşük Sorumluluk',
      description:
        'Spontane, esnek ve rahat bir yapınız var. Katı kurallara uymakta zorlanabilirsiniz.',
      traits: 'Esnek, rahat, spontane',
    },
  },
  extraversion: {
    high: {
      title: 'Yüksek Dışa Dönüklük',
      description:
        'Sosyal, enerjik ve konuşkan birisiniz. İnsanlarla vakit geçirmekten keyif alırsınız.',
      traits: 'Sosyal, canlı, heyecanlı, arkadaş canlısı',
    },
    medium: {
      title: 'Orta Dışa Dönüklük (Ambivert)',
      description:
        'Hem içe hem dışa dönük özelliklere sahipsiniz. Duruma göre uyum sağlayabilirsiniz.',
      traits: 'Dengeli, uyumlu, esnek',
    },
    low: {
      title: 'Düşük Dışa Dönüklük (İçe Dönük)',
      description:
        'Sakin, düşünceli ve yalnız vakit geçirmekten hoşlanırsınız. Derin ilişkiler kurarsınız.',
      traits: 'Sessiz, düşünceli, bağımsız, dikkatli',
    },
  },
  agreeableness: {
    high: {
      title: 'Yüksek Uyumluluk',
      description:
        'Empatik, yardımsever ve işbirlikçisiniz. İnsanların iyiliğine inanırsınız.',
      traits: 'Empatik, güvenilir, nazik, fedakar',
    },
    medium: {
      title: 'Orta Uyumluluk',
      description:
        'Başkalarını düşünürken kendi çıkarlarınızı da koruyabilirsiniz.',
      traits: 'Dengeli, adil, pratik',
    },
    low: {
      title: 'Düşük Uyumluluk',
      description:
        'Rekabetçi, bağımsız ve eleştirel düşünürüsünüz. Kendi görüşlerinizi savunursunuz.',
      traits: 'Bağımsız, analitik, rekabetçi',
    },
  },
  neuroticism: {
    high: {
      title: 'Yüksek Nevrotiklik',
      description:
        'Duygusal, hassas ve tepkiselsiniz. Stresi yoğun yaşayabilirsiniz.',
      traits: 'Hassas, duygusal, endişeli, tepkisel',
      tips: 'Stres yönetimi teknikleri, meditasyon ve düzenli egzersiz faydalı olabilir.',
    },
    medium: {
      title: 'Orta Duygusal Denge',
      description:
        'Genellikle sakin kalabilirsiniz ama bazen strese kapılabilirsiniz.',
      traits: 'Dengeli, normal tepkiler, uyumlu',
    },
    low: {
      title: 'Düşük Nevrotiklik (Yüksek Duygusal Denge)',
      description:
        'Sakin, dengeli ve strese karşı dayanıklısınız. Duygusal olarak istikrarlısınız.',
      traits: 'Sakin, dengeli, dayanıklı, rahat',
    },
  },
};

// Helper fonksiyon: i18n destekli storm personality testi oluştur
const getStormPersonalityTest = (
  t: (_key: string) => string
): PsychologicalTest => ({
  id: 'storm-personality',
  title: t('psychTests.tests.stormPersonality.title'),
  description: t('psychTests.tests.stormPersonality.description'),
  icon: t('psychTests.tests.stormPersonality.icon'),
  resultType: 'kokoloji',
  totalQuestions: 4,
  questions: [
    {
      text: t('psychTests.tests.stormPersonality.questions.q1.text'),
      answers: [
        {
          value: 'hope',
          text: t(
            'psychTests.tests.stormPersonality.questions.q1.answers.hope.text'
          ),
          meaning: t(
            'psychTests.tests.stormPersonality.questions.q1.answers.hope.meaning'
          ),
        },
        {
          value: 'fear',
          text: t(
            'psychTests.tests.stormPersonality.questions.q1.answers.fear.text'
          ),
          meaning: t(
            'psychTests.tests.stormPersonality.questions.q1.answers.fear.meaning'
          ),
        },
        {
          value: 'plan',
          text: t(
            'psychTests.tests.stormPersonality.questions.q1.answers.plan.text'
          ),
          meaning: t(
            'psychTests.tests.stormPersonality.questions.q1.answers.plan.meaning'
          ),
        },
      ],
    },
    {
      text: t('psychTests.tests.stormPersonality.questions.q2.text'),
      answers: [
        {
          value: 'lead',
          text: t(
            'psychTests.tests.stormPersonality.questions.q2.answers.lead.text'
          ),
          meaning: t(
            'psychTests.tests.stormPersonality.questions.q2.answers.lead.meaning'
          ),
        },
        {
          value: 'support',
          text: t(
            'psychTests.tests.stormPersonality.questions.q2.answers.support.text'
          ),
          meaning: t(
            'psychTests.tests.stormPersonality.questions.q2.answers.support.meaning'
          ),
        },
        {
          value: 'retreat',
          text: t(
            'psychTests.tests.stormPersonality.questions.q2.answers.retreat.text'
          ),
          meaning: t(
            'psychTests.tests.stormPersonality.questions.q2.answers.retreat.meaning'
          ),
        },
      ],
    },
    {
      text: t('psychTests.tests.stormPersonality.questions.q3.text'),
      answers: [
        {
          value: 'awe',
          text: t(
            'psychTests.tests.stormPersonality.questions.q3.answers.awe.text'
          ),
          meaning: t(
            'psychTests.tests.stormPersonality.questions.q3.answers.awe.meaning'
          ),
        },
        {
          value: 'fear',
          text: t(
            'psychTests.tests.stormPersonality.questions.q3.answers.fear.text'
          ),
          meaning: t(
            'psychTests.tests.stormPersonality.questions.q3.answers.fear.meaning'
          ),
        },
        {
          value: 'focus',
          text: t(
            'psychTests.tests.stormPersonality.questions.q3.answers.focus.text'
          ),
          meaning: t(
            'psychTests.tests.stormPersonality.questions.q3.answers.focus.meaning'
          ),
        },
      ],
    },
    {
      text: t('psychTests.tests.stormPersonality.questions.q4.text'),
      answers: [
        {
          value: 'thankful',
          text: t(
            'psychTests.tests.stormPersonality.questions.q4.answers.thankful.text'
          ),
          meaning: t(
            'psychTests.tests.stormPersonality.questions.q4.answers.thankful.meaning'
          ),
        },
        {
          value: 'analyze',
          text: t(
            'psychTests.tests.stormPersonality.questions.q4.answers.analyze.text'
          ),
          meaning: t(
            'psychTests.tests.stormPersonality.questions.q4.answers.analyze.meaning'
          ),
        },
        {
          value: 'moveOn',
          text: t(
            'psychTests.tests.stormPersonality.questions.q4.answers.moveOn.text'
          ),
          meaning: t(
            'psychTests.tests.stormPersonality.questions.q4.answers.moveOn.meaning'
          ),
        },
      ],
    },
  ],
});

// Helper fonksiyon: i18n destekli MBTI testi oluştur
const getMBTITest = (t: (_key: string) => string): PsychologicalTest => ({
  id: 'mbti',
  title: t('psychTests.tests.mbti.title'),
  description: t('psychTests.tests.mbti.description'),
  icon: t('psychTests.tests.mbti.icon'),
  resultType: 'mbti',
  totalQuestions: 20,
  questions: Array.from({ length: 20 }, (_, i) => {
    const qKey = `q${i + 1}`;
    const baseKey = `psychTests.tests.mbti.questions.${qKey}`;

    // Her sorunun answer key'lerini orijinal testteki sıraya göre belirle
    const answerMapping: { [key: number]: string[] } = {
      1: ['e', 'i'],
      2: ['e', 'i'], // Sosyal, Proje
      3: ['s', 'n'],
      4: ['s', 'n'], // Karar, Problem
      5: ['t', 'f'],
      6: ['t', 'f'], // Güven, Çatışma
      7: ['j', 'p'],
      8: ['j', 'p'], // Organize, Teslim
      9: ['s', 'n'],
      10: ['s', 'n'], // Öğrenme, Gelecek
      11: ['t', 'f'],
      12: ['t', 'f'], // Sorun, Takdir
      13: ['e', 'i'],
      14: ['e', 'i'], // Sosyal etkinlik, Enerji
      15: ['s', 'n'],
      16: ['s', 'n'], // Detay, Yaratıcılık
      17: ['j', 'p'],
      18: ['j', 'p'], // Değişim, Rutin
      19: ['f', 't'],
      20: ['t', 'f'], // Duygu anlama, Haklı/Mutlu
    };

    const answerKeys = answerMapping[i + 1] || ['e', 'i'];

    return {
      text: t(`${baseKey}.text`),
      answers: answerKeys.map(key => ({
        value: key.toUpperCase(),
        text: t(`${baseKey}.answers.${key}.text`),
        meaning: t(`${baseKey}.answers.${key}.meaning`),
        score: 1,
      })),
    };
  }),
});

// Helper fonksiyon: i18n destekli Kişilik Analizi (Kokoloji) testi oluştur
const getPersonalityTest = (t: (_key: string) => string): PsychologicalTest => {
  const answerMapping = [
    ['open', 'closed', 'halfOpen'],
    ['straight', 'curved', 'uphill'],
    ['jump', 'walkAround', 'stepIn'],
  ];

  return {
    id: 'personality',
    title: t('psychTests.tests.personality.title'),
    description: t('psychTests.tests.personality.description'),
    icon: t('psychTests.tests.personality.icon'),
    resultType: 'kokoloji',
    totalQuestions: 3,
    questions: answerMapping.map((answers, i) => {
      const qKey = `q${i + 1}`;
      const baseKey = `psychTests.tests.personality.questions.${qKey}`;

      return {
        text: t(`${baseKey}.text`),
        answers: answers.map(key => ({
          value: key,
          text: t(`${baseKey}.answers.${key}.text`),
          meaning: t(`${baseKey}.answers.${key}.meaning`),
        })),
      };
    }),
  };
};

// Helper fonksiyon: i18n destekli Big Five testi oluştur
const getBigFiveTest = (t: (_key: string) => string): PsychologicalTest => {
  // Big Five boyutları: O, C, E, A, N (her biri 5 soru)
  const dimensions = ['O', 'C', 'E', 'A', 'N'];
  const meanings = {
    O: ['Yüksek açıklık', 'Orta açıklık', 'Düşük açıklık'],
    C: ['Yüksek sorumluluk', 'Orta sorumluluk', 'Düşük sorumluluk'],
    E: ['Yüksek dışa dönüklük', 'Orta dışa dönüklük', 'Düşük dışa dönüklük'],
    A: ['Yüksek uyumluluk', 'Orta uyumluluk', 'Düşük uyumluluk'],
    N: ['Yüksek nevrotiklik', 'Orta nevrotiklik', 'Düşük nevrotiklik'],
  };

  const questions = Array.from({ length: 25 }, (_, i) => {
    const qNum = i + 1;
    const dimIndex = Math.floor(i / 5);
    const dimension = (dimensions[dimIndex] || 'O') as keyof typeof meanings;
    const dimMeanings = meanings[dimension];

    return {
      text: t(`psychTests.tests.bigFive.questions.q${qNum}`),
      answers: [
        {
          value: `${dimension}5`,
          text: t('psychTests.tests.bigFive.answers.stronglyAgree'),
          meaning: dimMeanings[0],
          score: 5,
        },
        {
          value: `${dimension}4`,
          text: t('psychTests.tests.bigFive.answers.agree'),
          meaning: dimMeanings[0],
          score: 4,
        },
        {
          value: `${dimension}3`,
          text: t('psychTests.tests.bigFive.answers.neutral'),
          meaning: dimMeanings[1],
          score: 3,
        },
        {
          value: `${dimension}2`,
          text: t('psychTests.tests.bigFive.answers.disagree'),
          meaning: dimMeanings[2],
          score: 2,
        },
        {
          value: `${dimension}1`,
          text: t('psychTests.tests.bigFive.answers.stronglyDisagree'),
          meaning: dimMeanings[2],
          score: 1,
        },
      ],
    };
  });

  return {
    id: 'big-five',
    title: t('psychTests.tests.bigFive.title'),
    description: t('psychTests.tests.bigFive.description'),
    icon: t('psychTests.tests.bigFive.icon'),
    resultType: 'big-five',
    totalQuestions: 25,
    questions: questions as TestQuestion[],
  };
};

// Helper fonksiyon: i18n destekli Enneagram testi oluştur
const getEnneagramTest = (t: (_key: string) => string): PsychologicalTest => {
  // 9 tip × 3 soru = 27 soru
  const typeMapping = [
    'T1',
    'T1',
    'T1',
    'T2',
    'T2',
    'T2',
    'T3',
    'T3',
    'T3',
    'T4',
    'T4',
    'T4',
    'T5',
    'T5',
    'T5',
    'T6',
    'T6',
    'T6',
    'T7',
    'T7',
    'T7',
    'T8',
    'T8',
    'T8',
    'T9',
    'T9',
    'T9',
  ];

  const typeNames = {
    T1: 'Tip 1 - Reformcu',
    T2: 'Tip 2 - Yardımsever',
    T3: 'Tip 3 - Başarılı',
    T4: 'Tip 4 - Bireyci',
    T5: 'Tip 5 - Araştırmacı',
    T6: 'Tip 6 - Sadık',
    T7: 'Tip 7 - Coşkulu',
    T8: 'Tip 8 - Lider',
    T9: 'Tip 9 - Barışçı',
  };

  const questions = Array.from({ length: 27 }, (_, i) => {
    const qNum = i + 1;
    const typeCode = typeMapping[i];

    return {
      text: t(`psychTests.tests.enneagram.questions.q${qNum}`),
      answers: [
        {
          value: `${typeCode}-5`,
          text: t('psychTests.tests.enneagram.answers.stronglyAgree'),
          meaning: typeNames[typeCode as keyof typeof typeNames],
          score: 5,
        },
        {
          value: `${typeCode}-3`,
          text: t('psychTests.tests.enneagram.answers.agree'),
          meaning: typeNames[typeCode as keyof typeof typeNames],
          score: 3,
        },
        {
          value: `${typeCode}-1`,
          text: t('psychTests.tests.enneagram.answers.disagree'),
          meaning: 'Diğer tipler',
          score: 1,
        },
      ],
    };
  });

  return {
    id: 'enneagram',
    title: t('psychTests.tests.enneagram.title'),
    description: t('psychTests.tests.enneagram.description'),
    icon: t('psychTests.tests.enneagram.icon'),
    resultType: 'enneagram',
    totalQuestions: 27,
    questions: questions as TestQuestion[],
  };
};

// Helper fonksiyon: i18n destekli Arkadaş Enerjisi testi oluştur
const getFriendEnergyTest = (
  t: (_key: string) => string
): PsychologicalTest => {
  const answerMapping = [
    ['wiseMentor', 'therapist', 'comedian', 'momFriend'],
    ['dramaQueen', 'comedian', 'quietPower', 'peacekeeper'],
    ['spontaneousExplorer', 'partyStarter', 'wiseMentor', 'momFriend'],
    ['peacekeeper', 'dramaQueen', 'therapist', 'quietPower'],
    ['comedian', 'wiseMentor', 'adventurer', 'momFriend'],
    ['adventurer', 'partyStarter', 'quietPower', 'therapist'],
    ['wiseMentor', 'comedian', 'momFriend', 'peacekeeper'],
    ['dramaQueen', 'quietPower', 'partyStarter', 'comedian'],
    ['spontaneousExplorer', 'momFriend', 'partyStarter', 'quietPower'],
    ['wiseMentor', 'therapist', 'adventurer', 'comedian'],
  ];

  const questions = Array.from({ length: 10 }, (_, i) => {
    const qNum = i + 1;
    const baseKey = `psychTests.tests.friendEnergy.questions.q${qNum}`;
    const answerKeys = answerMapping[i] || [];

    return {
      text: t(`${baseKey}.text`),
      answers: answerKeys.map(key => ({
        value: key,
        text: t(`${baseKey}.answers.${key}.text`),
        meaning: t(`${baseKey}.answers.${key}.meaning`),
      })),
    };
  });

  return {
    id: 'friend-energy',
    title: t('psychTests.tests.friendEnergy.title'),
    description: t('psychTests.tests.friendEnergy.description'),
    icon: t('psychTests.tests.friendEnergy.icon'),
    resultType: 'friend-energy',
    totalQuestions: 10,
    questions: questions as TestQuestion[],
  };
};

// Helper fonksiyon: i18n destekli Aşk Enerjisi testi oluştur
const getLoveVibrationTest = (
  t: (_key: string) => string
): PsychologicalTest => {
  const energyOptions = ['venus', 'mars', 'mercury', 'moon'];

  const questions = Array.from({ length: 7 }, (_, i) => {
    const qNum = i + 1;
    const baseKey = `psychTests.tests.loveVibration.questions.q${qNum}`;

    return {
      text: t(`${baseKey}.text`),
      answers: energyOptions.map(key => ({
        value: key,
        text: t(`${baseKey}.answers.${key}.text`),
        meaning: t(`${baseKey}.answers.${key}.meaning`),
      })),
    };
  });

  return {
    id: 'love-vibration',
    title: t('psychTests.tests.loveVibration.title'),
    description: t('psychTests.tests.loveVibration.description'),
    icon: t('psychTests.tests.loveVibration.icon'),
    resultType: 'love-vibration',
    totalQuestions: 7,
    questions: questions as TestQuestion[],
  };
};

// Helper fonksiyon: i18n destekli Stres Düzeyi testi oluştur
const getStressTest = (t: (_key: string) => string): PsychologicalTest => {
  const stressLevels = [
    { value: '0', meaning: 'Düşük stres', score: 0 },
    { value: '1', meaning: 'Orta stres', score: 1 },
    { value: '2', meaning: 'Yüksek stres', score: 2 },
    { value: '3', meaning: 'Çok yüksek stres', score: 3 },
  ];

  const questions = Array.from({ length: 15 }, (_, i) => {
    const qNum = i + 1;

    return {
      text: t(`psychTests.tests.stress.questions.q${qNum}`),
      answers: stressLevels.map((level, idx) => ({
        value: level.value,
        text: t(
          `psychTests.tests.stress.answers.${['notAtAll', 'somewhat', 'considerably', 'veryMuch'][idx]}`
        ),
        meaning: level.meaning,
        score: level.score,
      })),
    };
  });

  return {
    id: 'stress',
    title: t('psychTests.tests.stress.title'),
    description: t('psychTests.tests.stress.description'),
    icon: t('psychTests.tests.stress.icon'),
    resultType: 'stress',
    totalQuestions: 15,
    questions: questions as TestQuestion[],
  };
};

// İsim Enerjine Göre Tarot Kartın - i18n destekli helper fonksiyon
const getNameTarotTest = (t: (_key: string) => string): PsychologicalTest => ({
  id: 'name-tarot',
  title: t('psychTests.tests.nameTarot.title'),
  description: t('psychTests.tests.nameTarot.description'),
  icon: t('psychTests.tests.nameTarot.icon'),
  resultType: 'numerology-tarot',
  totalQuestions: 1,
  questions: [
    {
      text: t('psychTests.tests.nameTarot.inputTitle'),
      answers: [], // İsim girişi için boş
    },
  ],
});

// Ana fonksiyon: i18n destekli tüm testleri döndürür
export const getPsychologicalTests = (
  t: (_key: string) => string
): PsychologicalTest[] => [
  // 1. Deniz Fırtınası Testi - i18n destekli
  getStormPersonalityTest(t),

  // 2. MBTI Kişilik Testi - i18n destekli
  getMBTITest(t),

  // 3. Kişilik Analizi (Kokoloji) - i18n destekli
  getPersonalityTest(t),

  // 4. Big Five (OCEAN) - i18n destekli
  getBigFiveTest(t),

  // 5. Enneagram - i18n destekli
  getEnneagramTest(t),

  // 6. Arkadaş Grubundaki Enerjin - i18n destekli
  getFriendEnergyTest(t),

  // 7. Aşk Enerjin (Love Vibration) - i18n destekli
  getLoveVibrationTest(t),

  // 8. Stres Düzeyi Testi - i18n destekli
  getStressTest(t),

  // 9. İsim Enerjine Göre Tarot Kartın - i18n destekli
  getNameTarotTest(t),
];

// Test sonuçlarını hesaplama fonksiyonları
export const calculateMBTIResult = (answers: string[]): string => {
  let E = 0,
    I = 0,
    S = 0,
    N = 0,
    T = 0,
    F = 0,
    J = 0,
    P = 0;

  answers.forEach(answer => {
    switch (answer) {
      case 'E':
        E++;
        break;
      case 'I':
        I++;
        break;
      case 'S':
        S++;
        break;
      case 'N':
        N++;
        break;
      case 'T':
        T++;
        break;
      case 'F':
        F++;
        break;
      case 'J':
        J++;
        break;
      case 'P':
        P++;
        break;
    }
  });

  const type = [
    E > I ? 'E' : 'I',
    S > N ? 'S' : 'N',
    T > F ? 'T' : 'F',
    J > P ? 'J' : 'P',
  ].join('');

  return type;
};

// Aşk Enerjisi (Love Vibration) hesaplama fonksiyonu
export const calculateLoveVibrationResult = (answers: string[]): any => {
  const counts: Record<string, number> = {
    venus: 0,
    mars: 0,
    mercury: 0,
    moon: 0,
  };

  // Her gezegen enerjisini say
  answers.forEach(answer => {
    if (counts[answer] !== undefined) {
      counts[answer]++;
    }
  });

  const total = answers.length;
  const percentages = {
    venus: Math.round(((counts.venus || 0) / total) * 100),
    mars: Math.round(((counts.mars || 0) / total) * 100),
    mercury: Math.round(((counts.mercury || 0) / total) * 100),
    moon: Math.round(((counts.moon || 0) / total) * 100),
  };

  // Dominant enerjiyi bul
  const sortedEnergies = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const firstEnergy = sortedEnergies[0];
  const secondEnergy = sortedEnergies.length > 1 ? sortedEnergies[1] : null;

  let profileKey: keyof typeof loveVibrationProfiles = 'venusHarmony';

  // Profil belirleme algoritması
  if (firstEnergy && firstEnergy[1] >= 4) {
    // Tek dominant enerji
    switch (firstEnergy[0]) {
      case 'venus':
        profileKey = 'venusHarmony';
        break;
      case 'mars':
        profileKey = 'marsPassion';
        break;
      case 'mercury':
        profileKey = 'mercuryCommunication';
        break;
      case 'moon':
        profileKey = 'moonIntuition';
        break;
    }
  } else if (
    secondEnergy &&
    firstEnergy &&
    Math.abs(firstEnergy[1] - secondEnergy[1]) <= 1
  ) {
    // İki enerji dengeli - karma profil
    const combo = [firstEnergy[0], secondEnergy[0]].sort().join('-');

    if (combo.includes('venus') && combo.includes('mars')) {
      profileKey = 'venusMarsMix';
    } else if (combo.includes('venus') && combo.includes('mercury')) {
      profileKey = 'mercuryVenusMix';
    } else if (combo.includes('mars') && combo.includes('mercury')) {
      profileKey = 'marsMercuryMix';
    } else if (
      (counts.venus || 0) >= 2 &&
      (counts.mars || 0) >= 2 &&
      (counts.mercury || 0) >= 2
    ) {
      profileKey = 'tripleHarmony';
    }
  } else if (
    (counts.venus || 0) >= 2 &&
    (counts.mars || 0) >= 2 &&
    (counts.mercury || 0) >= 2
  ) {
    // Üçlü denge
    profileKey = 'tripleHarmony';
  }

  return {
    profileKey,
    counts,
    percentages,
    dominantPlanet: firstEnergy ? firstEnergy[0] : 'venus',
    ...loveVibrationProfiles[profileKey],
  };
};

// İsim Enerjisi - Numeroloji Hesaplama Fonksiyonu
// Pythagoras numeroloji sistemi
export const calculateNameTarotResult = (
  name: string,
  t: (_key: string) => string
): any => {
  // Harf-sayı eşleştirme tablosu
  const letterValues: Record<string, number> = {
    A: 1,
    J: 1,
    S: 1,
    B: 2,
    K: 2,
    T: 2,
    C: 3,
    L: 3,
    U: 3,
    D: 4,
    M: 4,
    V: 4,
    E: 5,
    N: 5,
    W: 5,
    F: 6,
    O: 6,
    X: 6,
    G: 7,
    P: 7,
    Y: 7,
    H: 8,
    Q: 8,
    Z: 8,
    I: 9,
    R: 9,
    // Türkçe karakterler
    Ç: 3,
    Ş: 1,
    Ğ: 7,
    Ü: 3,
    Ö: 6,
    İ: 9,
  };

  // İsmi büyük harfe çevir ve boşlukları kaldır
  const cleanName = name
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/[^A-ZÇŞĞÜÖİ]/g, '');

  // Her harfin değerini topla
  let total = 0;
  const breakdown: Array<{ letter: string; value: number }> = [];

  for (const letter of cleanName) {
    const value = letterValues[letter] || 0;
    total += value;
    if (value > 0) {
      breakdown.push({ letter, value });
    }
  }

  // Tek haneye indirgeme (master numbers 11 ve 22 korunur)
  let finalNumber = total;
  const reductionSteps = [total];

  while (finalNumber > 9 && finalNumber !== 11 && finalNumber !== 22) {
    const digits = finalNumber.toString().split('').map(Number);
    finalNumber = digits.reduce((sum, digit) => sum + digit, 0);
    reductionSteps.push(finalNumber);
  }

  // Tarot kartlarını i18n ile al
  const nameTarotCards = getNameTarotCards(t);

  // Tarot kartını getir
  const tarotCard =
    nameTarotCards[finalNumber as keyof typeof nameTarotCards] ||
    nameTarotCards[1];

  return {
    name: cleanName,
    total,
    finalNumber,
    tarotCard,
    breakdown,
    reductionSteps,
  };
};

// Stres Düzeyi hesaplama fonksiyonu
// DASS21 stres ölçeğine dayalı (0-60 puan arası)
export const calculateStressResult = (answers: string[]): any => {
  // Cevap değerlerini sayıya çevir ve topla
  const totalScore = answers.reduce((sum, answer) => {
    const score = parseInt(answer, 10) || 0;
    return sum + score;
  }, 0);

  // Stres seviyesini belirle
  let profileKey: keyof typeof stressProfiles = 'low';

  if (totalScore >= 46) {
    profileKey = 'veryHigh';
  } else if (totalScore >= 31) {
    profileKey = 'high';
  } else if (totalScore >= 16) {
    profileKey = 'moderate';
  } else {
    profileKey = 'low';
  }

  return {
    totalScore,
    profileKey,
    ...stressProfiles[profileKey],
    maxScore: 60, // 15 soru x 4 (maksimum puan)
    percentage: Math.round((totalScore / 60) * 100),
  };
};

// Arkadaş Grubu Enerjisi hesaplama fonksiyonu
export const calculateFriendEnergyResult = (answers: string[]): any => {
  const counts: Record<string, number> = {
    wiseMentor: 0,
    dramaQueen: 0,
    spontaneousExplorer: 0,
    momFriend: 0,
    partyStarter: 0,
    quietPower: 0,
    comedian: 0,
    therapist: 0,
    adventurer: 0,
    peacekeeper: 0,
  };

  // Her cevabı say
  answers.forEach(answer => {
    if (counts[answer] !== undefined) {
      counts[answer]++;
    }
  });

  // En yüksek skoru bul
  const keys = Object.keys(counts);
  const dominantRole =
    keys.length > 0
      ? keys.reduce((a, b) => ((counts[a] || 0) > (counts[b] || 0) ? a : b))
      : 'wiseMentor';

  // İkinci en yüksek (ikincil enerji)
  const sortedRoles = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const secondHighestRole = sortedRoles.length > 1 ? sortedRoles[1] : null;
  const secondaryRole = secondHighestRole ? secondHighestRole[0] : null;

  const roleKey = dominantRole as keyof typeof friendEnergyRoles;

  return {
    dominantRole,
    secondaryRole,
    counts,
    totalScore: counts[dominantRole] || 0,
    ...friendEnergyRoles[roleKey],
  };
};

// Enneagram sonuçlarını hesaplama fonksiyonu
export const calculateEnneagramResult = (answers: string[]): any => {
  const scores: Record<string, number> = {
    T1: 0,
    T2: 0,
    T3: 0,
    T4: 0,
    T5: 0,
    T6: 0,
    T7: 0,
    T8: 0,
    T9: 0,
  };

  // Her cevabın skorunu ilgili tipe ekle
  answers.forEach(answer => {
    const type = answer.substring(0, 2); // T1, T2, vb.
    const scorePart = answer.split('-')[1];
    if (scorePart) {
      const score = parseInt(scorePart); // 1, 3, veya 5
      if (scores[type] !== undefined && !isNaN(score)) {
        scores[type] += score;
      }
    }
  });

  // En yüksek skoru bul
  let dominantType = 'type1';
  let maxScore = 0;

  Object.entries(scores).forEach(([type, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantType = type.toLowerCase().replace('t', 'type');
    }
  });

  // İkinci en yüksek tip (wing - kanat)
  const sortedScores = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const secondHighest = sortedScores.length > 1 ? sortedScores[1] : null;
  const wingType = secondHighest
    ? secondHighest[0].toLowerCase().replace('t', 'type')
    : null;

  return {
    dominantType,
    wingType,
    scores,
    maxScore,
    ...enneagramTypes[dominantType as keyof typeof enneagramTypes],
  };
};

// Big Five sonuçlarını hesaplama fonksiyonu
export const calculateBigFiveResult = (answers: string[]): any => {
  let O = 0,
    C = 0,
    E = 0,
    A = 0,
    N = 0;

  answers.forEach(answer => {
    const score = parseInt(answer.charAt(1));
    const dimension = answer.charAt(0);

    switch (dimension) {
      case 'O':
        O += score;
        break;
      case 'C':
        C += score;
        break;
      case 'E':
        E += score;
        break;
      case 'A':
        A += score;
        break;
      case 'N':
        N += score;
        break;
    }
  });

  // Her boyut için seviye belirleme (5 soru × 5 puan = max 25)
  const getLevel = (score: number): 'high' | 'medium' | 'low' => {
    if (score >= 20) {
      return 'high';
    }
    if (score >= 13) {
      return 'medium';
    }
    return 'low';
  };

  // Skorları 100 üzerinden hesapla (25'ten 100'e çevirmek için x4)
  const O100 = O * 4;
  const C100 = C * 4;
  const E100 = E * 4;
  const A100 = A * 4;
  const N100 = N * 4;

  // Kişiselleştirilmiş ipuçları oluştur
  const generatePersonalizedTips = () => {
    const tips: string[] = [];
    const s = {
      O: O100,
      C: C100,
      E: E100,
      A: A100,
      N: N100,
    };

    if (s.O >= 67) {
      tips.push(
        'Açıklığın yüksek: yaratıcı projelerde daha çok yer al, öğrenme hedefleri koy.'
      );
    }

    if (s.C < 34) {
      tips.push(
        'Sorumluluğun düşük: küçük görevleri zaman kutuları ile planla, ertelemeyi azalt.'
      );
    }

    if (s.E < 34) {
      tips.push(
        'Dışa dönüklüğün düşük: sosyal enerjini koruyarak küçük ve anlamlı buluşmalar planla.'
      );
    }

    if (s.A < 34) {
      tips.push(
        'Uyumluluğun düşük: geri bildirimleri yargısız dinleme pratikleri yap.'
      );
    }

    if (s.N >= 67) {
      tips.push(
        'Nevrotikliğin yüksek: nefes/meditasyon rutinleri oluştur, uyku hijyenine dikkat et.'
      );
    }

    if (!tips.length) {
      tips.push(
        'Dengeli bir profil: güçlü yanlarını pekiştir, gelişim alanlarını mikro hedeflerle besle.'
      );
    }

    return tips.join(' ');
  };

  const personalizedTips = generatePersonalizedTips();

  return {
    openness: {
      score: O,
      score100: O100,
      level: getLevel(O),
      ...bigFiveTraits.openness[getLevel(O)],
    },
    conscientiousness: {
      score: C,
      score100: C100,
      level: getLevel(C),
      ...bigFiveTraits.conscientiousness[getLevel(C)],
    },
    extraversion: {
      score: E,
      score100: E100,
      level: getLevel(E),
      ...bigFiveTraits.extraversion[getLevel(E)],
    },
    agreeableness: {
      score: A,
      score100: A100,
      level: getLevel(A),
      ...bigFiveTraits.agreeableness[getLevel(A)],
    },
    neuroticism: {
      score: N,
      score100: N100,
      level: getLevel(N),
      ...bigFiveTraits.neuroticism[getLevel(N)],
    },
    personalizedTips,
  };
};

// Test sonuç yorumları
export const getTestResult = (testId: string, answers: string[]): any => {
  switch (testId) {
    case 'mbti':
      const mbtiType = calculateMBTIResult(answers);
      return {
        type: mbtiType,
        ...mbtiTypes[mbtiType as keyof typeof mbtiTypes],
      };

    case 'big-five':
      return calculateBigFiveResult(answers);

    case 'enneagram':
      return calculateEnneagramResult(answers);

    case 'friend-energy':
      return calculateFriendEnergyResult(answers);

    case 'love-vibration':
      return calculateLoveVibrationResult(answers);

    case 'stress':
      return calculateStressResult(answers);

    default:
      return null;
  }
};

// Backward compatibility için fallback - Türkçe varsayılan
// NOT: Client component'lerde getPsychologicalTests(t) kullanılmalı
export const psychologicalTests = getPsychologicalTests((_key: string) => _key);

// Backward compatibility için nameTarotCards - varsayılan key'leri döndürür
export const nameTarotCards = getNameTarotCards((_key: string) => _key);

export {
  mbtiTypes,
  loveLanguages,
  bigFiveTraits,
  enneagramTypes,
  friendEnergyRoles,
  loveVibrationProfiles,
  stressProfiles,
  getNameTarotCards,
};
