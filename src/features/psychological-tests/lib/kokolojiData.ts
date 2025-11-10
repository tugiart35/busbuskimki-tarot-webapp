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

// MBTI Kişilik Tipleri ve Açıklamaları - Helper Fonksiyon
export const getMBTITypes = (t: (key: string) => string) => ({
  INTJ: {
    title: t('psychTests.results.mbti.types.INTJ.title'),
    description: t('psychTests.results.mbti.types.INTJ.description'),
    traits: t('psychTests.results.mbti.types.INTJ.traits'),
    career: t('psychTests.results.mbti.types.INTJ.career'),
  },
  INTP: {
    title: t('psychTests.results.mbti.types.INTP.title'),
    description: t('psychTests.results.mbti.types.INTP.description'),
    traits: t('psychTests.results.mbti.types.INTP.traits'),
    career: t('psychTests.results.mbti.types.INTP.career'),
  },
  ENTJ: {
    title: t('psychTests.results.mbti.types.ENTJ.title'),
    description: t('psychTests.results.mbti.types.ENTJ.description'),
    traits: t('psychTests.results.mbti.types.ENTJ.traits'),
    career: t('psychTests.results.mbti.types.ENTJ.career'),
  },
  ENTP: {
    title: t('psychTests.results.mbti.types.ENTP.title'),
    description: t('psychTests.results.mbti.types.ENTP.description'),
    traits: t('psychTests.results.mbti.types.ENTP.traits'),
    career: t('psychTests.results.mbti.types.ENTP.career'),
  },
  INFJ: {
    title: t('psychTests.results.mbti.types.INFJ.title'),
    description: t('psychTests.results.mbti.types.INFJ.description'),
    traits: t('psychTests.results.mbti.types.INFJ.traits'),
    career: t('psychTests.results.mbti.types.INFJ.career'),
  },
  INFP: {
    title: t('psychTests.results.mbti.types.INFP.title'),
    description: t('psychTests.results.mbti.types.INFP.description'),
    traits: t('psychTests.results.mbti.types.INFP.traits'),
    career: t('psychTests.results.mbti.types.INFP.career'),
  },
  ENFJ: {
    title: t('psychTests.results.mbti.types.ENFJ.title'),
    description: t('psychTests.results.mbti.types.ENFJ.description'),
    traits: t('psychTests.results.mbti.types.ENFJ.traits'),
    career: t('psychTests.results.mbti.types.ENFJ.career'),
  },
  ENFP: {
    title: t('psychTests.results.mbti.types.ENFP.title'),
    description: t('psychTests.results.mbti.types.ENFP.description'),
    traits: t('psychTests.results.mbti.types.ENFP.traits'),
    career: t('psychTests.results.mbti.types.ENFP.career'),
  },
  ISTJ: {
    title: t('psychTests.results.mbti.types.ISTJ.title'),
    description: t('psychTests.results.mbti.types.ISTJ.description'),
    traits: t('psychTests.results.mbti.types.ISTJ.traits'),
    career: t('psychTests.results.mbti.types.ISTJ.career'),
  },
  ISFJ: {
    title: t('psychTests.results.mbti.types.ISFJ.title'),
    description: t('psychTests.results.mbti.types.ISFJ.description'),
    traits: t('psychTests.results.mbti.types.ISFJ.traits'),
    career: t('psychTests.results.mbti.types.ISFJ.career'),
  },
  ESTJ: {
    title: t('psychTests.results.mbti.types.ESTJ.title'),
    description: t('psychTests.results.mbti.types.ESTJ.description'),
    traits: t('psychTests.results.mbti.types.ESTJ.traits'),
    career: t('psychTests.results.mbti.types.ESTJ.career'),
  },
  ESFJ: {
    title: t('psychTests.results.mbti.types.ESFJ.title'),
    description: t('psychTests.results.mbti.types.ESFJ.description'),
    traits: t('psychTests.results.mbti.types.ESFJ.traits'),
    career: t('psychTests.results.mbti.types.ESFJ.career'),
  },
  ISTP: {
    title: t('psychTests.results.mbti.types.ISTP.title'),
    description: t('psychTests.results.mbti.types.ISTP.description'),
    traits: t('psychTests.results.mbti.types.ISTP.traits'),
    career: t('psychTests.results.mbti.types.ISTP.career'),
  },
  ISFP: {
    title: t('psychTests.results.mbti.types.ISFP.title'),
    description: t('psychTests.results.mbti.types.ISFP.description'),
    traits: t('psychTests.results.mbti.types.ISFP.traits'),
    career: t('psychTests.results.mbti.types.ISFP.career'),
  },
  ESTP: {
    title: t('psychTests.results.mbti.types.ESTP.title'),
    description: t('psychTests.results.mbti.types.ESTP.description'),
    traits: t('psychTests.results.mbti.types.ESTP.traits'),
    career: t('psychTests.results.mbti.types.ESTP.career'),
  },
  ESFP: {
    title: t('psychTests.results.mbti.types.ESFP.title'),
    description: t('psychTests.results.mbti.types.ESFP.description'),
    traits: t('psychTests.results.mbti.types.ESFP.traits'),
    career: t('psychTests.results.mbti.types.ESFP.career'),
  },
});

