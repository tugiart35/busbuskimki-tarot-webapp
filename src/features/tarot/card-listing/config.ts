import type { Metadata } from 'next';

export type SupportedLocale = 'tr' | 'en' | 'sr';
export type RouteVariant = 'cards' | 'kartlar' | 'kartice';

export const LOCALE_ROUTE_SEGMENT: Record<SupportedLocale, RouteVariant> = {
  en: 'cards',
  tr: 'kartlar',
  sr: 'kartice',
};

export const LOCALE_URLS: Record<SupportedLocale, string> = {
  en: 'https://busbuskimki.com/en/cards',
  tr: 'https://busbuskimki.com/tr/kartlar',
  sr: 'https://busbuskimki.com/sr/kartice',
};

export const LAST_UPDATED = '2025-11-12';

export interface FAQEntry {
  question: string;
  answer: string;
}

export const FAQ_ENTRIES: Record<SupportedLocale, FAQEntry[]> = {
  tr: [
    {
      question: 'Tarot kartları kaç karttan oluşur ve nasıl sınıflandırılır?',
      answer:
        'Klasik Rider–Waite destesi 78 karttan oluşur: 22 Major Arcana kartı yaşamın büyük temalarını temsil eder, 56 Minor Arcana kartı ise günlük hayatınızın ritmini ve kararlarını anlatır. Büsbüşkimki ekibi her kartın anlamını hem düz hem ters pozisyonda ayrı ayrı yorumlar.',
    },
    {
      question:
        'Bu kart yorumları profesyonel tarot uzmanları tarafından mı hazırlanıyor?',
      answer:
        'Evet. İçeriklerimiz 12+ yıllık tarot tecrübesi olan Mina Kaya tarafından yazılıyor ve psikoloji danışmanı Dr. Selin Yüzbaşıoğlu tarafından kontrol ediliyor. Her metin üç aşamalı editoryal süreçten geçiyor ve yılda en az dört kez güncelleniyor.',
    },
    {
      question: 'Tarot açılımı sonuçlarını hayatımda nasıl kullanmalıyım?',
      answer:
        'Tarot, sezgisel farkındalığınızı güçlendiren rehberlik aracıdır. Büsbüşkimki’de paylaşılan yorumlar finansal, hukuki veya tıbbi tavsiye yerine geçmez. Kararlarınızı alırken profesyonel danışmanlık almaktan çekinmeyin.',
    },
  ],
  en: [
    {
      question:
        'How many cards are in a tarot deck and how are they organised?',
      answer:
        'A classic Rider–Waite deck includes 78 cards: 22 Major Arcana that map out pivotal life lessons and 56 Minor Arcana that reflect everyday situations. Our editorial team documents upright and reversed meanings for every card to support accurate readings.',
    },
    {
      question:
        'Who writes and fact-checks the tarot interpretations on this page?',
      answer:
        'All articles are authored by Mina Kaya, a senior tarot reader with 12+ years of practice, and fact-checked by counselling psychologist Dr. Selin Yüzbaşıoğlu. Each update passes a three-step editorial workflow before publication.',
    },
    {
      question: 'How should I apply these insights to my personal decisions?',
      answer:
        'Tarot offers reflective guidance rather than deterministic answers. Use the card meanings as inspiration, not as financial, legal, or medical advice. Please consult relevant professionals before making critical decisions.',
    },
  ],
  sr: [
    {
      question: 'Koliko karata sadrži tarot špil i kako su podeljene?',
      answer:
        'Standardni Rider–Waite špil ima 78 karata: 22 Major Arkanе koje prikazuju velike životne lekcije i 56 Minor Arkanе koje prate svakodnevne situacije. Naš tim opisuje značenja u uspravnom i obrnutom položaju kako bi čitanja bila precizna.',
    },
    {
      question: 'Ko priprema i proverava tumačenja tarota na ovoj strani?',
      answer:
        'Sadržaj piše Mina Kaya, iskusni tarot tumač sa više od 12 godina prakse, a proverava ga psihološki savetnik dr Selin Yüzbaşıoğlu. Svaka verzija prolazi kroz trostepeni urednički proces pre objave.',
    },
    {
      question: 'Kako da primenim ova tumačenja u svakodnevnom životu?',
      answer:
        'Tarot pruža intuitivno usmerenje, ali ne daje konačne odgovore. Posmatrajte značenja kao inspiraciju, ne kao finansijski, pravni ili medicinski savet. Za važne odluke uvek se posavetujte sa stručnjacima.',
    },
  ],
};

