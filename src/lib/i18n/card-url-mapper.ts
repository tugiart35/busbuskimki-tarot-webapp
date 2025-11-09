/**
 * Card URL Mapper - Kart sayfaları için dil alternatifleri oluşturur
 *
 * Bu dosya, kart sayfalarında dil değiştirme işlemlerinde doğru slug'ları kullanmak için
 * slug mapping'lerini sağlar.
 */

// Tüm kartların slug mapping'i - BlogCardService'ten alınan verilerle uyumlu
const SLUG_TO_CARD_ID: { [key: string]: string } = {
  // English slugs
  'the-fool': 'the-fool',
  'the-high-priestess': 'the-high-priestess',
  'the-magician': 'the-magician',
  'the-empress': 'the-empress',
  'the-emperor': 'the-emperor',
  'the-hierophant': 'the-hierophant',
  'the-lovers': 'the-lovers',
  'the-chariot': 'the-chariot',
  strength: 'strength',
  'the-hermit': 'the-hermit',
  wheeloffortune: 'wheeloffortune',
  justice: 'justice',
  'the-hanged-man': 'the-hanged-man',
  death: 'death',
  temperance: 'temperance',
  'the-devil': 'the-devil',
  'the-tower': 'the-tower',
  'the-star': 'the-star',
  'the-moon': 'the-moon',
  'the-sun': 'the-sun',
  Judgement: 'Judgement',
  'the-world': 'the-world',

  // Turkish slugs
  joker: 'the-fool',
  'yuksek-rahibe': 'the-high-priestess',
  buyucu: 'the-magician',
  imparatorice: 'the-empress',
  imparator: 'the-emperor',
  basrahip: 'the-hierophant',
  asiklar: 'the-lovers',
  'savas-arabasi': 'the-chariot',
  guc: 'strength',
  ermis: 'the-hermit',
  'kader-carki': 'wheeloffortune',
  adalet: 'justice',
  'asili-adam': 'the-hanged-man',
  olum: 'death',
  olcululuk: 'temperance',
  seytan: 'the-devil',
  kule: 'the-tower',
  yildiz: 'the-star',
  ay: 'the-moon',
  gunes: 'the-sun',
  yargi: 'Judgement',
  dunya: 'the-world',

  // Serbian slugs
  'visoka-svestenica': 'the-high-priestess',
  carobnjak: 'the-magician',
  carica: 'the-empress',
  car: 'the-emperor',
  prvosveštenica: 'the-hierophant',
  ljubavnici: 'the-lovers',
  'ratna-kolica': 'the-chariot',
  snaga: 'strength',
  pustinjak: 'the-hermit',
  'kolo-srece': 'wheeloffortune',
  pravda: 'justice',
  obeseni: 'the-hanged-man',
  smrt: 'death',
  umerenost: 'temperance',
  djavol: 'the-devil',
  kula: 'the-tower',
  zvezda: 'the-star',
  mesec: 'the-moon',
  sunce: 'the-sun',
  sud: 'Judgement',
  svet: 'the-world',

  // Cups suit - Turkish
  'kupalar-asi': 'ace-of-cups',
  'kupalar-ikili': 'two-of-cups',
  'kupalar-uclu': 'three-of-cups',
  'kupalar-dortlu': 'four-of-cups',
  'kupalar-besli': 'five-of-cups',
  'kupalar-altili': 'six-of-cups',
  'kupalar-yedili': 'seven-of-cups',
  'kupalar-sekizli': 'eight-of-cups',
  'kupalar-dokuzlu': 'nine-of-cups',
  'kupalar-onlu': 'ten-of-cups',
  'kupalar-prensi': 'page-of-cups',
  'kupalar-sovalyesi': 'knight-of-cups',
  'kupalar-kralicesi': 'queen-of-cups',
  'kupalar-krali': 'king-of-cups',

  // Cups suit - English
  'ace-of-cups': 'ace-of-cups',
  'two-of-cups': 'two-of-cups',
  'three-of-cups': 'three-of-cups',
  'four-of-cups': 'four-of-cups',
  'five-of-cups': 'five-of-cups',
  'six-of-cups': 'six-of-cups',
  'seven-of-cups': 'seven-of-cups',
  'eight-of-cups': 'eight-of-cups',
  'nine-of-cups': 'nine-of-cups',
  'ten-of-cups': 'ten-of-cups',
  'page-of-cups': 'page-of-cups',
  'knight-of-cups': 'knight-of-cups',
  'queen-of-cups': 'queen-of-cups',
  'king-of-cups': 'king-of-cups',

  // Cups suit - Serbian
  'kupa-as': 'ace-of-cups',
  'kupa-dvojka': 'two-of-cups',
  'kupa-trojka': 'three-of-cups',
  'kupa-cetvorka': 'four-of-cups',
  'kupa-petica': 'five-of-cups',
  'kupa-sestica': 'six-of-cups',
  'kupa-sedmica': 'seven-of-cups',
  'kupa-osmica': 'eight-of-cups',
  'kupa-devetka': 'nine-of-cups',
  'kupa-desetka': 'ten-of-cups',
  'kupa-paz': 'page-of-cups',
  'kupa-vitez': 'knight-of-cups',
  'kupa-kraljica': 'queen-of-cups',
  'kupa-kralj': 'king-of-cups',

  // Swords suit - Turkish
  'kiliclar-asi': 'ace-of-swords',
  'kiliclar-ikili': 'two-of-swords',
  'kiliclar-uclu': 'three-of-swords',
  'kiliclar-dortlu': 'four-of-swords',
  'kiliclar-besli': 'five-of-swords',
  'kiliclar-altili': 'six-of-swords',
  'kiliclar-yedili': 'seven-of-swords',
  'kiliclar-sekizli': 'eight-of-swords',
  'kiliclar-dokuzlu': 'nine-of-swords',
  'kiliclar-onlu': 'ten-of-swords',
  'kiliclar-prensi': 'page-of-swords',
  'kiliclar-sovalyesi': 'knight-of-swords',
  'kiliclar-kralicesi': 'queen-of-swords',
  'kiliclar-krali': 'king-of-swords',

  // Swords suit - English
  'ace-of-swords': 'ace-of-swords',
  'two-of-swords': 'two-of-swords',
  'three-of-swords': 'three-of-swords',
  'four-of-swords': 'four-of-swords',
  'five-of-swords': 'five-of-swords',
  'six-of-swords': 'six-of-swords',
  'seven-of-swords': 'seven-of-swords',
  'eight-of-swords': 'eight-of-swords',
  'nine-of-swords': 'nine-of-swords',
  'ten-of-swords': 'ten-of-swords',
  'page-of-swords': 'page-of-swords',
  'knight-of-swords': 'knight-of-swords',
  'queen-of-swords': 'queen-of-swords',
  'king-of-swords': 'king-of-swords',

  // Swords suit - Serbian
  'mace-as': 'ace-of-swords',
  'mace-dvojka': 'two-of-swords',
  'mace-trojka': 'three-of-swords',
  'mace-cetvorka': 'four-of-swords',
  'mace-petica': 'five-of-swords',
  'mace-sestica': 'six-of-swords',
  'mace-sedmica': 'seven-of-swords',
  'mace-osmica': 'eight-of-swords',
  'mace-devetka': 'nine-of-swords',
  'mace-desetka': 'ten-of-swords',
  'mace-paz': 'page-of-swords',
  'mace-vitez': 'knight-of-swords',
  'mace-kraljica': 'queen-of-swords',
  'mace-kralj': 'king-of-swords',

  // Wands suit - Turkish
  'asalar-asi': 'ace-of-wands',
  'asalar-ikili': 'two-of-wands',
  'asalar-uclu': 'three-of-wands',
  'asalar-dortlu': 'four-of-wands',
  'asalar-besli': 'five-of-wands',
  'asalar-altili': 'six-of-wands',
  'asalar-yedili': 'seven-of-wands',
  'asalar-sekizli': 'eight-of-wands',
  'asalar-dokuzlu': 'nine-of-wands',
  'asalar-onlu': 'ten-of-wands',
  'asalar-prensi': 'page-of-wands',
  'asalar-sovalyesi': 'knight-of-wands',
  'asalar-kralicesi': 'queen-of-wands',
  'asalar-krali': 'king-of-wands',

  // Wands suit - English
  'ace-of-wands': 'ace-of-wands',
  'two-of-wands': 'two-of-wands',
  'three-of-wands': 'three-of-wands',
  'four-of-wands': 'four-of-wands',
  'five-of-wands': 'five-of-wands',
  'six-of-wands': 'six-of-wands',
  'seven-of-wands': 'seven-of-wands',
  'eight-of-wands': 'eight-of-wands',
  'nine-of-wands': 'nine-of-wands',
  'ten-of-wands': 'ten-of-wands',
  'page-of-wands': 'page-of-wands',
  'knight-of-wands': 'knight-of-wands',
  'queen-of-wands': 'queen-of-wands',
  'king-of-wands': 'king-of-wands',

  // Wands suit - Serbian
  'stap-as': 'ace-of-wands',
  'stap-dvojka': 'two-of-wands',
  'stap-trojka': 'three-of-wands',
  'stap-cetvorka': 'four-of-wands',
  'stap-petica': 'five-of-wands',
  'stap-sestica': 'six-of-wands',
  'stap-sedmica': 'seven-of-wands',
  'stap-osmica': 'eight-of-wands',
  'stap-devetka': 'nine-of-wands',
  'stap-desetka': 'ten-of-wands',
  'stap-paz': 'page-of-wands',
  'stap-vitez': 'knight-of-wands',
  'stap-kraljica': 'queen-of-wands',
  'stap-kralj': 'king-of-wands',

  // Pentacles suit - Turkish
  'yildizlar-asi': 'ace-of-pentacles',
  'yildizlar-ikili': 'two-of-pentacles',
  'yildizlar-uclu': 'three-of-pentacles',
  'yildizlar-dortlu': 'four-of-pentacles',
  'yildizlar-besli': 'five-of-pentacles',
  'yildizlar-altili': 'six-of-pentacles',
  'yildizlar-yedili': 'seven-of-pentacles',
  'yildizlar-sekizli': 'eight-of-pentacles',
  'yildizlar-dokuzlu': 'nine-of-pentacles',
  'yildizlar-onlu': 'ten-of-pentacles',
  'yildizlar-prensi': 'page-of-pentacles',
  'yildizlar-sovalyesi': 'knight-of-pentacles',
  'yildizlar-kralicesi': 'queen-of-pentacles',
  'yildizlar-krali': 'king-of-pentacles',

  // Pentacles suit - English
  'ace-of-pentacles': 'ace-of-pentacles',
  'two-of-pentacles': 'two-of-pentacles',
  'three-of-pentacles': 'three-of-pentacles',
  'four-of-pentacles': 'four-of-pentacles',
  'five-of-pentacles': 'five-of-pentacles',
  'six-of-pentacles': 'six-of-pentacles',
  'seven-of-pentacles': 'seven-of-pentacles',
  'eight-of-pentacles': 'eight-of-pentacles',
  'nine-of-pentacles': 'nine-of-pentacles',
  'ten-of-pentacles': 'ten-of-pentacles',
  'page-of-pentacles': 'page-of-pentacles',
  'knight-of-pentacles': 'knight-of-pentacles',
  'queen-of-pentacles': 'queen-of-pentacles',
  'king-of-pentacles': 'king-of-pentacles',

  // Pentacles suit - Serbian
  'novcic-as': 'ace-of-pentacles',
  'novcic-dvojka': 'two-of-pentacles',
  'novcic-trojka': 'three-of-pentacles',
  'novcic-cetvorka': 'four-of-pentacles',
  'novcic-petica': 'five-of-pentacles',
  'novcic-sestica': 'six-of-pentacles',
  'novcic-sedmica': 'seven-of-pentacles',
  'novcic-osmica': 'eight-of-pentacles',
  'novcic-devetka': 'nine-of-pentacles',
  'novcic-desetka': 'ten-of-pentacles',
  'novcic-paz': 'page-of-pentacles',
  'novcic-vitez': 'knight-of-pentacles',
  'novcic-kraljica': 'queen-of-pentacles',
  'novcic-kralj': 'king-of-pentacles',
};

