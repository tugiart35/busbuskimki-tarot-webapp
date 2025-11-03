#!/usr/bin/env node

/**
 * 🎯 Tarot Kartı Kalite Analiz ve Puanlama Scripti v2.0
 * 
 * Google AdSense onay kriterleri ve SEO kalitesine göre her kartı analiz eder.
 * 
 * Kontrol Kriterleri (113 Puan):
 * 
 * [İÇERİK KALİTESİ - 95 Puan]
 * 1. Kelime Sayısı (25p) - Hedef: 1200-1500
 * 2. Görsel Sayısı (15p) - Hedef: 4+
 * 3. FAQ Sayısı (15p) - Hedef: 5+
 * 4. Psikolog Yorumu (15p) - 150+ kelime unique content
 * 5. Sembol Analizi (10p) - 4+ sembol detayı
 * 6. Kart Kombinasyonları (5p) - 3+ kombinasyon
 * 7. SEO Metadata (5p) - Title + Description
 * 8. İçerik Derinliği (5p) - Düz/Ters tüm anlamlar
 * 9. Mitoloji/Hikaye (3p) - 100+ kelime
 * 10. Günlük Pratik (2p) - Affirmation/pratikler
 * 
 * [TEKNİK SEO & ADSENSE - 18 Puan]
 * 11. Canonical URL & OG Image (3p) - Teknik SEO
 * 12. Schema.org Hazırlık (2p) - JSON-LD veri
 * 13. İç Bağlantılar (2p) - Cross-linking
 * 14. Görsel ALT Text (2p) - Görsel SEO
 * 15. Kullanıcı Etkileşimi (2p) - İnteraktif elementler
 */

const fs = require('fs');
const path = require('path');

// Renk kodları için ANSI
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

/**
 * Metindeki kelime sayısını hesaplar
 */