// Aşk Dili Tipleri - Helper Fonksiyon
export const getLoveLanguages = (t: (key: string) => string) => ({
  words: {
    title: t('psychTests.results.loveLanguages.words.title'),
    description: t('psychTests.results.loveLanguages.words.description'),
    traits: t('psychTests.results.loveLanguages.words.traits'),
    tips: t('psychTests.results.loveLanguages.words.tips'),
  },
  acts: {
    title: t('psychTests.results.loveLanguages.acts.title'),
    description: t('psychTests.results.loveLanguages.acts.description'),
    traits: t('psychTests.results.loveLanguages.acts.traits'),
    tips: t('psychTests.results.loveLanguages.acts.tips'),
  },
  gifts: {
    title: t('psychTests.results.loveLanguages.gifts.title'),
    description: t('psychTests.results.loveLanguages.gifts.description'),
    traits: t('psychTests.results.loveLanguages.gifts.traits'),
    tips: t('psychTests.results.loveLanguages.gifts.tips'),
  },
  time: {
    title: t('psychTests.results.loveLanguages.time.title'),
    description: t('psychTests.results.loveLanguages.time.description'),
    traits: t('psychTests.results.loveLanguages.time.traits'),
    tips: t('psychTests.results.loveLanguages.time.tips'),
  },
  touch: {
    title: t('psychTests.results.loveLanguages.touch.title'),
    description: t('psychTests.results.loveLanguages.touch.description'),
    traits: t('psychTests.results.loveLanguages.touch.traits'),
    tips: t('psychTests.results.loveLanguages.touch.tips'),
  },
});

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
export const getStressProfiles = (t: (key: string) => string) => ({
  low: {
    level: t('psychTests.results.stress.profiles.low.level'),
    emoji: t('psychTests.results.stress.profiles.low.emoji'),
    scoreRange: t('psychTests.results.stress.profiles.low.scoreRange'),
    description: t('psychTests.results.stress.profiles.low.description'),
    message: t('psychTests.results.stress.profiles.low.message'),
    meditationTips: JSON.parse(t('psychTests.results.stress.profiles.low.meditationTips') || '[]') as string[],
    wellnessAdvice: t('psychTests.results.stress.profiles.low.wellnessAdvice'),
  },
  moderate: {
    level: t('psychTests.results.stress.profiles.moderate.level'),
    emoji: t('psychTests.results.stress.profiles.moderate.emoji'),
    scoreRange: t('psychTests.results.stress.profiles.moderate.scoreRange'),
    description: t('psychTests.results.stress.profiles.moderate.description'),
    message: t('psychTests.results.stress.profiles.moderate.message'),
    meditationTips: JSON.parse(t('psychTests.results.stress.profiles.moderate.meditationTips') || '[]') as string[],
    wellnessAdvice: t('psychTests.results.stress.profiles.moderate.wellnessAdvice'),
  },
  high: {
    level: t('psychTests.results.stress.profiles.high.level'),
    emoji: t('psychTests.results.stress.profiles.high.emoji'),
    scoreRange: t('psychTests.results.stress.profiles.high.scoreRange'),
    description: t('psychTests.results.stress.profiles.high.description'),
    message: t('psychTests.results.stress.profiles.high.message'),
    meditationTips: JSON.parse(t('psychTests.results.stress.profiles.high.meditationTips') || '[]') as string[],
    wellnessAdvice: t('psychTests.results.stress.profiles.high.wellnessAdvice'),
  },
  veryHigh: {
    level: t('psychTests.results.stress.profiles.veryHigh.level'),
    emoji: t('psychTests.results.stress.profiles.veryHigh.emoji'),
    scoreRange: t('psychTests.results.stress.profiles.veryHigh.scoreRange'),
    description: t('psychTests.results.stress.profiles.veryHigh.description'),
    message: t('psychTests.results.stress.profiles.veryHigh.message'),
    meditationTips: JSON.parse(t('psychTests.results.stress.profiles.veryHigh.meditationTips') || '[]') as string[],
    wellnessAdvice: t('psychTests.results.stress.profiles.veryHigh.wellnessAdvice'),
    urgentNote: t('psychTests.results.stress.profiles.veryHigh.urgentNote'),
  },
});