// Card ID'den her dildeki slug'a mapping
const CARD_ID_TO_SLUGS: {
  [cardId: string]: { tr: string; en: string; sr: string };
} = {
  'the-fool': { tr: 'joker', en: 'the-fool', sr: 'joker' },
  'the-high-priestess': {
    tr: 'yuksek-rahibe',
    en: 'the-high-priestess',
    sr: 'visoka-svestenica',
  },
  'the-magician': { tr: 'buyucu', en: 'the-magician', sr: 'carobnjak' },
  'the-empress': { tr: 'imparatorice', en: 'the-empress', sr: 'carica' },
  'the-emperor': { tr: 'imparator', en: 'the-emperor', sr: 'car' },
  'the-hierophant': {
    tr: 'basrahip',
    en: 'the-hierophant',
    sr: 'prvosveštenica',
  },
  'the-lovers': { tr: 'asiklar', en: 'the-lovers', sr: 'ljubavnici' },
  'the-chariot': { tr: 'savas-arabasi', en: 'the-chariot', sr: 'ratna-kolica' },
  strength: { tr: 'guc', en: 'strength', sr: 'snaga' },
  'the-hermit': { tr: 'ermis', en: 'the-hermit', sr: 'pustinjak' },
  wheeloffortune: {
    tr: 'kader-carki',
    en: 'wheeloffortune',
    sr: 'kolo-srece',
  },
  justice: { tr: 'adalet', en: 'justice', sr: 'pravda' },
  'the-hanged-man': { tr: 'asili-adam', en: 'the-hanged-man', sr: 'obeseni' },
  death: { tr: 'olum', en: 'death', sr: 'smrt' },
  temperance: { tr: 'olcululuk', en: 'temperance', sr: 'umerenost' },
  'the-devil': { tr: 'seytan', en: 'the-devil', sr: 'djavol' },
  'the-tower': { tr: 'kule', en: 'the-tower', sr: 'kula' },
  'the-star': { tr: 'yildiz', en: 'the-star', sr: 'zvezda' },
  'the-moon': { tr: 'ay', en: 'the-moon', sr: 'mesec' },
  'the-sun': { tr: 'gunes', en: 'the-sun', sr: 'sunce' },
  Judgement: { tr: 'yargi', en: 'Judgement', sr: 'sud' },
  'the-world': { tr: 'dunya', en: 'the-world', sr: 'svet' },

  // Cups
  'ace-of-cups': { tr: 'kupalar-asi', en: 'ace-of-cups', sr: 'kupa-as' },
  'two-of-cups': { tr: 'kupalar-ikili', en: 'two-of-cups', sr: 'kupa-dvojka' },
  'three-of-cups': {
    tr: 'kupalar-uclu',
    en: 'three-of-cups',
    sr: 'kupa-trojka',
  },
  'four-of-cups': {
    tr: 'kupalar-dortlu',
    en: 'four-of-cups',
    sr: 'kupa-cetvorka',
  },
  'five-of-cups': {
    tr: 'kupalar-besli',
    en: 'five-of-cups',
    sr: 'kupa-petica',
  },
  'six-of-cups': {
    tr: 'kupalar-altili',
    en: 'six-of-cups',
    sr: 'kupa-sestica',
  },
  'seven-of-cups': {
    tr: 'kupalar-yedili',
    en: 'seven-of-cups',
    sr: 'kupa-sedmica',
  },
  'eight-of-cups': {
    tr: 'kupalar-sekizli',
    en: 'eight-of-cups',
    sr: 'kupa-osmica',
  },
  'nine-of-cups': {
    tr: 'kupalar-dokuzlu',
    en: 'nine-of-cups',
    sr: 'kupa-devetka',
  },
  'ten-of-cups': { tr: 'kupalar-onlu', en: 'ten-of-cups', sr: 'kupa-desetka' },
  'page-of-cups': { tr: 'kupalar-prensi', en: 'page-of-cups', sr: 'kupa-paz' },
  'knight-of-cups': {
    tr: 'kupalar-sovalyesi',
    en: 'knight-of-cups',
    sr: 'kupa-vitez',
  },
  'queen-of-cups': {
    tr: 'kupalar-kralicesi',
    en: 'queen-of-cups',
    sr: 'kupa-kraljica',
  },
  'king-of-cups': { tr: 'kupalar-krali', en: 'king-of-cups', sr: 'kupa-kralj' },

  // Swords
  'ace-of-swords': { tr: 'kiliclar-asi', en: 'ace-of-swords', sr: 'mace-as' },
  'two-of-swords': {
    tr: 'kiliclar-ikili',
    en: 'two-of-swords',
    sr: 'mace-dvojka',
  },
  'three-of-swords': {
    tr: 'kiliclar-uclu',
    en: 'three-of-swords',
    sr: 'mace-trojka',
  },
  'four-of-swords': {
    tr: 'kiliclar-dortlu',
    en: 'four-of-swords',
    sr: 'mace-cetvorka',
  },
  'five-of-swords': {
    tr: 'kiliclar-besli',
    en: 'five-of-swords',
    sr: 'mace-petica',
  },
  'six-of-swords': {
    tr: 'kiliclar-altili',
    en: 'six-of-swords',
    sr: 'mace-sestica',
  },
  'seven-of-swords': {
    tr: 'kiliclar-yedili',
    en: 'seven-of-swords',
    sr: 'mace-sedmica',
  },
  'eight-of-swords': {
    tr: 'kiliclar-sekizli',
    en: 'eight-of-swords',
    sr: 'mace-osmica',
  },
  'nine-of-swords': {
    tr: 'kiliclar-dokuzlu',
    en: 'nine-of-swords',
    sr: 'mace-devetka',
  },
  'ten-of-swords': {
    tr: 'kiliclar-onlu',
    en: 'ten-of-swords',
    sr: 'mace-desetka',
  },
  'page-of-swords': {
    tr: 'kiliclar-prensi',
    en: 'page-of-swords',
    sr: 'mace-paz',
  },
  'knight-of-swords': {
    tr: 'kiliclar-sovalyesi',
    en: 'knight-of-swords',
    sr: 'mace-vitez',
  },
  'queen-of-swords': {
    tr: 'kiliclar-kralicesi',
    en: 'queen-of-swords',
    sr: 'mace-kraljica',
  },
  'king-of-swords': {
    tr: 'kiliclar-krali',
    en: 'king-of-swords',
    sr: 'mace-kralj',
  },

  // Wands
  'ace-of-wands': { tr: 'asalar-asi', en: 'ace-of-wands', sr: 'stap-as' },
  'two-of-wands': { tr: 'asalar-ikili', en: 'two-of-wands', sr: 'stap-dvojka' },
  'three-of-wands': {
    tr: 'asalar-uclu',
    en: 'three-of-wands',
    sr: 'stap-trojka',
  },
  'four-of-wands': {
    tr: 'asalar-dortlu',
    en: 'four-of-wands',
    sr: 'stap-cetvorka',
  },
  'five-of-wands': {
    tr: 'asalar-besli',
    en: 'five-of-wands',
    sr: 'stap-petica',
  },
  'six-of-wands': {
    tr: 'asalar-altili',
    en: 'six-of-wands',
    sr: 'stap-sestica',
  },
  'seven-of-wands': {
    tr: 'asalar-yedili',
    en: 'seven-of-wands',
    sr: 'stap-sedmica',
  },
  'eight-of-wands': {
    tr: 'asalar-sekizli',
    en: 'eight-of-wands',
    sr: 'stap-osmica',
  },
  'nine-of-wands': {
    tr: 'asalar-dokuzlu',
    en: 'nine-of-wands',
    sr: 'stap-devetka',
  },
  'ten-of-wands': { tr: 'asalar-onlu', en: 'ten-of-wands', sr: 'stap-desetka' },
  'page-of-wands': { tr: 'asalar-prensi', en: 'page-of-wands', sr: 'stap-paz' },
  'knight-of-wands': {
    tr: 'asalar-sovalyesi',
    en: 'knight-of-wands',
    sr: 'stap-vitez',
  },
  'queen-of-wands': {
    tr: 'asalar-kralicesi',
    en: 'queen-of-wands',
    sr: 'stap-kraljica',
  },
  'king-of-wands': {
    tr: 'asalar-krali',
    en: 'king-of-wands',
    sr: 'stap-kralj',
  },

  // Pentacles
  'ace-of-pentacles': {
    tr: 'yildizlar-asi',
    en: 'ace-of-pentacles',
    sr: 'novcic-as',
  },
  'two-of-pentacles': {
    tr: 'yildizlar-ikili',
    en: 'two-of-pentacles',
    sr: 'novcic-dvojka',
  },
  'three-of-pentacles': {
    tr: 'yildizlar-uclu',
    en: 'three-of-pentacles',
    sr: 'novcic-trojka',
  },
  'four-of-pentacles': {
    tr: 'yildizlar-dortlu',
    en: 'four-of-pentacles',
    sr: 'novcic-cetvorka',
  },
  'five-of-pentacles': {
    tr: 'yildizlar-besli',
    en: 'five-of-pentacles',
    sr: 'novcic-petica',
  },
  'six-of-pentacles': {
    tr: 'yildizlar-altili',
    en: 'six-of-pentacles',
    sr: 'novcic-sestica',
  },
  'seven-of-pentacles': {
    tr: 'yildizlar-yedili',
    en: 'seven-of-pentacles',
    sr: 'novcic-sedmica',
  },
  'eight-of-pentacles': {
    tr: 'yildizlar-sekizli',
    en: 'eight-of-pentacles',
    sr: 'novcic-osmica',
  },
  'nine-of-pentacles': {
    tr: 'yildizlar-dokuzlu',
    en: 'nine-of-pentacles',
    sr: 'novcic-devetka',
  },
  'ten-of-pentacles': {
    tr: 'yildizlar-onlu',
    en: 'ten-of-pentacles',
    sr: 'novcic-desetka',
  },
  'page-of-pentacles': {
    tr: 'yildizlar-prensi',
    en: 'page-of-pentacles',
    sr: 'novcic-paz',
  },
  'knight-of-pentacles': {
    tr: 'yildizlar-sovalyesi',
    en: 'knight-of-pentacles',
    sr: 'novcic-vitez',
  },
  'queen-of-pentacles': {
    tr: 'yildizlar-kralicesi',
    en: 'queen-of-pentacles',
    sr: 'novcic-kraljica',
  },
  'king-of-pentacles': {
    tr: 'yildizlar-krali',
    en: 'king-of-pentacles',
    sr: 'novcic-kralj',
  },
};

