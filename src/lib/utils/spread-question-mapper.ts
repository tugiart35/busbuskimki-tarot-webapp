/**
 * Spread tipine göre soru metinlerini döndüren utility fonksiyonu
 * Tarot okuma formlarında kullanılmak üzere dinamik soru metinleri sağlar
 */

export interface SpreadQuestionMap {
  concern: string;
  understanding: string;
  emotional: string;
}

/**
 * Spread tipine göre soru metinlerini döndürür
 * @param spreadName - Spread adı (örn: "love-spread", "career", "money")
 * @returns Soru metinleri objesi
 */
export function getSpreadQuestionMap(
  spreadName: string | null | undefined
): SpreadQuestionMap {
  if (!spreadName) {
    return getDefaultQuestions();
  }

  const type = spreadName.toLowerCase();

  if (type.includes('love') || type.includes('aşk')) {
    return {
      concern: 'Aşk hayatınızda sizi en çok endişelendiren konu nedir?',
      emotional: 'Şu anda duygusal olarak nasıl hissediyorsunuz?',
      understanding: 'Bu aşk açılımı ile neyi anlamak istiyorsunuz?',
    };
  } else if (type.includes('money') || type.includes('para')) {
    return {
      concern: 'Para konusunda sizi en çok endişelendiren durum nedir?',
      emotional: 'Mali durumunuz hakkında nasıl hissediyorsunuz?',
      understanding: 'Bu para açılımı ile neyi anlamak istiyorsunuz?',
    };
  } else if (type.includes('career') || type.includes('kariyer')) {
    return {
      concern: 'Kariyerinizde sizi en çok endişelendiren konu nedir?',
      emotional: 'İş hayatınız hakkında nasıl hissediyorsunuz?',
      understanding: 'Bu kariyer açılımı ile neyi anlamak istiyorsunuz?',
    };
  } else if (
    type.includes('problem-solving') ||
    type.includes('problem') ||
    type.includes('problem')
  ) {
    return {
      concern: 'Hangi problemi çözmek istiyorsunuz?',
      emotional: 'Bu problem hakkında nasıl hissediyorsunuz?',
      understanding: 'Bu problem çözme açılımı ile neyi anlamak istiyorsunuz?',
    };
  } else if (type.includes('situation-analysis') || type.includes('durum')) {
    return {
      concern: 'Mevcut durumunuzda sizi en çok endişelendiren konu nedir?',
      emotional: 'Şu anki durumunuz hakkında nasıl hissediyorsunuz?',
      understanding: 'Bu durum analizi açılımı ile neyi anlamak istiyorsunuz?',
    };
  } else if (type.includes('marriage') || type.includes('evlilik')) {
    return {
      concern: 'Evlilik konusunda sizi en çok endişelendiren konu nedir?',
      emotional: 'Evlilik hakkında nasıl hissediyorsunuz?',
      understanding: 'Bu evlilik açılımı ile neyi anlamak istiyorsunuz?',
    };
  } else if (
    type.includes('relationship-analysis') ||
    type.includes('ilişki analizi')
  ) {
    return {
      concern: 'İlişkinizde sizi en çok endişelendiren konu nedir?',
      emotional: 'İlişkiniz hakkında nasıl hissediyorsunuz?',
      understanding: 'Bu ilişki analizi açılımı ile neyi anlamak istiyorsunuz?',
    };
  } else if (type.includes('new-lover') || type.includes('yeni aşk')) {
    return {
      concern: 'Yeni aşk hayatınızda sizi en çok endişelendiren konu nedir?',
      emotional: 'Yeni aşk konusunda nasıl hissediyorsunuz?',
      understanding: 'Bu yeni aşk açılımı ile neyi anlamak istiyorsunuz?',
    };
  } else if (
    type.includes('relationship-problems') ||
    type.includes('ilişki sorunları')
  ) {
    return {
      concern: 'İlişkinizdeki sorunlar hakkında ne düşünüyorsunuz?',
      emotional: 'İlişki sorunları hakkında nasıl hissediyorsunuz?',
      understanding:
        'Bu ilişki sorunları açılımı ile neyi anlamak istiyorsunuz?',
    };
  } else if (type.includes('general') || type.includes('genel')) {
    return {
      concern: 'Sizi en çok endişelendiren konu nedir?',
      emotional: 'Nasıl hissediyorsunuz?',
      understanding: 'Bu açılım ile neyi anlamak istiyorsunuz?',
    };
  }

  // Varsayılan sorular
  return getDefaultQuestions();
}

/**
 * Varsayılan soru metinlerini döndürür
 */
function getDefaultQuestions(): SpreadQuestionMap {
  return {
    concern: 'Sizi en çok endişelendiren konu nedir?',
    emotional: 'Nasıl hissediyorsunuz?',
    understanding: 'Bu açılım ile neyi anlamak istiyorsunuz?',
  };
}