// Aşk Enerjisi (Love Vibration) Profilleri
// Astroloji ve Tarot temelli - Venüs, Mars, Merkür gezegen enerjileri
// Kaynak: Klasik astroloji ve modern kişilik psikolojisi sentezi
export const getLoveVibrationProfiles = (t: (key: string) => string) => ({
  venusHarmony: {
    name: t('psychTests.results.loveVibration.profiles.venusHarmony.name'),
    title: t('psychTests.results.loveVibration.profiles.venusHarmony.title'),
    emoji: t('psychTests.results.loveVibration.profiles.venusHarmony.emoji'),
    planet: t('psychTests.results.loveVibration.profiles.venusHarmony.planet'),
    element: t('psychTests.results.loveVibration.profiles.venusHarmony.element'),
    tarotCard: t('psychTests.results.loveVibration.profiles.venusHarmony.tarotCard'),
    tagline: t('psychTests.results.loveVibration.profiles.venusHarmony.tagline'),
    description: t('psychTests.results.loveVibration.profiles.venusHarmony.description'),
    loveStyle: t('psychTests.results.loveVibration.profiles.venusHarmony.loveStyle'),
    strengths: JSON.parse(t('psychTests.results.loveVibration.profiles.venusHarmony.strengths') || '[]') as string[],
    compatibility: t('psychTests.results.loveVibration.profiles.venusHarmony.compatibility'),
    astrologicalInsight: t('psychTests.results.loveVibration.profiles.venusHarmony.astrologicalInsight'),
  },
  marsPassion: {
    name: t('psychTests.results.loveVibration.profiles.marsPassion.name'),
    title: t('psychTests.results.loveVibration.profiles.marsPassion.title'),
    emoji: t('psychTests.results.loveVibration.profiles.marsPassion.emoji'),
    planet: t('psychTests.results.loveVibration.profiles.marsPassion.planet'),
    element: t('psychTests.results.loveVibration.profiles.marsPassion.element'),
    tarotCard: t('psychTests.results.loveVibration.profiles.marsPassion.tarotCard'),
    tagline: t('psychTests.results.loveVibration.profiles.marsPassion.tagline'),
    description: t('psychTests.results.loveVibration.profiles.marsPassion.description'),
    loveStyle: t('psychTests.results.loveVibration.profiles.marsPassion.loveStyle'),
    strengths: JSON.parse(t('psychTests.results.loveVibration.profiles.marsPassion.strengths') || '[]') as string[],
    compatibility: t('psychTests.results.loveVibration.profiles.marsPassion.compatibility'),
    astrologicalInsight: t('psychTests.results.loveVibration.profiles.marsPassion.astrologicalInsight'),
  },
  mercuryCommunication: {
    name: t('psychTests.results.loveVibration.profiles.mercuryCommunication.name'),
    title: t('psychTests.results.loveVibration.profiles.mercuryCommunication.title'),
    emoji: t('psychTests.results.loveVibration.profiles.mercuryCommunication.emoji'),
    planet: t('psychTests.results.loveVibration.profiles.mercuryCommunication.planet'),
    element: t('psychTests.results.loveVibration.profiles.mercuryCommunication.element'),
    tarotCard: t('psychTests.results.loveVibration.profiles.mercuryCommunication.tarotCard'),
    tagline: t('psychTests.results.loveVibration.profiles.mercuryCommunication.tagline'),
    description: t('psychTests.results.loveVibration.profiles.mercuryCommunication.description'),
    loveStyle: t('psychTests.results.loveVibration.profiles.mercuryCommunication.loveStyle'),
    strengths: JSON.parse(t('psychTests.results.loveVibration.profiles.mercuryCommunication.strengths') || '[]') as string[],
    compatibility: t('psychTests.results.loveVibration.profiles.mercuryCommunication.compatibility'),
    astrologicalInsight: t('psychTests.results.loveVibration.profiles.mercuryCommunication.astrologicalInsight'),
  },
  venusMarsMix: {
    name: t('psychTests.results.loveVibration.profiles.venusMarsMix.name'),
    title: t('psychTests.results.loveVibration.profiles.venusMarsMix.title'),
    emoji: t('psychTests.results.loveVibration.profiles.venusMarsMix.emoji'),
    planet: t('psychTests.results.loveVibration.profiles.venusMarsMix.planet'),
    element: t('psychTests.results.loveVibration.profiles.venusMarsMix.element'),
    tarotCard: t('psychTests.results.loveVibration.profiles.venusMarsMix.tarotCard'),
    tagline: t('psychTests.results.loveVibration.profiles.venusMarsMix.tagline'),
    description: t('psychTests.results.loveVibration.profiles.venusMarsMix.description'),
    loveStyle: t('psychTests.results.loveVibration.profiles.venusMarsMix.loveStyle'),
    strengths: JSON.parse(t('psychTests.results.loveVibration.profiles.venusMarsMix.strengths') || '[]') as string[],
    compatibility: t('psychTests.results.loveVibration.profiles.venusMarsMix.compatibility'),
    astrologicalInsight: t('psychTests.results.loveVibration.profiles.venusMarsMix.astrologicalInsight'),
  },
  mercuryVenusMix: {
    name: t('psychTests.results.loveVibration.profiles.mercuryVenusMix.name'),
    title: t('psychTests.results.loveVibration.profiles.mercuryVenusMix.title'),
    emoji: t('psychTests.results.loveVibration.profiles.mercuryVenusMix.emoji'),
    planet: t('psychTests.results.loveVibration.profiles.mercuryVenusMix.planet'),
    element: t('psychTests.results.loveVibration.profiles.mercuryVenusMix.element'),
    tarotCard: t('psychTests.results.loveVibration.profiles.mercuryVenusMix.tarotCard'),
    tagline: t('psychTests.results.loveVibration.profiles.mercuryVenusMix.tagline'),
    description: t('psychTests.results.loveVibration.profiles.mercuryVenusMix.description'),
    loveStyle: t('psychTests.results.loveVibration.profiles.mercuryVenusMix.loveStyle'),
    strengths: JSON.parse(t('psychTests.results.loveVibration.profiles.mercuryVenusMix.strengths') || '[]') as string[],
    compatibility: t('psychTests.results.loveVibration.profiles.mercuryVenusMix.compatibility'),
    astrologicalInsight: t('psychTests.results.loveVibration.profiles.mercuryVenusMix.astrologicalInsight'),
  },
  marsMercuryMix: {
    name: t('psychTests.results.loveVibration.profiles.marsMercuryMix.name'),
    title: t('psychTests.results.loveVibration.profiles.marsMercuryMix.title'),
    emoji: t('psychTests.results.loveVibration.profiles.marsMercuryMix.emoji'),
    planet: t('psychTests.results.loveVibration.profiles.marsMercuryMix.planet'),
    element: t('psychTests.results.loveVibration.profiles.marsMercuryMix.element'),
    tarotCard: t('psychTests.results.loveVibration.profiles.marsMercuryMix.tarotCard'),
    tagline: t('psychTests.results.loveVibration.profiles.marsMercuryMix.tagline'),
    description: t('psychTests.results.loveVibration.profiles.marsMercuryMix.description'),
    loveStyle: t('psychTests.results.loveVibration.profiles.marsMercuryMix.loveStyle'),
    strengths: JSON.parse(t('psychTests.results.loveVibration.profiles.marsMercuryMix.strengths') || '[]') as string[],
    compatibility: t('psychTests.results.loveVibration.profiles.marsMercuryMix.compatibility'),
    astrologicalInsight: t('psychTests.results.loveVibration.profiles.marsMercuryMix.astrologicalInsight'),
  },
  tripleHarmony: {
    name: t('psychTests.results.loveVibration.profiles.tripleHarmony.name'),
    title: t('psychTests.results.loveVibration.profiles.tripleHarmony.title'),
    emoji: t('psychTests.results.loveVibration.profiles.tripleHarmony.emoji'),
    planet: t('psychTests.results.loveVibration.profiles.tripleHarmony.planet'),
    element: t('psychTests.results.loveVibration.profiles.tripleHarmony.element'),
    tarotCard: t('psychTests.results.loveVibration.profiles.tripleHarmony.tarotCard'),
    tagline: t('psychTests.results.loveVibration.profiles.tripleHarmony.tagline'),
    description: t('psychTests.results.loveVibration.profiles.tripleHarmony.description'),
    loveStyle: t('psychTests.results.loveVibration.profiles.tripleHarmony.loveStyle'),
    strengths: JSON.parse(t('psychTests.results.loveVibration.profiles.tripleHarmony.strengths') || '[]') as string[],
    compatibility: t('psychTests.results.loveVibration.profiles.tripleHarmony.compatibility'),
    astrologicalInsight: t('psychTests.results.loveVibration.profiles.tripleHarmony.astrologicalInsight'),
  },
  moonIntuition: {
    name: t('psychTests.results.loveVibration.profiles.moonIntuition.name'),
    title: t('psychTests.results.loveVibration.profiles.moonIntuition.title'),
    emoji: t('psychTests.results.loveVibration.profiles.moonIntuition.emoji'),
    planet: t('psychTests.results.loveVibration.profiles.moonIntuition.planet'),
    element: t('psychTests.results.loveVibration.profiles.moonIntuition.element'),
    tarotCard: t('psychTests.results.loveVibration.profiles.moonIntuition.tarotCard'),
    tagline: t('psychTests.results.loveVibration.profiles.moonIntuition.tagline'),
    description: t('psychTests.results.loveVibration.profiles.moonIntuition.description'),
    loveStyle: t('psychTests.results.loveVibration.profiles.moonIntuition.loveStyle'),
    strengths: JSON.parse(t('psychTests.results.loveVibration.profiles.moonIntuition.strengths') || '[]') as string[],
    compatibility: t('psychTests.results.loveVibration.profiles.moonIntuition.compatibility'),
    astrologicalInsight: t('psychTests.results.loveVibration.profiles.moonIntuition.astrologicalInsight'),
  },
});