/**
 * Verilen pathname bir kart sayfası mı kontrol eder
 */
export function isCardPage(pathname: string): boolean {
  return /\/(tr|en|sr)\/(kartlar|cards|kartice)\/[^\/]+/.test(pathname);
}

/**
 * Verilen pathname'den kart slug'ını çıkarır
 */
export function extractCardSlug(pathname: string): string | null {
  const match = pathname.match(
    /\/(tr|en|sr)\/(kartlar|cards|kartice)\/([^\/]+)/
  );
  return match?.[3] ?? null;
}

/**
 * Bir kart sayfası için tüm dillerdeki URL'leri döndürür
 *
 * @param pathname - Mevcut pathname (örn: /tr/kartlar/imparatorice)
 * @returns Tüm dillerdeki URL'ler veya null (kart sayfası değilse)
 */
export function getCardAlternateUrls(
  pathname: string
): { tr: string; en: string; sr: string } | null {
  // Kart sayfası mı kontrol et
  if (!isCardPage(pathname)) {
    return null;
  }

  // Slug'ı çıkar
  const currentSlug = extractCardSlug(pathname);
  if (!currentSlug) {
    return null;
  }

  // Card ID'yi bul
  const cardId = SLUG_TO_CARD_ID[currentSlug];
  if (!cardId) {
    return null;
  }

  // Tüm dillerdeki slug'ları bul
  const slugs = CARD_ID_TO_SLUGS[cardId];
  if (!slugs) {
    return null;
  }

  // URL'leri oluştur
  return {
    tr: `/tr/kartlar/${slugs.tr}`,
    en: `/en/cards/${slugs.en}`,
    sr: `/sr/kartice/${slugs.sr}`,
  };
}

/**
 * Belirli bir slug için card ID'yi döndürür
 */
export function getCardIdFromSlug(slug: string): string | null {
  return SLUG_TO_CARD_ID[slug] || null;
}

/**
 * Belirli bir card ID için tüm dillerdeki slug'ları döndürür
 */
export function getSlugsForCardId(
  cardId: string
): { tr: string; en: string; sr: string } | null {
  return CARD_ID_TO_SLUGS[cardId] || null;
}

/**
 * Kart için full URL'leri oluşturur (metadata için)
 */
export function getCardAlternateFullUrls(cardId: string): {
  tr: string;
  en: string;
  sr: string;
} | null {
  const slugs = CARD_ID_TO_SLUGS[cardId];
  if (!slugs) {
    return null;
  }

  const baseUrl = 'https://busbuskimki.com';
  return {
    tr: `${baseUrl}/tr/kartlar/${slugs.tr}`,
    en: `${baseUrl}/en/cards/${slugs.en}`,
    sr: `${baseUrl}/sr/kartice/${slugs.sr}`,
  };
}