function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  // HTML/Markdown işaretlerini temizle
  const cleanText = text
    .replace(/\[cite:\s*\d+\]/g, '') // Citation referanslarını kaldır
    .replace(/\*\*/g, '') // Bold işaretlerini kaldır
    .replace(/#{1,6}\s/g, '') // Markdown başlıklarını kaldır
    .replace(/\[.*?\]\(.*?\)/g, '') // Markdown linklerini kaldır
    .replace(/<[^>]*>/g, '') // HTML taglerini kaldır
    .trim();
  
  return cleanText.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Bir kart objesinin tüm içeriğindeki toplam kelime sayısı
 */
function getTotalWordCount(card) {
  let total = 0;
  
  // Name ve short_description
  total += countWords(card.name || '');
  total += countWords(card.short_description || '');
  
  // Meanings - Upright
  if (card.meanings?.upright) {
    total += countWords(card.meanings.upright.general || '');
    total += countWords(card.meanings.upright.love || '');
    total += countWords(card.meanings.upright.career || '');
    total += countWords(card.meanings.upright.money || '');
    total += countWords(card.meanings.upright.spiritual || '');
  }
  
  // Meanings - Reversed
  if (card.meanings?.reversed) {
    total += countWords(card.meanings.reversed.general || '');
    total += countWords(card.meanings.reversed.love || '');
    total += countWords(card.meanings.reversed.career || '');
    total += countWords(card.meanings.reversed.money || '');
    total += countWords(card.meanings.reversed.spiritual || '');
  }
  
  // Context
  if (card.context) {
    total += countWords(card.context.mythology || '');
    if (card.context.celtic_cross) {
      total += countWords(card.context.celtic_cross.future || '');
      total += countWords(card.context.celtic_cross.hidden_influences || '');
    }
    total += countWords(card.context.numerology || '');
  }
  
  // FAQ
  if (Array.isArray(card.faq)) {
    card.faq.forEach(item => {
      if (typeof item === 'string') {
        total += countWords(item);
      } else if (item.question && item.answer) {
        total += countWords(item.question);
        total += countWords(item.answer);
      }
    });
  }
  
  // Psychologist Perspective
  if (card.psychologist_perspective) {
    total += countWords(card.psychologist_perspective.title || '');
    total += countWords(card.psychologist_perspective.content || '');
  }
  
  // Symbolism
  if (card.symbolism) {
    total += countWords(card.symbolism.title || '');
    total += countWords(card.symbolism.description || '');
    if (Array.isArray(card.symbolism.symbols)) {
      card.symbolism.symbols.forEach(symbol => {
        total += countWords(symbol.name || '');
        total += countWords(symbol.meaning || '');
      });
    }
  }
  
  // Card Combinations
  if (card.card_combinations) {
    total += countWords(card.card_combinations.title || '');
    if (Array.isArray(card.card_combinations.combinations)) {
      card.card_combinations.combinations.forEach(combo => {
        total += countWords(combo.cards || '');
        total += countWords(combo.meaning || '');
      });
    }
  }
  
  // Daily Practice
  if (card.daily_practice) {
    total += countWords(card.daily_practice.title || '');
    if (Array.isArray(card.daily_practice.practices)) {
      card.daily_practice.practices.forEach(practice => {
        total += countWords(practice);
      });
    }
  }
  
  // Affirmations
  if (Array.isArray(card.affirmations)) {
    card.affirmations.forEach(affirmation => {
      total += countWords(affirmation);
    });
  }
  
  return total;
}

/**
 * Görsel sayısını hesaplar
 */
function getImageCount(card) {
  let count = 0;
  
  // Ana görsel
  if (card.imageUrl) count++;
  
  // Ek görseller
  if (Array.isArray(card.additionalImages)) {
    count += card.additionalImages.length;
  }
  
  return count;
}

/**
 * FAQ sayısını hesaplar
 */
function getFAQCount(card) {
  if (!Array.isArray(card.faq)) return 0;
  return card.faq.length;
}

/**
 * Kart içeriğini analiz eder ve puan verir
 */
function analyzeCard(cardSlug, cardData) {
  const analysis = {
    slug: cardSlug,
    name: cardData.name || 'Adsız Kart',
    scores: {},
    totalScore: 0,
    maxScore: 100,
    issues: [],
    strengths: [],
  };
  
  // 1. KELIME SAYISI (Max: 25 puan)
  const wordCount = getTotalWordCount(cardData);
  if (wordCount >= 1200 && wordCount <= 1500) {
    analysis.scores.wordCount = 25;
    analysis.strengths.push(`✅ Mükemmel kelime sayısı: ${wordCount} kelime`);
  } else if (wordCount >= 800 && wordCount < 1200) {
    analysis.scores.wordCount = 18;
    analysis.issues.push(`⚠️ Kelime sayısı yetersiz: ${wordCount} (Hedef: 1200-1500)`);
  } else if (wordCount >= 500 && wordCount < 800) {
    analysis.scores.wordCount = 10;
    analysis.issues.push(`❌ Kelime sayısı düşük: ${wordCount} (Hedef: 1200-1500)`);
  } else if (wordCount > 1500) {
    analysis.scores.wordCount = 20;
    analysis.issues.push(`⚠️ Kelime sayısı çok yüksek: ${wordCount} (Hedef: 1200-1500, okuyucu sıkılabilir)`);
  } else {
    analysis.scores.wordCount = 5;
    analysis.issues.push(`❌ Kelime sayısı çok düşük: ${wordCount} (Kritik seviye!)`);
  }
  
  // 2. GÖRSEL SAYISI (Max: 15 puan)
  const imageCount = getImageCount(cardData);
  if (imageCount >= 4) {
    analysis.scores.images = 15;
    analysis.strengths.push(`✅ Yeterli görsel: ${imageCount} adet`);
  } else if (imageCount === 3) {
    analysis.scores.images = 10;
    analysis.issues.push(`⚠️ 1 görsel daha ekleyin (Mevcut: ${imageCount})`);
  } else if (imageCount === 2) {
    analysis.scores.images = 6;
    analysis.issues.push(`❌ En az 4 görsel gerekli (Mevcut: ${imageCount})`);
  } else if (imageCount === 1) {
    analysis.scores.images = 3;
    analysis.issues.push(`❌ Sadece 1 görsel var - 3 görsel daha ekleyin!`);
  } else {
    analysis.scores.images = 0;
    analysis.issues.push(`❌ Hiç görsel yok! En az 4 görsel ekleyin!`);
  }
  
  // 3. FAQ SAYISI (Max: 15 puan)
  const faqCount = getFAQCount(cardData);
  if (faqCount >= 5) {
    analysis.scores.faq = 15;
    analysis.strengths.push(`✅ Yeterli FAQ: ${faqCount} soru`);
  } else if (faqCount >= 3) {
    analysis.scores.faq = 10;
    analysis.issues.push(`⚠️ FAQ sayısı artırılabilir (Mevcut: ${faqCount}, Hedef: 5+)`);
  } else if (faqCount >= 1) {
    analysis.scores.faq = 5;
    analysis.issues.push(`❌ FAQ yetersiz (Mevcut: ${faqCount}, Hedef: 5+)`);
  } else {
    analysis.scores.faq = 0;
    analysis.issues.push(`❌ FAQ yok! En az 5 soru ekleyin!`);
  }
  
  // 4. PSİKOLOG YORUMU (Max: 15 puan)
  if (cardData.psychologist_perspective?.content && 
      countWords(cardData.psychologist_perspective.content) >= 150) {
    analysis.scores.psychologistPerspective = 15;
    analysis.strengths.push(`✅ Kişisel uzman yorumu var (${countWords(cardData.psychologist_perspective.content)} kelime)`);
  } else if (cardData.psychologist_perspective?.content) {
    analysis.scores.psychologistPerspective = 8;
    analysis.issues.push(`⚠️ Psikolog yorumu çok kısa (${countWords(cardData.psychologist_perspective.content)} kelime, hedef: 150+)`);
  } else {
    analysis.scores.psychologistPerspective = 0;
    analysis.issues.push(`❌ Psikolog yorumu yok - Unique content için kritik!`);
  }
  
  // 5. SEMBOL ANALİZİ (Max: 10 puan)
  if (cardData.symbolism?.symbols && Array.isArray(cardData.symbolism.symbols) && 
      cardData.symbolism.symbols.length >= 4) {
    analysis.scores.symbolism = 10;
    analysis.strengths.push(`✅ Sembol analizi var (${cardData.symbolism.symbols.length} sembol)`);
  } else if (cardData.symbolism?.symbols?.length > 0) {
    analysis.scores.symbolism = 5;
    analysis.issues.push(`⚠️ Sembol analizi yetersiz (${cardData.symbolism.symbols.length} sembol, hedef: 4+)`);
  } else {
    analysis.scores.symbolism = 0;
    analysis.issues.push(`❌ Sembol analizi yok - Derin içerik için gerekli!`);
  }
  
  // 6. KART KOMBİNASYONLARI (Max: 5 puan)
  if (cardData.card_combinations?.combinations && 
      Array.isArray(cardData.card_combinations.combinations) && 
      cardData.card_combinations.combinations.length >= 3) {
    analysis.scores.combinations = 5;
    analysis.strengths.push(`✅ Kart kombinasyonları var (${cardData.card_combinations.combinations.length} kombinasyon)`);
  } else if (cardData.card_combinations?.combinations?.length > 0) {
    analysis.scores.combinations = 3;
    analysis.issues.push(`⚠️ Kombinasyon sayısı az (${cardData.card_combinations.combinations.length}, hedef: 3+)`);
  } else {
    analysis.scores.combinations = 0;
    analysis.issues.push(`⚠️ Kart kombinasyonları yok`);
  }
  
  // 7. SEO METADATA (Max: 5 puan)
  if (cardData.seoMetadata?.title && cardData.seoMetadata?.description) {
    analysis.scores.seoMetadata = 5;
    analysis.strengths.push(`✅ SEO metadata tam`);
  } else if (cardData.seoMetadata) {
    analysis.scores.seoMetadata = 3;
    analysis.issues.push(`⚠️ SEO metadata eksik`);
  } else {
    analysis.scores.seoMetadata = 0;
    analysis.issues.push(`❌ SEO metadata yok!`);
  }
  
  // 8. İÇERİK DERİNLİĞİ - DÜZ/TERS ANLAMLAR (Max: 5 puan)
  const hasUprightMeanings = cardData.meanings?.upright?.general && 
                             cardData.meanings?.upright?.love && 
                             cardData.meanings?.upright?.career && 
                             cardData.meanings?.upright?.money && 
                             cardData.meanings?.upright?.spiritual;
  
  const hasReversedMeanings = cardData.meanings?.reversed?.general && 
                              cardData.meanings?.reversed?.love && 
                              cardData.meanings?.reversed?.career && 
                              cardData.meanings?.reversed?.money && 
                              cardData.meanings?.reversed?.spiritual;
  
  if (hasUprightMeanings && hasReversedMeanings) {
    analysis.scores.meaningDepth = 5;
    analysis.strengths.push(`✅ Tüm anlamlar tam (Düz + Ters)`);
  } else if (hasUprightMeanings || hasReversedMeanings) {
    analysis.scores.meaningDepth = 3;
    analysis.issues.push(`⚠️ Düz veya Ters anlamlar eksik`);
  } else {
    analysis.scores.meaningDepth = 1;
    analysis.issues.push(`❌ Anlamlar çok eksik!`);
  }
  
  // 9. CONTEXT/MİTOLOJİ (Max: 3 puan)
  if (cardData.context?.mythology && countWords(cardData.context.mythology) >= 100) {
    analysis.scores.mythology = 3;
    analysis.strengths.push(`✅ Mitoloji/Hikaye bölümü yeterli`);
  } else if (cardData.context?.mythology) {
    analysis.scores.mythology = 1;
    analysis.issues.push(`⚠️ Mitoloji bölümü kısa`);
  } else {
    analysis.scores.mythology = 0;
    analysis.issues.push(`❌ Mitoloji/Hikaye yok`);
  }
  
  // 10. GÜNLÜK PRATİK & AFFİRMATIONS (Max: 2 puan)
  if ((cardData.daily_practice?.practices?.length >= 3) || 
      (cardData.affirmations?.length >= 3)) {
    analysis.scores.practice = 2;
    analysis.strengths.push(`✅ Günlük pratik veya affirmation var`);
  } else {
    analysis.scores.practice = 0;
    analysis.issues.push(`⚠️ Günlük pratik/affirmation yok`);
  }
  
  // 11. TEKNİK SEO - CANONICAL URL & OG IMAGE (Max: 3 puan)
  const hasCanonicalUrl = cardData.seoMetadata?.canonicalUrl;
  const hasOgImage = cardData.seoMetadata?.ogImage;
  
  if (hasCanonicalUrl && hasOgImage) {
    analysis.scores.technicalSeo = 3;
    analysis.strengths.push(`✅ Canonical URL ve OG Image tanımlı`);
  } else if (hasCanonicalUrl || hasOgImage) {
    analysis.scores.technicalSeo = 2;
    analysis.issues.push(`⚠️ Canonical URL veya OG Image eksik`);
  } else {
    analysis.scores.technicalSeo = 0;
    analysis.issues.push(`❌ Canonical URL ve OG Image yok - SEO için kritik!`);
  }
  
  // 12. SCHEMA.ORG / JSON-LD HAZIRLIGI (Max: 2 puan)
  const hasStructuredData = cardData.seoMetadata?.schemaType || 
                            cardData.context?.mythology || 
                            cardData.faq?.length >= 3;
  
  if (hasStructuredData) {
    analysis.scores.schemaOrg = 2;
    analysis.strengths.push(`✅ Structured data için veri hazır`);
  } else {
    analysis.scores.schemaOrg = 0;
    analysis.issues.push(`❌ Schema.org için veri yetersiz`);
  }
  
  // 13. İÇ BAĞLANTILAR & CROSS-LINK (Max: 2 puan)
  const hasRelatedCards = Array.isArray(cardData.related_cards) && cardData.related_cards.length >= 3;
  const hasCombinations = cardData.card_combinations?.combinations?.length >= 3;
  
  if (hasRelatedCards && hasCombinations) {
    analysis.scores.internalLinks = 2;
    analysis.strengths.push(`✅ İç bağlantı potansiyeli yüksek`);
  } else if (hasRelatedCards || hasCombinations) {
    analysis.scores.internalLinks = 1;
    analysis.issues.push(`⚠️ Daha fazla iç bağlantı eklenebilir`);
  } else {
    analysis.scores.internalLinks = 0;
    analysis.issues.push(`❌ İç bağlantı eksik - SEO otoritesi düşük`);
  }
  
  // 14. GÖRSEL SEO (ALT TEXT & CAPTION) (Max: 2 puan)
  let imageAltTextScore = 0;
  if (Array.isArray(cardData.additionalImages)) {
    const imagesWithAlt = cardData.additionalImages.filter(img => img.alt && img.alt.length > 10);
    if (imagesWithAlt.length === cardData.additionalImages.length) {
      imageAltTextScore = 2;
      analysis.strengths.push(`✅ Tüm görsellerde ALT text var`);
    } else if (imagesWithAlt.length > 0) {
      imageAltTextScore = 1;
      analysis.issues.push(`⚠️ Bazı görsellerde ALT text eksik`);
    } else {
      imageAltTextScore = 0;
      analysis.issues.push(`❌ Görsellerde ALT text yok - Görsel SEO için kritik!`);
    }
  } else {
    imageAltTextScore = 0;
    analysis.issues.push(`❌ Görsel metadata yok`);
  }
  analysis.scores.imageAltText = imageAltTextScore;
  
  // 15. KULLANICI ETKİLEŞİM SİNYALİ (Max: 2 puan)
  const hasInteractiveElements = (cardData.daily_practice?.practices?.length >= 3) ||
                                  (cardData.affirmations?.length >= 3) ||
                                  (cardData.card_combinations?.combinations?.length >= 3);
  
  if (hasInteractiveElements) {
    analysis.scores.userEngagement = 2;
    analysis.strengths.push(`✅ Kullanıcı etkileşimi için içerik var`);
  } else {
    analysis.scores.userEngagement = 0;
    analysis.issues.push(`❌ İnteraktif element eksik - AdSense için önemli!`);
  }
  
  // TOPLAM PUAN HESAPLAMA (Artık 113 puan üzerinden)
  analysis.totalScore = Object.values(analysis.scores).reduce((sum, score) => sum + score, 0);
  analysis.maxScore = 113; // Güncellenmiş maksimum puan
  
  // GENEL DEĞERLENDİRME (113 puan üzerinden)
  // Yüzdelik hesapla: totalScore / 113 * 100
  const percentage = (analysis.totalScore / 113) * 100;
  
  if (percentage >= 85) {
    analysis.grade = 'A+ (Mükemmel - AdSense Onayına Hazır)';
    analysis.color = colors.green;
  } else if (percentage >= 70) {
    analysis.grade = 'B+ (İyi - Küçük iyileştirmelerle hazır)';
    analysis.color = colors.cyan;
  } else if (percentage >= 55) {
    analysis.grade = 'C+ (Orta - Önemli iyileştirme gerekli)';
    analysis.color = colors.yellow;
  } else if (percentage >= 40) {
    analysis.grade = 'D (Zayıf - Kapsamlı çalışma gerekli)';
    analysis.color = colors.magenta;
  } else {
    analysis.grade = 'F (Başarısız - Tümden yenileme gerekli)';
    analysis.color = colors.red;
  }
  
  return analysis;
}

/**
 * Ana script fonksiyonu
 */
function main() {
  console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════`);
  console.log(`🎯 TAROT KARTI KALİTE ANALİZ RAPORU`);
  console.log(`═══════════════════════════════════════════════════════════════${colors.reset}\n`);
  
  // JSON dosyasını oku
  const jsonPath = path.join(__dirname, '..', 'src', 'lib', 'data', 'tarot-cards.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`${colors.red}❌ Hata: tarot-cards.json dosyası bulunamadı!${colors.reset}`);
    console.error(`   Aranan yol: ${jsonPath}`);
    process.exit(1);
  }
  
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(rawData);
  
  // İlk objeden cards objesini al
  const cards = data[0]?.blog?.cards;
  
  if (!cards) {
    console.error(`${colors.red}❌ Hata: Kartlar bulunamadı!${colors.reset}`);
    process.exit(1);
  }
  
  const cardSlugs = Object.keys(cards);
  console.log(`${colors.bright}Toplam Kart Sayısı: ${cardSlugs.length}${colors.reset}\n`);
  
  // Her kartı analiz et
  const allAnalyses = [];
  
  cardSlugs.forEach((slug, index) => {
    const analysis = analyzeCard(slug, cards[slug]);
    allAnalyses.push(analysis);
    
    // Her kartı yazdır
    console.log(`${colors.bright}─────────────────────────────────────────────────────────────${colors.reset}`);
    console.log(`${analysis.color}${colors.bright}#${index + 1} - ${analysis.name} (${slug})${colors.reset}`);
    console.log(`${analysis.color}${colors.bright}PUAN: ${analysis.totalScore}/${analysis.maxScore} - ${analysis.grade}${colors.reset}`);
    console.log('');
    
    // Puan detayları
    console.log(`  📊 Puan Dağılımı:`);
    console.log(`     ${colors.bright}[İÇERİK KALİTESİ]${colors.reset}`);
    console.log(`     • Kelime Sayısı: ${analysis.scores.wordCount}/25`);
    console.log(`     • Görseller: ${analysis.scores.images}/15`);
    console.log(`     • FAQ: ${analysis.scores.faq}/15`);
    console.log(`     • Psikolog Yorumu: ${analysis.scores.psychologistPerspective}/15`);
    console.log(`     • Sembol Analizi: ${analysis.scores.symbolism}/10`);
    console.log(`     • Kombinasyonlar: ${analysis.scores.combinations}/5`);
    console.log(`     • İçerik Derinliği: ${analysis.scores.meaningDepth}/5`);
    console.log(`     • Mitoloji/Hikaye: ${analysis.scores.mythology}/3`);
    console.log(`     • Günlük Pratik: ${analysis.scores.practice}/2`);
    console.log(``);
    console.log(`     ${colors.bright}[TEKNİK SEO & ADSENSE]${colors.reset}`);
    console.log(`     • SEO Metadata: ${analysis.scores.seoMetadata}/5`);
    console.log(`     • Canonical & OG Image: ${analysis.scores.technicalSeo}/3`);
    console.log(`     • Schema.org Hazırlık: ${analysis.scores.schemaOrg}/2`);
    console.log(`     • İç Bağlantılar: ${analysis.scores.internalLinks}/2`);
    console.log(`     • Görsel ALT Text: ${analysis.scores.imageAltText}/2`);
    console.log(`     • Kullanıcı Etkileşimi: ${analysis.scores.userEngagement}/2`);
    console.log('');
    
    // Güçlü yönler
    if (analysis.strengths.length > 0) {
      console.log(`  ${colors.green}💪 Güçlü Yönler:${colors.reset}`);
      analysis.strengths.forEach(strength => {
        console.log(`     ${strength}`);
      });
      console.log('');
    }
    
    // Sorunlar
    if (analysis.issues.length > 0) {
      console.log(`  ${colors.yellow}⚠️  İyileştirme Önerileri:${colors.reset}`);
      analysis.issues.forEach(issue => {
        console.log(`     ${issue}`);
      });
      console.log('');
    }
  });
  
  // ÖZET İSTATİSTİKLER
  console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════`);
  console.log(`📈 ÖZET İSTATİSTİKLER`);
  console.log(`═══════════════════════════════════════════════════════════════${colors.reset}\n`);
  
  const totalCards = allAnalyses.length;
  const avgScore = (allAnalyses.reduce((sum, a) => sum + a.totalScore, 0) / totalCards).toFixed(1);
  const avgPercentage = ((avgScore / 113) * 100).toFixed(1);
  
  // Yüzdelik bazında grade hesaplama
  const gradeA = allAnalyses.filter(a => (a.totalScore / 113 * 100) >= 85).length;
  const gradeB = allAnalyses.filter(a => {
    const perc = a.totalScore / 113 * 100;
    return perc >= 70 && perc < 85;
  }).length;
  const gradeC = allAnalyses.filter(a => {
    const perc = a.totalScore / 113 * 100;
    return perc >= 55 && perc < 70;
  }).length;
  const gradeD = allAnalyses.filter(a => {
    const perc = a.totalScore / 113 * 100;
    return perc >= 40 && perc < 55;
  }).length;
  const gradeF = allAnalyses.filter(a => (a.totalScore / 113 * 100) < 40).length;
  
  console.log(`${colors.bright}Toplam Kart: ${totalCards}${colors.reset}`);
  console.log(`${colors.bright}Ortalama Puan: ${avgScore}/113 (${avgPercentage}%)${colors.reset}`);
  console.log(`${colors.bright}Max Puan: 113 (İçerik: 95 + SEO/AdSense: 18)${colors.reset}\n`);
  
  console.log(`${colors.green}A+ (85-100): ${gradeA} kart (${(gradeA/totalCards*100).toFixed(1)}%)${colors.reset}`);
  console.log(`${colors.cyan}B+ (70-84):  ${gradeB} kart (${(gradeB/totalCards*100).toFixed(1)}%)${colors.reset}`);
  console.log(`${colors.yellow}C+ (55-69):  ${gradeC} kart (${(gradeC/totalCards*100).toFixed(1)}%)${colors.reset}`);
  console.log(`${colors.magenta}D (40-54):   ${gradeD} kart (${(gradeD/totalCards*100).toFixed(1)}%)${colors.reset}`);
  console.log(`${colors.red}F (<40):     ${gradeF} kart (${(gradeF/totalCards*100).toFixed(1)}%)${colors.reset}\n`);
  
  // EN İYİ VE EN KÖTÜ KARTLAR
  const sortedByScore = [...allAnalyses].sort((a, b) => b.totalScore - a.totalScore);
  
  console.log(`${colors.green}${colors.bright}🏆 EN İYİ 5 KART:${colors.reset}`);
  sortedByScore.slice(0, 5).forEach((card, idx) => {
    console.log(`   ${idx + 1}. ${card.name} - ${card.totalScore}/100 (${card.slug})`);
  });
  console.log('');
  
  console.log(`${colors.red}${colors.bright}⚠️  EN ZAYIF 5 KART:${colors.reset}`);
  sortedByScore.slice(-5).reverse().forEach((card, idx) => {
    console.log(`   ${idx + 1}. ${card.name} - ${card.totalScore}/100 (${card.slug})`);
  });
  console.log('');
  
  // GOOGLE ADSENSE ONAY DEĞERLENDİRMESİ
  console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════`);
  console.log(`🎯 GOOGLE ADSENSE ONAY DEĞERLENDİRMESİ`);
  console.log(`═══════════════════════════════════════════════════════════════${colors.reset}\n`);
  
  const readyForAdsense = allAnalyses.filter(a => (a.totalScore / 113 * 100) >= 85).length;
  const needsMinorWork = allAnalyses.filter(a => {
    const perc = a.totalScore / 113 * 100;
    return perc >= 70 && perc < 85;
  }).length;
  const needsMajorWork = allAnalyses.filter(a => (a.totalScore / 113 * 100) < 70).length;
  
  if (avgPercentage >= 80) {
    console.log(`${colors.green}${colors.bright}✅ SONUÇ: Siteniz AdSense onayı için GÜÇLÜ durumda!${colors.reset}`);
  } else if (avgPercentage >= 65) {
    console.log(`${colors.yellow}${colors.bright}⚠️  SONUÇ: Küçük iyileştirmelerle AdSense onayı alabilirsiniz.${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bright}❌ SONUÇ: Kapsamlı iyileştirme gerekiyor.${colors.reset}`);
  }
  
  console.log('');
  console.log(`${colors.bright}Detaylı Analiz:${colors.reset}`);
  console.log(`  • AdSense'e Hazır Kartlar: ${colors.green}${readyForAdsense}${colors.reset} (${(readyForAdsense/totalCards*100).toFixed(1)}%)`);
  console.log(`  • Küçük İyileştirme Gerekli: ${colors.cyan}${needsMinorWork}${colors.reset} (${(needsMinorWork/totalCards*100).toFixed(1)}%)`);
  console.log(`  • Kapsamlı Çalışma Gerekli: ${colors.yellow}${needsMajorWork}${colors.reset} (${(needsMajorWork/totalCards*100).toFixed(1)}%)`);
  console.log('');
  
  // TAVSİYELER
  console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════`);
  console.log(`💡 ÖNCELİKLİ TAVSİYELER`);
  console.log(`═══════════════════════════════════════════════════════════════${colors.reset}\n`);
  
  // En yaygın sorunları bul
  const allIssues = allAnalyses.flatMap(a => a.issues);
  const issueCategories = {
    wordCount: allIssues.filter(i => i.includes('Kelime sayısı')).length,
    images: allIssues.filter(i => i.includes('görsel')).length,
    faq: allIssues.filter(i => i.includes('FAQ')).length,
    psychologist: allIssues.filter(i => i.includes('Psikolog') || i.includes('uzman')).length,
    symbolism: allIssues.filter(i => i.includes('Sembol')).length,
    seoMetadata: allIssues.filter(i => i.includes('SEO metadata') || i.includes('Canonical') || i.includes('OG Image')).length,
    altText: allIssues.filter(i => i.includes('ALT text')).length,
    internalLinks: allIssues.filter(i => i.includes('bağlantı')).length,
  };
  
  const topIssues = Object.entries(issueCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  console.log(`${colors.bright}En Yaygın Sorunlar:${colors.reset}`);
  topIssues.forEach(([category, count], idx) => {
    const categoryNames = {
      wordCount: 'Kelime Sayısı Yetersiz',
      images: 'Görsel Eksikliği',
      faq: 'FAQ Yetersiz',
      psychologist: 'Psikolog Yorumu Yok',
      symbolism: 'Sembol Analizi Eksik',
      seoMetadata: 'SEO Metadata Eksik',
      altText: 'Görsel ALT Text Yok',
      internalLinks: 'İç Bağlantı Eksik',
    };
    console.log(`  ${idx + 1}. ${categoryNames[category]}: ${count} kartta sorun var`);
  });
  
  console.log('');
  console.log(`${colors.bright}Önerilen Aksiyonlar:${colors.reset}`);
  console.log(`  ${colors.cyan}[İÇERİK KALİTESİ]${colors.reset}`);
  console.log(`  1. 🎯 Önce en zayıf 5 kartı Deli kartı seviyesine getirin`);
  console.log(`  2. 📸 Tüm kartlara en az 4 görsel ekleyin (ALT text ile)`);
  console.log(`  3. 👩‍⚕️ Her karta psikolog yorumu ekleyin (150+ kelime)`);
  console.log(`  4. 🔮 Sembol analizi bölümü ekleyin (4+ sembol)`);
  console.log(`  5. ❓ FAQ sayısını 5+'a çıkarın`);
  console.log(``);
  console.log(`  ${colors.cyan}[TEKNİK SEO & ADSENSE]${colors.reset}`);
  console.log(`  6. 🔗 Canonical URL ve OG Image ekleyin (1200x630px)`);
  console.log(`  7. 🏷️ Tüm görsellere ALT text + caption ekleyin`);
  console.log(`  8. 🔄 İç bağlantıları artırın (related cards + combinations)`);
  console.log(`  9. 📊 Schema.org JSON-LD yapısını implement edin`);
  console.log(`  10. 🎮 İnteraktif elementler ekleyin (kart çekme, yorum vs)`);
  console.log('');
  
  // JSON RAPOR KAYDET
  const reportPath = path.join(__dirname, '..', 'card-quality-report.json');
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalCards,
      avgScore: parseFloat(avgScore),
      gradeDistribution: { gradeA, gradeB, gradeC, gradeD, gradeF },
      adsenseReadiness: {
        ready: readyForAdsense,
        needsMinorWork,
        needsMajorWork,
        percentage: parseFloat((readyForAdsense/totalCards*100).toFixed(1)),
      },
    },
    cards: allAnalyses.map(a => ({
      slug: a.slug,
      name: a.name,
      totalScore: a.totalScore,
      grade: a.grade,
      scores: a.scores,
      issuesCount: a.issues.length,
      strengthsCount: a.strengths.length,
    })),
    topIssues: topIssues.map(([category, count]) => ({ category, count })),
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`${colors.green}✅ Detaylı rapor kaydedildi: card-quality-report.json${colors.reset}\n`);
  
  console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);
}

// Scripti çalıştır
main();

