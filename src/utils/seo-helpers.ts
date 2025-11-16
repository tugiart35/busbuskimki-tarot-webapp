/**
 * SEO HELPER UTILITIES
 *
 * Bu dosya, SEO optimizasyonu için yardımcı fonksiyonlar içerir.
 * Alt text oluşturma, meta description, title generation gibi işlevler.
 */

/**
 * Tarot kartı için SEO-optimized alt text oluşturur
 *
 * @param card - Tarot kartı objesi
 * @param locale - Dil ('tr' | 'en' | 'sr')
 * @param options - Ek seçenekler
 * @returns SEO için optimize edilmiş alt text
 */
export function generateCardAltText(
  card: {
    nameTr?: string;
    nameEn?: string;
    nameSr?: string;
    type?: 'major' | 'minor';
    number?: number;
    suit?: string;
  },
  locale: 'tr' | 'en' | 'sr' = 'tr',
  options?: {
    isReversed?: boolean;
    includeContext?: boolean;
    context?: 'gallery' | 'reading' | 'detail';
  }
): string {
  const {
    isReversed = false,
    includeContext = true,
    context = 'detail',
  } = options || {};

  // Kart adını dile göre al
  const cardName =
    locale === 'tr'
      ? card.nameTr
      : locale === 'en'
        ? card.nameEn
        : card.nameSr || card.nameEn || card.nameTr;

  if (!cardName) {
    return locale === 'tr'
      ? 'Tarot kartı'
      : locale === 'en'
        ? 'Tarot card'
        : 'Tarot karta';
  }

  // Arcana tipi
  const arcanaText =
    card.type === 'major'
      ? locale === 'tr'
        ? 'Major Arcana'
        : locale === 'en'
          ? 'Major Arcana'
          : 'Velika Arkana'
      : locale === 'tr'
        ? 'Minor Arcana'
        : locale === 'en'
          ? 'Minor Arcana'
          : 'Mala Arkana';

  // Pozisyon durumu
  const positionText = isReversed
    ? locale === 'tr'
      ? 'ters pozisyonda'
      : locale === 'en'
        ? 'in reversed position'
        : 'u obrnutoj poziciji'
    : locale === 'tr'
      ? 'düz pozisyonda'
      : locale === 'en'
        ? 'in upright position'
        : 'u uspravnoj poziciji';

  // Numara bilgisi
  const numberText =
    card.number !== undefined
      ? locale === 'tr'
        ? ` numara ${card.number}`
        : locale === 'en'
          ? ` number ${card.number}`
          : ` broj ${card.number}`
      : '';

  // Suit bilgisi (Minor Arcana için)
  const suitText =
    card.suit && card.type === 'minor'
      ? locale === 'tr'
        ? ` ${card.suit} takımı`
        : locale === 'en'
          ? ` of ${card.suit}`
          : ` ${card.suit}`
      : '';

  // Context bazlı ek açıklama
  let contextText = '';
  if (includeContext) {
    if (context === 'reading') {
      contextText =
        locale === 'tr'
          ? ', tarot falı kartı'
          : locale === 'en'
            ? ', tarot reading card'
            : ', tarot karta za čitanje';
    } else if (context === 'detail') {
      contextText =
        locale === 'tr'
          ? ', tarot kartı anlamları ve yorumları'
          : locale === 'en'
            ? ', tarot card meanings and interpretations'
            : ', značenja i tumačenja tarot karata';
    } else if (context === 'gallery') {
      contextText =
        locale === 'tr'
          ? ', tarot kartı galerisi'
          : locale === 'en'
            ? ', tarot card gallery'
            : ', galerija tarot karata';
    }
  }

  // Final alt text
  return `${cardName} - ${arcanaText}${numberText}${suitText} ${positionText}${contextText}`;
}

/**
 * Kart galeri görsel için alt text oluşturur
 */
export function generateCardGalleryAltText(
  cardName: string,
  arcanaType: 'major' | 'minor',
  locale: 'tr' | 'en' | 'sr' = 'tr',
  number?: number
): string {
  const arcana =
    arcanaType === 'major'
      ? locale === 'tr'
        ? 'Major Arcana'
        : locale === 'en'
          ? 'Major Arcana'
          : 'Velika Arkana'
      : locale === 'tr'
        ? 'Minor Arcana'
        : locale === 'en'
          ? 'Minor Arcana'
          : 'Mala Arkana';

  const numberText = number
    ? locale === 'tr'
      ? ` numara ${number}`
      : locale === 'en'
        ? ` number ${number}`
        : ` broj ${number}`
    : '';

  const contextText =
    locale === 'tr'
      ? 'tarot kartı anlamları ve yorumları'
      : locale === 'en'
        ? 'tarot card meanings and interpretations'
        : 'značenja i tumačenja tarot karata';

  return `${cardName} - ${arcana}${numberText}, ${contextText}`;
}

/**
 * Arka plan görseli için alt text oluşturur
 */
export function generateBackgroundAltText(
  spreadName: string,
  locale: 'tr' | 'en' | 'sr' = 'tr'
): string {
  const contextText =
    locale === 'tr'
      ? 'Tarot falı açılımı için mistik arka plan görseli'
      : locale === 'en'
        ? 'Mystical background image for tarot reading spread'
        : 'Mistična pozadinska slika za tarot raspored';

  return `${spreadName} - ${contextText}`;
}

/**
 * Logo görseli için alt text oluşturur
 */
export function generateLogoAltText(locale: 'tr' | 'en' | 'sr' = 'tr'): string {
  return locale === 'tr'
    ? 'Büşbüşkimki - Profesyonel Tarot ve Numeroloji Logo'
    : locale === 'en'
      ? 'Büşbüşkimki - Professional Tarot and Numerology Logo'
      : 'Büşbüşkimki - Profesionalna Tarot i Numerologija Logo';
}

/**
 * Icon görseli için alt text oluşturur
 */
export function generateIconAltText(
  iconName: string,
  locale: 'tr' | 'en' | 'sr' = 'tr'
): string {
  const iconText =
    locale === 'tr' ? 'ikonu' : locale === 'en' ? 'icon' : 'ikona';

  return `${iconName} ${iconText}`;
}

/**
 * OG Image (sosyal medya paylaşım görseli) için alt text oluşturur
 */
export function generateOGImageAltText(
  pageTitle: string,
  locale: 'tr' | 'en' | 'sr' = 'tr'
): string {
  const contextText =
    locale === 'tr'
      ? 'Büşbüşkimki - Profesyonel Tarot ve Numeroloji'
      : locale === 'en'
        ? 'Büşbüşkimki - Professional Tarot and Numerology'
        : 'Büşbüşkimki - Profesionalna Tarot i Numerologija';

  return `${pageTitle} | ${contextText}`;
}

/**
 * Kart arka yüzü için alt text
 */
export function generateCardBackAltText(
  locale: 'tr' | 'en' | 'sr' = 'tr'
): string {
  return locale === 'tr'
    ? 'Tarot kartı arka yüzü - Kapalı kart'
    : locale === 'en'
      ? 'Tarot card back - Closed card'
      : 'Poleđina tarot karte - Zatvorena karta';
}