// Arkadaş Grubu Enerjisi Rolleri
// Sosyal psikoloji ve grup dinamikleri araştırmalarına dayalı, eğlenceli kişilik rolleri
export const getFriendEnergyRoles = (t: (key: string) => string) => ({
  wiseMentor: {
    name: t('psychTests.results.friendEnergy.roles.wiseMentor.name'),
    title: t('psychTests.results.friendEnergy.roles.wiseMentor.title'),
    emoji: t('psychTests.results.friendEnergy.roles.wiseMentor.emoji'),
    tagline: t('psychTests.results.friendEnergy.roles.wiseMentor.tagline'),
    description: t('psychTests.results.friendEnergy.roles.wiseMentor.description'),
    socialRole: t('psychTests.results.friendEnergy.roles.wiseMentor.socialRole'),
    strengths: JSON.parse(t('psychTests.results.friendEnergy.roles.wiseMentor.strengths') || '[]') as string[],
    funFacts: JSON.parse(t('psychTests.results.friendEnergy.roles.wiseMentor.funFacts') || '[]') as string[],
    shareText: t('psychTests.results.friendEnergy.roles.wiseMentor.shareText'),
  },
  dramaQueen: {
    name: t('psychTests.results.friendEnergy.roles.dramaQueen.name'),
    title: t('psychTests.results.friendEnergy.roles.dramaQueen.title'),
    emoji: t('psychTests.results.friendEnergy.roles.dramaQueen.emoji'),
    tagline: t('psychTests.results.friendEnergy.roles.dramaQueen.tagline'),
    description: t('psychTests.results.friendEnergy.roles.dramaQueen.description'),
    socialRole: t('psychTests.results.friendEnergy.roles.dramaQueen.socialRole'),
    strengths: JSON.parse(t('psychTests.results.friendEnergy.roles.dramaQueen.strengths') || '[]') as string[],
    funFacts: JSON.parse(t('psychTests.results.friendEnergy.roles.dramaQueen.funFacts') || '[]') as string[],
    shareText: t('psychTests.results.friendEnergy.roles.dramaQueen.shareText'),
  },
  spontaneousExplorer: {
    name: t('psychTests.results.friendEnergy.roles.spontaneousExplorer.name'),
    title: t('psychTests.results.friendEnergy.roles.spontaneousExplorer.title'),
    emoji: t('psychTests.results.friendEnergy.roles.spontaneousExplorer.emoji'),
    tagline: t('psychTests.results.friendEnergy.roles.spontaneousExplorer.tagline'),
    description: t('psychTests.results.friendEnergy.roles.spontaneousExplorer.description'),
    socialRole: t('psychTests.results.friendEnergy.roles.spontaneousExplorer.socialRole'),
    strengths: JSON.parse(t('psychTests.results.friendEnergy.roles.spontaneousExplorer.strengths') || '[]') as string[],
    funFacts: JSON.parse(t('psychTests.results.friendEnergy.roles.spontaneousExplorer.funFacts') || '[]') as string[],
    shareText: t('psychTests.results.friendEnergy.roles.spontaneousExplorer.shareText'),
  },
  momFriend: {
    name: t('psychTests.results.friendEnergy.roles.momFriend.name'),
    title: t('psychTests.results.friendEnergy.roles.momFriend.title'),
    emoji: t('psychTests.results.friendEnergy.roles.momFriend.emoji'),
    tagline: t('psychTests.results.friendEnergy.roles.momFriend.tagline'),
    description: t('psychTests.results.friendEnergy.roles.momFriend.description'),
    socialRole: t('psychTests.results.friendEnergy.roles.momFriend.socialRole'),
    strengths: JSON.parse(t('psychTests.results.friendEnergy.roles.momFriend.strengths') || '[]') as string[],
    funFacts: JSON.parse(t('psychTests.results.friendEnergy.roles.momFriend.funFacts') || '[]') as string[],
    shareText: t('psychTests.results.friendEnergy.roles.momFriend.shareText'),
  },
  partyStarter: {
    name: t('psychTests.results.friendEnergy.roles.partyStarter.name'),
    title: t('psychTests.results.friendEnergy.roles.partyStarter.title'),
    emoji: t('psychTests.results.friendEnergy.roles.partyStarter.emoji'),
    tagline: t('psychTests.results.friendEnergy.roles.partyStarter.tagline'),
    description: t('psychTests.results.friendEnergy.roles.partyStarter.description'),
    socialRole: t('psychTests.results.friendEnergy.roles.partyStarter.socialRole'),
    strengths: JSON.parse(t('psychTests.results.friendEnergy.roles.partyStarter.strengths') || '[]') as string[],
    funFacts: JSON.parse(t('psychTests.results.friendEnergy.roles.partyStarter.funFacts') || '[]') as string[],
    shareText: t('psychTests.results.friendEnergy.roles.partyStarter.shareText'),
  },
  quietPower: {
    name: t('psychTests.results.friendEnergy.roles.quietPower.name'),
    title: t('psychTests.results.friendEnergy.roles.quietPower.title'),
    emoji: t('psychTests.results.friendEnergy.roles.quietPower.emoji'),
    tagline: t('psychTests.results.friendEnergy.roles.quietPower.tagline'),
    description: t('psychTests.results.friendEnergy.roles.quietPower.description'),
    socialRole: t('psychTests.results.friendEnergy.roles.quietPower.socialRole'),
    strengths: JSON.parse(t('psychTests.results.friendEnergy.roles.quietPower.strengths') || '[]') as string[],
    funFacts: JSON.parse(t('psychTests.results.friendEnergy.roles.quietPower.funFacts') || '[]') as string[],
    shareText: t('psychTests.results.friendEnergy.roles.quietPower.shareText'),
  },
  comedian: {
    name: t('psychTests.results.friendEnergy.roles.comedian.name'),
    title: t('psychTests.results.friendEnergy.roles.comedian.title'),
    emoji: t('psychTests.results.friendEnergy.roles.comedian.emoji'),
    tagline: t('psychTests.results.friendEnergy.roles.comedian.tagline'),
    description: t('psychTests.results.friendEnergy.roles.comedian.description'),
    socialRole: t('psychTests.results.friendEnergy.roles.comedian.socialRole'),
    strengths: JSON.parse(t('psychTests.results.friendEnergy.roles.comedian.strengths') || '[]') as string[],
    funFacts: JSON.parse(t('psychTests.results.friendEnergy.roles.comedian.funFacts') || '[]') as string[],
    shareText: t('psychTests.results.friendEnergy.roles.comedian.shareText'),
  },
  therapist: {
    name: t('psychTests.results.friendEnergy.roles.therapist.name'),
    title: t('psychTests.results.friendEnergy.roles.therapist.title'),
    emoji: t('psychTests.results.friendEnergy.roles.therapist.emoji'),
    tagline: t('psychTests.results.friendEnergy.roles.therapist.tagline'),
    description: t('psychTests.results.friendEnergy.roles.therapist.description'),
    socialRole: t('psychTests.results.friendEnergy.roles.therapist.socialRole'),
    strengths: JSON.parse(t('psychTests.results.friendEnergy.roles.therapist.strengths') || '[]') as string[],
    funFacts: JSON.parse(t('psychTests.results.friendEnergy.roles.therapist.funFacts') || '[]') as string[],
    shareText: t('psychTests.results.friendEnergy.roles.therapist.shareText'),
  },
  adventurer: {
    name: t('psychTests.results.friendEnergy.roles.adventurer.name'),
    title: t('psychTests.results.friendEnergy.roles.adventurer.title'),
    emoji: t('psychTests.results.friendEnergy.roles.adventurer.emoji'),
    tagline: t('psychTests.results.friendEnergy.roles.adventurer.tagline'),
    description: t('psychTests.results.friendEnergy.roles.adventurer.description'),
    socialRole: t('psychTests.results.friendEnergy.roles.adventurer.socialRole'),
    strengths: JSON.parse(t('psychTests.results.friendEnergy.roles.adventurer.strengths') || '[]') as string[],
    funFacts: JSON.parse(t('psychTests.results.friendEnergy.roles.adventurer.funFacts') || '[]') as string[],
    shareText: t('psychTests.results.friendEnergy.roles.adventurer.shareText'),
  },
  peacekeeper: {
    name: t('psychTests.results.friendEnergy.roles.peacekeeper.name'),
    title: t('psychTests.results.friendEnergy.roles.peacekeeper.title'),
    emoji: t('psychTests.results.friendEnergy.roles.peacekeeper.emoji'),
    tagline: t('psychTests.results.friendEnergy.roles.peacekeeper.tagline'),
    description: t('psychTests.results.friendEnergy.roles.peacekeeper.description'),
    socialRole: t('psychTests.results.friendEnergy.roles.peacekeeper.socialRole'),
    strengths: JSON.parse(t('psychTests.results.friendEnergy.roles.peacekeeper.strengths') || '[]') as string[],
    funFacts: JSON.parse(t('psychTests.results.friendEnergy.roles.peacekeeper.funFacts') || '[]') as string[],
    shareText: t('psychTests.results.friendEnergy.roles.peacekeeper.shareText'),
  },
});

