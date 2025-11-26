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
      understanding: 'Bu Aşk Uyumu ile neyi anlamak istiyorsunuz?',
    };
  } else if (type.includes('money') || type.includes('para')) {
    return {
      concern: 'Şu anda para konusunda sizi en çok zorlayan ya da kaygılandıran durum nedir?',
      emotional: 'Mali durumunuzu düşündüğünüzde kendinizi nasıl hissediyorsunuz? Para şu an sizin için hangi duyguyu temsil ediyor? (güvende / huzursuz / yetersiz / özgür vb.)',
      understanding: 'Bu para açılımının, para ve gelecek planlarınızla ilgili hangi konuda size daha fazla netlik ve yön göstermesini istiyorsunuz?',
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
      concern: 'Bu Kelt açılımı için niyet ettiğiniz ana konu veya soru nedir? (ilişki, kariyer, para, aile, kişisel gelişim vb. kısaca yazabilirsiniz.)',
      emotional: 'Bu konuyu düşündüğünüzde kendinizi nasıl hissediyorsunuz? Bu durum şu anda sizde en çok hangi duyguyu tetikliyor? (ör. kaygılı, umutlu, kararsız, yorgun, heyecanlı vb.)',
      understanding: 'Bu Kelt açılımının size özellikle hangi konuda daha fazla netlik ve yön göstermesini istiyorsunuz? (geçmişte neyi anlamak, şu an neyi görmek, gelecekte hangi kararı netleştirmek vb.)',
    };
  } else if (type.includes('situation-analysis') || type.includes('durum')) {
    return {
      concern: 'Mevcut durumunuzda sizi en çok endişelendiren konu nedir?',
      emotional: 'Şu anki durumunuz hakkında nasıl hissediyorsunuz?',
      understanding:
        'Bu Enerji Haritası açılımı ile neyi anlamak istiyorsunuz?',
    };
  } else if (type.includes('marriage') || type.includes('evlilik')) {
    return {
      concern: 'Evlilikle ilgili şu anda sizi en çok endişelendiren ya da kafanızı kurcalayan konu nedir? (örn. yalnız kalma korkusu, yanlış kişiyle evlenme, maddi konular, aile onayı vb.)',
      emotional: 'Evlilik fikrini düşündüğünüzde kendinizi nasıl hissediyorsunuz? Bu konu sizde en çok hangi duyguları tetikliyor? (özlem, korku, umut, kararsızlık vb.)',
      understanding: 'Bu evlilik potansiyeli açılımının size özellikle hangi alanlarda daha fazla netlik vermesini istiyorsunuz? (doğru eşi bulma, uyum, ailelerin yaklaşımı, maddi paylaşım, zamanlama vb.)',
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
      understanding: 'Bu yeni Aşk Uyumu ile neyi anlamak istiyorsunuz?',
    };
  } else if (
    type.includes('relationship-problems') ||
    type.includes('ilişki sorunları')
  ) {
    return {
      concern: 'İlişkinizdeki sorunlar hakkında ne düşünüyorsunuz?',
      emotional: 'İlişki dönüşüm hakkında nasıl hissediyorsunuz?',
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