export interface TranslationContent {
  title: string;
  subtitle: string;
  majorArcana: string;
  minorArcana: string;
  majorArcanaDescription: string;
  minorArcanaDescription: string;
  viewCard: string;
  totalCards: string;
  cardsCount: string;
  majorArcanaCount: string;
  minorArcanaCount: string;
  freeTarotBadge: string;
  drawCardsTitle: string;
  drawCardsDescription: string;
  drawCardsButton: string;
  pageReactionsTitle: string;
  popularSectionLabel: string;
  popularSectionTitle: string;
  popularSectionSubtitle: string;
  expertSectionTitle: string;
  expertName: string;
  expertRole: string;
  expertBio: string;
  factCheckLabel: string;
  factCheckValue: string;
  updateLabel: string;
  updateValue: string;
  trustSignalsTitle: string;
  trustSignals: string[];
  moderationTitle: string;
  moderationBody: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  adsPolicyTitle: string;
  adsPolicyBody: string;
}

export const CARD_LISTING_TRANSLATIONS: Record<
  SupportedLocale,
  TranslationContent
> = {
  tr: {
    title: 'Tarot Kartları',
    subtitle:
      '78 tarot kartının anlamları, ters yorumları, semboller, kombinasyonlar ve günlük pratiklerle tam rehber.',
    majorArcana: 'Major Arcana (22 Kart)',
    minorArcana: 'Minor Arcana (56 Kart)',
    majorArcanaDescription:
      'Major Arcana kartları ruhsal yolculuğunuzdaki büyük dönüm noktalarını temsil eder. Her kart için kapsamlı anlam, ters yorum ve gerçek hayattan örnekler sağlıyoruz.',
    minorArcanaDescription:
      'Minor Arcana kartları günlük hayatınızdaki duygusal, zihinsel, maddi ve yaratıcı akışı yansıtır. Her suit için olumlu/olumsuz açılım cümleleri ve eylem önerileri sunuyoruz.',
    viewCard: 'Kartı Görüntüle',
    totalCards: 'Toplam 78 Kart',
    cardsCount: '✨ 78 Tarot Kartı',
    majorArcanaCount: 'Major Arcana: 22',
    minorArcanaCount: 'Minor Arcana: 56',
    freeTarotBadge: '✨ Ücretsiz Tarot Açılımı',
    drawCardsTitle: 'Kendi Tarot Kartlarını Çek',
    drawCardsDescription:
      'Günlük, aşk ve kariyer temalı açılımlarla sezgisel rehberliğini hemen keşfet.',
    drawCardsButton: 'Açılımı Başlat',
    pageReactionsTitle: 'Major Arcana kartlarını nasıl buldunuz?',
    popularSectionLabel: 'En Popüler',
    popularSectionTitle: 'En Çok İlgi Gören Kartlar',
    popularSectionSubtitle:
      'Topluluğumuzun en çok merak ettiği ve incelediği tarot kartları',
    expertSectionTitle: 'Uzman Ekibimiz ve Editoryal Güvence',
    expertName: 'Mina Kaya',
    expertRole: 'Kıdemli Tarot Uzmanı & Editör',
    expertBio:
      'Mina Kaya 12 yıldır profesyonel tarot danışmanlığı yapıyor ve Jungyen psikoloji eğitimini Rider–Waite yorumlarına entegre ediyor. 2019’dan bu yana Büsbüşkimki içerik ekibini yönetiyor.',
    factCheckLabel: 'İçerik doğrulayan',
    factCheckValue: 'Dr. Selin Yüzbaşıoğlu (Psikolojik Danışman)',
    updateLabel: 'Son güncelleme',
    updateValue: '12 Kasım 2025',
    trustSignalsTitle: 'Neden Bize Güvenebilirsiniz?',
    trustSignals: [
      'Her kart yorumu akademik kaynaklara ve gerçek danışan vakalarına dayanır.',
      'Tüm yazılar dil, etik ve kullanıcı güvenliği kontrollerinden geçer.',
      'Görseller lisanslı Rider–Waite Smith destesi üzerinden işlenmiştir; telif bilgisi meta verilerde belirtilir.',
    ],
    moderationTitle: 'Yorum Politikası',
    moderationBody:
      'Topluluk yorumları ön moderasyondan geçer ve nefret söylemi, kişisel veri veya yanıltıcı sağlık/finans tavsiyelerine izin verilmez.',
    disclaimerTitle: 'Yasal Uyarı',
    disclaimerBody:
      'Tarot yorumları eğlence ve kişisel farkındalık amaçlıdır. Finansal, hukuki ya da tıbbi tavsiye yerine geçmez; ihtiyaç duyarsanız yetkin bir uzmana başvurun.',
    adsPolicyTitle: 'Reklam Şeffaflığı',
    adsPolicyBody:
      'Google AdSense kurallarına uygun olarak içerik içinde yanıltıcı, yetişkin veya telif ihlalli materyal barındırmıyoruz. Sponsorluklu içerikler ayrı etiketlenir.',
  },
  en: {
    title: 'Tarot Cards',
    subtitle:
      'A complete guide to the meanings of all 78 tarot cards, their reversed interpretations, symbols, combinations, and daily practices.',
    majorArcana: 'Major Arcana (22 Cards)',
    minorArcana: 'Minor Arcana (56 Cards)',
    majorArcanaDescription:
      'Major Arcana cards highlight transformational chapters in your spiritual journey. Each profile includes symbolism, reversed interpretations, and journaling prompts.',
    minorArcanaDescription:
      'Minor Arcana suits mirror how feelings, thoughts, resources, and creativity flow through everyday life. Explore actionable advice for each card.',
    viewCard: 'View Card',
    totalCards: 'Total 78 Cards',
    cardsCount: '✨ 78 Tarot Cards',
    majorArcanaCount: 'Major Arcana: 22',
    minorArcanaCount: 'Minor Arcana: 56',
    freeTarotBadge: '✨ Free Tarot Reading',
    drawCardsTitle: 'Draw Your Personal Spread',
    drawCardsDescription:
      'Start a free tarot reading to receive guided messages for love, career, and daily decisions.',
    drawCardsButton: 'Start a Reading',
    pageReactionsTitle: 'How helpful are these Major Arcana insights?',
    popularSectionLabel: 'Most Popular',
    popularSectionTitle: 'Most Viewed Cards',
    popularSectionSubtitle:
      'The tarot cards our community explores and studies the most',
    expertSectionTitle: 'Editorial Team & Trust Signals',
    expertName: 'Mina Kaya',
    expertRole: 'Senior Tarot Reader & Managing Editor',
    expertBio:
      'Mina Kaya has provided professional tarot guidance for more than 12 years and integrates Jungian techniques into Rider–Waite interpretations. She has led the Büsbüşkimki editorial team since 2019.',
    factCheckLabel: 'Fact-checked by',
    factCheckValue: 'Dr. Selin Yüzbaşıoğlu (Counselling Psychologist)',
    updateLabel: 'Last updated',
    updateValue: '12 November 2025',
    trustSignalsTitle: 'Why You Can Trust This Page',
    trustSignals: [
      'Every interpretation references peer-reviewed psychology sources and anonymised client case studies.',
      'All articles pass language, ethics, and user-safety reviews before publication.',
      'Images are licensed from the Rider–Waite Smith deck with attribution noted in metadata.',
    ],
    moderationTitle: 'Community Moderation',
    moderationBody:
      'Comments are pre-moderated; hate speech, personal data, or misleading health/finance claims are removed in line with Google AdSense policies.',
    disclaimerTitle: 'Disclaimer',
    disclaimerBody:
      'Tarot readings offer reflective guidance only. They do not replace financial, legal, or medical advice. Always consult qualified professionals when needed.',
    adsPolicyTitle: 'Ad Transparency',
    adsPolicyBody:
      'We comply with Google AdSense rules—no misleading, adult, or copyright-infringing material is served. Sponsored placements are clearly labelled.',
  },
  sr: {
    title: 'Tarot Karte',
    subtitle:
      'Potpuni vodič kroz 78 tarot karata: značenja, obrnuta tumačenja, simbole, kombinacije i svakodnevne rituale.',
    majorArcana: 'Major Arcana (22 Karte)',
    minorArcana: 'Minor Arcana (56 Karata)',
    majorArcanaDescription:
      'Major Arcana karte prikazuju ključne prekretnice duhovnog puta. Za svaku kartu nudimo simboliku, obrnuto značenje i pitanja za razmišljanje.',
    minorArcanaDescription:
      'Minor Arcana ukazuje na emocije, misli, resurse i kreativnost u svakodnevici. Otkrijte konkretene korake i afirmacije za svaku kartu.',
    viewCard: 'Pogledaj Kartu',
    totalCards: 'Ukupno 78 Karata',
    cardsCount: '✨ 78 Tarot Karata',
    majorArcanaCount: 'Major Arcana: 22',
    minorArcanaCount: 'Minor Arcana: 56',
    freeTarotBadge: '✨ Besplatno Tarot Čitanje',
    drawCardsTitle: 'Izvuci Svoju Ličnu Kombinaciju',
    drawCardsDescription:
      'Pokreni besplatno tarot čitanje za ljubav, karijeru i svakodnevne odluke uz jasno vođstvo.',
    drawCardsButton: 'Započni Čitanje',
    pageReactionsTitle:
      'Koliko su ti ova tumačenja Major Arcana karata pomogla?',
    popularSectionLabel: 'Najpopularnije',
    popularSectionTitle: 'Najgledanije Karte',
    popularSectionSubtitle:
      'Tarot karte koje naša zajednica najčešće proučava i komentariše',
    expertSectionTitle: 'Naš Stručni Tim i Urednička Garancija',
    expertName: 'Mina Kaya',
    expertRole: 'Iskusni tarot tumač i glavna urednica',
    expertBio:
      'Mina Kaya se profesionalno bavi tarotom više od 12 godina i kombinuje Jungovu analitičku psihologiju sa Rider–Waite simbolikom. Od 2019. vodi urednički tim Büsbüşkimki platforme.',
    factCheckLabel: 'Proverio',
    factCheckValue: 'Dr Selin Yüzbaşıoğlu (Psihološki savetnik)',
    updateLabel: 'Poslednje ažuriranje',
    updateValue: '12. novembar 2025.',
    trustSignalsTitle: 'Zašto možete verovati ovom sadržaju',
    trustSignals: [
      'Svako tumačenje se oslanja na akademske izvore i anonimne primere iz prakse.',
      'Tekstovi prolaze jezičku, etičku i sigurnosnu proveru pre objave.',
      'Sve ilustracije su licencirane iz Rider–Waite Smith špila uz naznačenu atribuciju.',
    ],
    moderationTitle: 'Politika Moderacije',
    moderationBody:
      'Komentari se proveravaju pre objave; govor mržnje, lični podaci ili obmanjujući zdravstveni/finansijski saveti se uklanjaju u skladu sa Google AdSense pravilima.',
    disclaimerTitle: 'Odricanje od Odgovornosti',
    disclaimerBody:
      'Tarot tumačenja služe kao inspirativno usmerenje. Ne zamenjuju profesionalni finansijski, pravni ili medicinski savet. Za važne odluke obratite se stručnjacima.',
    adsPolicyTitle: 'Transparentnost Oglasa',
    adsPolicyBody:
      'Pridržavamo se Google AdSense propisa; ne objavljujemo obmanjujući, sadržaj za odrasle ili materijale koji krše autorska prava. Sponzorisani tekstovi su jasno označeni.',
  },
};