// Enneagram 9 Kişilik Tipi Açıklamaları
// Kaynak: Enneagram Institute ve bilimsel kişilik psikolojisi literatürü
export const getEnneagramTypes = (t: (key: string) => string) => ({
  type1: {
    name: t('psychTests.results.enneagram.types.type1.name'),
    title: t('psychTests.results.enneagram.types.type1.title'),
    subtitle: t('psychTests.results.enneagram.types.type1.subtitle'),
    description: t('psychTests.results.enneagram.types.type1.description'),
    coreMotivation: t('psychTests.results.enneagram.types.type1.coreMotivation'),
    coreFear: t('psychTests.results.enneagram.types.type1.coreFear'),
    lightSide: {
      title: t('psychTests.results.enneagram.types.type1.lightSide.title'),
      traits: t('psychTests.results.enneagram.types.type1.lightSide.traits'),
      description: t('psychTests.results.enneagram.types.type1.lightSide.description'),
    },
    shadowSide: {
      title: t('psychTests.results.enneagram.types.type1.shadowSide.title'),
      traits: t('psychTests.results.enneagram.types.type1.shadowSide.traits'),
      description: t('psychTests.results.enneagram.types.type1.shadowSide.description'),
    },
  },
  type2: {
    name: t('psychTests.results.enneagram.types.type2.name'),
    title: t('psychTests.results.enneagram.types.type2.title'),
    subtitle: t('psychTests.results.enneagram.types.type2.subtitle'),
    description: t('psychTests.results.enneagram.types.type2.description'),
    coreMotivation: t('psychTests.results.enneagram.types.type2.coreMotivation'),
    coreFear: t('psychTests.results.enneagram.types.type2.coreFear'),
    lightSide: {
      title: t('psychTests.results.enneagram.types.type2.lightSide.title'),
      traits: t('psychTests.results.enneagram.types.type2.lightSide.traits'),
      description: t('psychTests.results.enneagram.types.type2.lightSide.description'),
    },
    shadowSide: {
      title: t('psychTests.results.enneagram.types.type2.shadowSide.title'),
      traits: t('psychTests.results.enneagram.types.type2.shadowSide.traits'),
      description: t('psychTests.results.enneagram.types.type2.shadowSide.description'),
    },
  },
  type3: {
    name: t('psychTests.results.enneagram.types.type3.name'),
    title: t('psychTests.results.enneagram.types.type3.title'),
    subtitle: t('psychTests.results.enneagram.types.type3.subtitle'),
    description: t('psychTests.results.enneagram.types.type3.description'),
    coreMotivation: t('psychTests.results.enneagram.types.type3.coreMotivation'),
    coreFear: t('psychTests.results.enneagram.types.type3.coreFear'),
    lightSide: {
      title: t('psychTests.results.enneagram.types.type3.lightSide.title'),
      traits: t('psychTests.results.enneagram.types.type3.lightSide.traits'),
      description: t('psychTests.results.enneagram.types.type3.lightSide.description'),
    },
    shadowSide: {
      title: t('psychTests.results.enneagram.types.type3.shadowSide.title'),
      traits: t('psychTests.results.enneagram.types.type3.shadowSide.traits'),
      description: t('psychTests.results.enneagram.types.type3.shadowSide.description'),
    },
  },
  type4: {
    name: t('psychTests.results.enneagram.types.type4.name'),
    title: t('psychTests.results.enneagram.types.type4.title'),
    subtitle: t('psychTests.results.enneagram.types.type4.subtitle'),
    description: t('psychTests.results.enneagram.types.type4.description'),
    coreMotivation: t('psychTests.results.enneagram.types.type4.coreMotivation'),
    coreFear: t('psychTests.results.enneagram.types.type4.coreFear'),
    lightSide: {
      title: t('psychTests.results.enneagram.types.type4.lightSide.title'),
      traits: t('psychTests.results.enneagram.types.type4.lightSide.traits'),
      description: t('psychTests.results.enneagram.types.type4.lightSide.description'),
    },
    shadowSide: {
      title: t('psychTests.results.enneagram.types.type4.shadowSide.title'),
      traits: t('psychTests.results.enneagram.types.type4.shadowSide.traits'),
      description: t('psychTests.results.enneagram.types.type4.shadowSide.description'),
    },
  },
  type5: {
    name: t('psychTests.results.enneagram.types.type5.name'),
    title: t('psychTests.results.enneagram.types.type5.title'),
    subtitle: t('psychTests.results.enneagram.types.type5.subtitle'),
    description: t('psychTests.results.enneagram.types.type5.description'),
    coreMotivation: t('psychTests.results.enneagram.types.type5.coreMotivation'),
    coreFear: t('psychTests.results.enneagram.types.type5.coreFear'),
    lightSide: {
      title: t('psychTests.results.enneagram.types.type5.lightSide.title'),
      traits: t('psychTests.results.enneagram.types.type5.lightSide.traits'),
      description: t('psychTests.results.enneagram.types.type5.lightSide.description'),
    },
    shadowSide: {
      title: t('psychTests.results.enneagram.types.type5.shadowSide.title'),
      traits: t('psychTests.results.enneagram.types.type5.shadowSide.traits'),
      description: t('psychTests.results.enneagram.types.type5.shadowSide.description'),
    },
  },
  type6: {
    name: t('psychTests.results.enneagram.types.type6.name'),
    title: t('psychTests.results.enneagram.types.type6.title'),
    subtitle: t('psychTests.results.enneagram.types.type6.subtitle'),
    description: t('psychTests.results.enneagram.types.type6.description'),
    coreMotivation: t('psychTests.results.enneagram.types.type6.coreMotivation'),
    coreFear: t('psychTests.results.enneagram.types.type6.coreFear'),
    lightSide: {
      title: t('psychTests.results.enneagram.types.type6.lightSide.title'),
      traits: t('psychTests.results.enneagram.types.type6.lightSide.traits'),
      description: t('psychTests.results.enneagram.types.type6.lightSide.description'),
    },
    shadowSide: {
      title: t('psychTests.results.enneagram.types.type6.shadowSide.title'),
      traits: t('psychTests.results.enneagram.types.type6.shadowSide.traits'),
      description: t('psychTests.results.enneagram.types.type6.shadowSide.description'),
    },
  },
  type7: {
    name: t('psychTests.results.enneagram.types.type7.name'),
    title: t('psychTests.results.enneagram.types.type7.title'),
    subtitle: t('psychTests.results.enneagram.types.type7.subtitle'),
    description: t('psychTests.results.enneagram.types.type7.description'),
    coreMotivation: t('psychTests.results.enneagram.types.type7.coreMotivation'),
    coreFear: t('psychTests.results.enneagram.types.type7.coreFear'),
    lightSide: {
      title: t('psychTests.results.enneagram.types.type7.lightSide.title'),
      traits: t('psychTests.results.enneagram.types.type7.lightSide.traits'),
      description: t('psychTests.results.enneagram.types.type7.lightSide.description'),
    },
    shadowSide: {
      title: t('psychTests.results.enneagram.types.type7.shadowSide.title'),
      traits: t('psychTests.results.enneagram.types.type7.shadowSide.traits'),
      description: t('psychTests.results.enneagram.types.type7.shadowSide.description'),
    },
  },
  type8: {
    name: t('psychTests.results.enneagram.types.type8.name'),
    title: t('psychTests.results.enneagram.types.type8.title'),
    subtitle: t('psychTests.results.enneagram.types.type8.subtitle'),
    description: t('psychTests.results.enneagram.types.type8.description'),
    coreMotivation: t('psychTests.results.enneagram.types.type8.coreMotivation'),
    coreFear: t('psychTests.results.enneagram.types.type8.coreFear'),
    lightSide: {
      title: t('psychTests.results.enneagram.types.type8.lightSide.title'),
      traits: t('psychTests.results.enneagram.types.type8.lightSide.traits'),
      description: t('psychTests.results.enneagram.types.type8.lightSide.description'),
    },
    shadowSide: {
      title: t('psychTests.results.enneagram.types.type8.shadowSide.title'),
      traits: t('psychTests.results.enneagram.types.type8.shadowSide.traits'),
      description: t('psychTests.results.enneagram.types.type8.shadowSide.description'),
    },
  },
  type9: {
    name: t('psychTests.results.enneagram.types.type9.name'),
    title: t('psychTests.results.enneagram.types.type9.title'),
    subtitle: t('psychTests.results.enneagram.types.type9.subtitle'),
    description: t('psychTests.results.enneagram.types.type9.description'),
    coreMotivation: t('psychTests.results.enneagram.types.type9.coreMotivation'),
    coreFear: t('psychTests.results.enneagram.types.type9.coreFear'),
    lightSide: {
      title: t('psychTests.results.enneagram.types.type9.lightSide.title'),
      traits: t('psychTests.results.enneagram.types.type9.lightSide.traits'),
      description: t('psychTests.results.enneagram.types.type9.lightSide.description'),
    },
    shadowSide: {
      title: t('psychTests.results.enneagram.types.type9.shadowSide.title'),
      traits: t('psychTests.results.enneagram.types.type9.shadowSide.traits'),
      description: t('psychTests.results.enneagram.types.type9.shadowSide.description'),
    },
  },
});