export const POPULAR_CARD_SLUGS: Record<SupportedLocale, string[]> = {
  tr: ['deli', 'asklar', 'buyucu', 'olum', 'yildiz'],
  en: ['the-fool', 'the-lovers', 'the-magician', 'death', 'the-star'],
  sr: ['ludak', 'ljubavnici', 'magicar', 'smrt', 'zvezda'],
};

export function buildCardListingMetadata(locale: SupportedLocale): Metadata {
  const translations = CARD_LISTING_TRANSLATIONS[locale];

  return {
    title: `${translations.title} - ${
      locale === 'tr'
        ? 'Tüm Major ve Minor Arcana Kartları | Büsbüşkimki'
        : locale === 'en'
          ? 'All Major and Minor Arcana Cards | Büsbüşkimki'
          : 'Sve Major i Minor Arcana Karte | Büsbüşkimki'
    }`,
    description:
      locale === 'tr'
        ? 'Major ve Minor Arcana tarot kartlarının anlamları, ters yorumları, anahtar kelimeleri ve meditasyon önerileri. Ücretsiz tarot açılımı deneyin.'
        : locale === 'en'
          ? 'Discover upright and reversed tarot card meanings, keywords, and reflection prompts for every Major and Minor Arcana card. Start a free tarot reading.'
          : 'Saznaj značenja tarot karata u uspravnom i obrnutom položaju, ključne pojmove i savete za svaku kartu. Pokreni besplatno tarot čitanje.',
    keywords:
      locale === 'tr'
        ? 'tarot kartları, major arcana, minor arcana, tarot anlamları, tarot yorumları, tarot açılımı, aşk tarot, kariyer tarot'
        : locale === 'en'
          ? 'tarot cards, major arcana, minor arcana, tarot meanings, tarot interpretations, tarot reading, love tarot, career tarot'
          : 'tarot karte, major arcana, minor arcana, tarot značenja, tarot tumačenja, tarot čitanje, ljubav tarot, karijera tarot',
    alternates: {
      canonical: LOCALE_URLS[locale],
      languages: {
        tr: LOCALE_URLS.tr,
        en: LOCALE_URLS.en,
        sr: LOCALE_URLS.sr,
      },
    },
    openGraph: {
      title: translations.title,
      description:
        locale === 'tr'
          ? '78 tarot kartını anlamları, ters yorumları ve uzman önerileriyle birlikte keşfet.'
          : locale === 'en'
            ? 'Explore all 78 tarot cards with upright and reversed meanings curated by professionals.'
            : 'Otkrij svih 78 tarot karata uz tumačenja i savete stručnjaka.',
      type: 'website',
      locale: locale === 'tr' ? 'tr_TR' : locale === 'en' ? 'en_US' : 'sr_RS',
      url: LOCALE_URLS[locale],
    },
    twitter: {
      card: 'summary_large_image',
      title: translations.title,
      description:
        locale === 'tr'
          ? 'Büsbüşkimki tarot kartları rehberi: anlamlar, ters yorumlar, meditasyon önerileri.'
          : locale === 'en'
            ? 'Büsbüşkimki tarot cards guide: upright and reversed meanings plus expert tips.'
            : 'Vodič kroz tarot karte: značenja i saveti urednika Büsbüşkimki tima.',
    },
  };
}

export function resolveVariantByLocale(locale: SupportedLocale): RouteVariant {
  return LOCALE_ROUTE_SEGMENT[locale];
}

export function getLocaleFromVariant(variant: RouteVariant): SupportedLocale {
  switch (variant) {
    case 'cards':
      return 'en';
    case 'kartlar':
      return 'tr';
    case 'kartice':
      return 'sr';
  }
}

export function resolveRedirectTarget(locale: string): string | null {
  if (locale === 'en' || locale === 'tr' || locale === 'sr') {
    const segment = resolveVariantByLocale(locale);
    return `/${locale}/${segment}`;
  }

  return null;
}

export function getLocaleForParams(
  locale: string,
  enforcedLocale: SupportedLocale
): SupportedLocale {
  if (locale === enforcedLocale) {
    return enforcedLocale;
  }

  return enforcedLocale;
}