// Big Five Kişilik Boyutları Açıklamaları
export const getBigFiveTraits = (t: (key: string) => string) => ({
  openness: {
    high: {
      title: t('psychTests.results.bigFive.dimensions.openness.high.title'),
      description: t('psychTests.results.bigFive.dimensions.openness.high.description'),
      traits: t('psychTests.results.bigFive.dimensions.openness.high.traits'),
    },
    medium: {
      title: t('psychTests.results.bigFive.dimensions.openness.medium.title'),
      description: t('psychTests.results.bigFive.dimensions.openness.medium.description'),
      traits: t('psychTests.results.bigFive.dimensions.openness.medium.traits'),
    },
    low: {
      title: t('psychTests.results.bigFive.dimensions.openness.low.title'),
      description: t('psychTests.results.bigFive.dimensions.openness.low.description'),
      traits: t('psychTests.results.bigFive.dimensions.openness.low.traits'),
    },
  },
  conscientiousness: {
    high: {
      title: t('psychTests.results.bigFive.dimensions.conscientiousness.high.title'),
      description: t('psychTests.results.bigFive.dimensions.conscientiousness.high.description'),
      traits: t('psychTests.results.bigFive.dimensions.conscientiousness.high.traits'),
    },
    medium: {
      title: t('psychTests.results.bigFive.dimensions.conscientiousness.medium.title'),
      description: t('psychTests.results.bigFive.dimensions.conscientiousness.medium.description'),
      traits: t('psychTests.results.bigFive.dimensions.conscientiousness.medium.traits'),
    },
    low: {
      title: t('psychTests.results.bigFive.dimensions.conscientiousness.low.title'),
      description: t('psychTests.results.bigFive.dimensions.conscientiousness.low.description'),
      traits: t('psychTests.results.bigFive.dimensions.conscientiousness.low.traits'),
    },
  },
  extraversion: {
    high: {
      title: t('psychTests.results.bigFive.dimensions.extraversion.high.title'),
      description: t('psychTests.results.bigFive.dimensions.extraversion.high.description'),
      traits: t('psychTests.results.bigFive.dimensions.extraversion.high.traits'),
    },
    medium: {
      title: t('psychTests.results.bigFive.dimensions.extraversion.medium.title'),
      description: t('psychTests.results.bigFive.dimensions.extraversion.medium.description'),
      traits: t('psychTests.results.bigFive.dimensions.extraversion.medium.traits'),
    },
    low: {
      title: t('psychTests.results.bigFive.dimensions.extraversion.low.title'),
      description: t('psychTests.results.bigFive.dimensions.extraversion.low.description'),
      traits: t('psychTests.results.bigFive.dimensions.extraversion.low.traits'),
    },
  },
  agreeableness: {
    high: {
      title: t('psychTests.results.bigFive.dimensions.agreeableness.high.title'),
      description: t('psychTests.results.bigFive.dimensions.agreeableness.high.description'),
      traits: t('psychTests.results.bigFive.dimensions.agreeableness.high.traits'),
    },
    medium: {
      title: t('psychTests.results.bigFive.dimensions.agreeableness.medium.title'),
      description: t('psychTests.results.bigFive.dimensions.agreeableness.medium.description'),
      traits: t('psychTests.results.bigFive.dimensions.agreeableness.medium.traits'),
    },
    low: {
      title: t('psychTests.results.bigFive.dimensions.agreeableness.low.title'),
      description: t('psychTests.results.bigFive.dimensions.agreeableness.low.description'),
      traits: t('psychTests.results.bigFive.dimensions.agreeableness.low.traits'),
    },
  },
  neuroticism: {
    high: {
      title: t('psychTests.results.bigFive.dimensions.neuroticism.high.title'),
      description: t('psychTests.results.bigFive.dimensions.neuroticism.high.description'),
      traits: t('psychTests.results.bigFive.dimensions.neuroticism.high.traits'),
      tips: t('psychTests.results.bigFive.dimensions.neuroticism.high.tips'),
    },
    medium: {
      title: t('psychTests.results.bigFive.dimensions.neuroticism.medium.title'),
      description: t('psychTests.results.bigFive.dimensions.neuroticism.medium.description'),
      traits: t('psychTests.results.bigFive.dimensions.neuroticism.medium.traits'),
    },
    low: {
      title: t('psychTests.results.bigFive.dimensions.neuroticism.low.title'),
      description: t('psychTests.results.bigFive.dimensions.neuroticism.low.description'),
      traits: t('psychTests.results.bigFive.dimensions.neuroticism.low.traits'),
    },
  },
  dimensionNames: {
    openness: t('psychTests.results.bigFive.dimensionNames.openness'),
    conscientiousness: t('psychTests.results.bigFive.dimensionNames.conscientiousness'),
    extraversion: t('psychTests.results.bigFive.dimensionNames.extraversion'),
    agreeableness: t('psychTests.results.bigFive.dimensionNames.agreeableness'),
    neuroticism: t('psychTests.results.bigFive.dimensionNames.neuroticism'),
  },
});

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

