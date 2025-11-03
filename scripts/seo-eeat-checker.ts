// seo-eeat-checker.ts
import * as fs from 'fs';

interface CheckResult {
  passed: boolean;
  message: string;
  score?: number;
  details?: string[];
}

interface CardAnalysis {
  cardId: string;
  cardName: string;
  overallScore: number;
  maxScore: number;
  checks: {
    seo: CheckResult[];
    content: CheckResult[];
    eeat: CheckResult[];
    adsense: CheckResult[];
    ux: CheckResult[];
  };
}

class SEOEEATChecker {
  private results: CardAnalysis[] = [];

  // SEO Kuralları Kontrolleri
  checkSEO(card: any, cardId: string): CheckResult[] {
    const checks: CheckResult[] = [];

    // 1. Meta Title Kontrolü (Maks 60 karakter)
    const titleLength = card.seo?.metaTitle?.length || 0;
    checks.push({
      passed: titleLength > 0 && titleLength <= 60,
      message: 'Meta Title uzunluğu (0-60 karakter)',
      score: titleLength > 0 && titleLength <= 60 ? 10 : 0,
      details: [
        `Mevcut: ${titleLength} karakter`,
        titleLength > 60 ? '⚠️ 60 karakteri aşıyor' : '✓ Uygun uzunluk',
        card.seo?.metaTitle || '❌ Meta title eksik'
      ]
    });

    // 2. Meta Description Kontrolü (140-160 karakter)
    const descLength = card.seo?.metaDescription?.length || 0;
    checks.push({
      passed: descLength >= 140 && descLength <= 160,
      message: 'Meta Description uzunluğu (140-160 karakter)',
      score: descLength >= 140 && descLength <= 160 ? 10 : 
             descLength > 0 ? 5 : 0,
      details: [
        `Mevcut: ${descLength} karakter`,
        descLength < 140 ? '⚠️ Çok kısa (min 140)' : 
        descLength > 160 ? '⚠️ Çok uzun (max 160)' : '✓ Uygun uzunluk',
        card.seo?.metaDescription || '❌ Meta description eksik'
      ]
    });

    // 3. Focus Keywords Kontrolü (3-5 adet)
    const keywordCount = card.seo?.focusKeywords?.length || 0;
    checks.push({
      passed: keywordCount >= 3 && keywordCount <= 5,
      message: 'Focus Keywords sayısı (3-5 adet)',
      score: keywordCount >= 3 && keywordCount <= 5 ? 10 : 
             keywordCount > 0 ? 5 : 0,
      details: [
        `Mevcut: ${keywordCount} adet`,
        ...(card.seo?.focusKeywords || ['❌ Keywords eksik'])
      ]
    });

    // 4. Ana Anahtar Kelimenin Title'da Varlığı
    const mainKeyword = card.seo?.focusKeywords?.[0];
    const keywordInTitle = mainKeyword && 
      card.seo?.metaTitle?.toLowerCase().includes(mainKeyword.toLowerCase());
    checks.push({
      passed: !!keywordInTitle,
      message: 'Ana anahtar kelime title\'da mevcut',
      score: keywordInTitle ? 10 : 0,
      details: [
        mainKeyword ? `Ana keyword: "${mainKeyword}"` : '❌ Ana keyword yok',
        keywordInTitle ? '✓ Title\'da bulunuyor' : '⚠️ Title\'da bulunamadı'
      ]
    });

    // 5. URL-friendly slug kontrolü
    const urlSlug = cardId;
    const isUrlFriendly = /^[a-z0-9-]+$/.test(urlSlug);
    checks.push({
      passed: isUrlFriendly,
      message: 'URL yapısı SEO uyumlu',
      score: isUrlFriendly ? 10 : 0,
      details: [
        `Slug: ${urlSlug}`,
        isUrlFriendly ? '✓ SEO-friendly' : '⚠️ Türkçe karakter veya geçersiz karakter içeriyor'
      ]
    });

    return checks;
  }

  // İçerik Kalitesi Kontrolleri
  checkContent(card: any): CheckResult[] {
    const checks: CheckResult[] = [];

    // 1. Toplam Kelime Sayısı (min 1500 kelime - GÜNCELLEME)
    const allText = [
      card.short_description,
      card.meanings?.upright?.general,
      card.meanings?.upright?.love,
      card.meanings?.upright?.career,
      card.meanings?.upright?.money,
      card.meanings?.upright?.spiritual,
      card.meanings?.reversed?.general,
      card.meanings?.reversed?.love,
      card.meanings?.reversed?.career,
      card.meanings?.reversed?.money,
      card.meanings?.reversed?.spiritual,
      card.context?.mythology,
      card.context?.history,
      card.numerology?.essence,
      card.numerology?.message,
      card.numerological_perspective?.summary,
      ...(card.numerological_perspective?.insights || []),
      ...(card.faq?.map((f: any) => f.question + ' ' + f.answer) || []),
      ...(card.combinations?.map((c: any) => c.description) || []),
      ...(card.symbolism?.map((s: any) => s.meaning) || [])
    ].filter(Boolean).join(' ');

    const wordCount = allText.split(/\s+/).length;
    checks.push({
      passed: wordCount >= 1500,
      message: 'Toplam kelime sayısı (min 1500)',
      score: wordCount >= 2000 ? 15 : 
             wordCount >= 1500 ? 12 : 
             wordCount >= 1000 ? 8 :
             wordCount >= 800 ? 5 : 0,
      details: [
        `Mevcut: ${wordCount} kelime`,
        wordCount >= 2000 ? '✓ Mükemmel (2000+)' :
        wordCount >= 1500 ? '✓ Yeterli (1500+)' :
        wordCount >= 1000 ? '⚠️ Yetersiz - 1500\'e ulaştırın' :
        wordCount >= 800 ? '⚠️ Çok kısa - minimum 1500 kelime gerekli' :
        '❌ Kritik eksiklik - içerik ciddi şekilde genişletilmeli'
      ]
    });

    // 2. Görsel Kontrolü
    const hasImage = !!card.imageUrl;
    checks.push({
      passed: hasImage,
      message: 'Görsel mevcudiyeti',
      score: hasImage ? 10 : 0,
      details: [
        hasImage ? `✓ Görsel var: ${card.imageUrl}` : '❌ Görsel eksik',
        '💡 En az 3-4 özgün görsel önerilir'
      ]
    });

    // 3. FAQ Bölümü (min 3 soru)
    const faqCount = card.faq?.length || 0;
    checks.push({
      passed: faqCount >= 3,
      message: 'FAQ bölümü (min 3 soru)',
      score: faqCount >= 5 ? 10 : 
             faqCount >= 3 ? 7 : 
             faqCount > 0 ? 3 : 0,
      details: [
        `Mevcut: ${faqCount} soru`,
        faqCount >= 5 ? '✓ Mükemmel' :
        faqCount >= 3 ? '✓ Yeterli' :
        '⚠️ En az 3 FAQ sorusu ekleyin'
      ]
    });

    // 4. İç Bağlantılar (Related Cards)
    const relatedCount = card.related_cards?.length || 0;
    checks.push({
      passed: relatedCount >= 3,
      message: 'İlişkili kartlar/iç bağlantılar (min 3)',
      score: relatedCount >= 5 ? 10 : 
             relatedCount >= 3 ? 7 : 
             relatedCount > 0 ? 3 : 0,
      details: [
        `Mevcut: ${relatedCount} bağlantı`,
        ...(card.related_cards || ['❌ İlişkili kart yok'])
      ]
    });

    // 5. Kart Kombinasyonları
    const combCount = card.combinations?.length || 0;
    checks.push({
      passed: combCount >= 3,
      message: 'Kart kombinasyonları (zenginleştirme)',
      score: combCount >= 5 ? 10 : 
             combCount >= 3 ? 7 : 
             combCount > 0 ? 3 : 0,
      details: [
        `Mevcut: ${combCount} kombinasyon`,
        combCount >= 3 ? '✓ Yeterli' : '⚠️ En az 3 kombinasyon ekleyin'
      ]
    });

    // 6. Sembolizm Açıklamaları
    const symbolCount = card.symbolism?.length || 0;
    checks.push({
      passed: symbolCount >= 3,
      message: 'Sembolik açıklamalar',
      score: symbolCount >= 3 ? 10 : 
             symbolCount > 0 ? 5 : 0,
      details: [
        `Mevcut: ${symbolCount} sembol`,
        symbolCount >= 3 ? '✓ Yeterli detay' : '⚠️ Daha fazla sembol açıklaması ekleyin'
      ]
    });

    return checks;
  }

  // E-E-A-T Kontrolleri
  checkEEAT(card: any): CheckResult[] {
    const checks: CheckResult[] = [];

    // 1. Experience (Deneyim) - Kişisel gözlem/örnek
    const hasPersonalTouch = 
      card.meanings?.upright?.general?.includes('sana') ||
      card.meanings?.upright?.general?.includes('sen') ||
      card.numerology?.message;
    checks.push({
      passed: hasPersonalTouch,
      message: 'Experience: Kişisel/deneyimsel dil kullanımı',
      score: hasPersonalTouch ? 10 : 5,
      details: [
        hasPersonalTouch ? 
          '✓ İkinci tekil şahıs kullanılıyor (okuyucuya hitap)' :
          '⚠️ Daha kişisel bir dil kullanın'
      ]
    });

    // 2. Expertise (Uzmanlık) - Mitoloji, tarih, numeroloji
    const hasMythology = !!card.context?.mythology;
    const hasHistory = !!card.context?.history;
    const hasNumerology = !!card.numerology;
    const expertiseCount = [hasMythology, hasHistory, hasNumerology].filter(Boolean).length;
    
    checks.push({
      passed: expertiseCount >= 2,
      message: 'Expertise: Mitoloji, tarih, numeroloji bilgisi',
      score: expertiseCount * 5,
      details: [
        `${expertiseCount}/3 uzmanlık alanı mevcut`,
        hasMythology ? '✓ Mitoloji açıklaması var' : '⚠️ Mitoloji ekleyin',
        hasHistory ? '✓ Tarihçe açıklaması var' : '⚠️ Tarihçe ekleyin',
        hasNumerology ? '✓ Numeroloji analizi var' : '⚠️ Numeroloji ekleyin'
      ]
    });

    // 3. Authoritativeness (Yetkinlik) - Detaylı açıklamalar
    const hasDetailedMeanings = 
      card.meanings?.upright?.general?.length > 100 &&
      card.meanings?.reversed?.general?.length > 100;
    checks.push({
      passed: hasDetailedMeanings,
      message: 'Authoritativeness: Detaylı ve derinlikli açıklamalar',
      score: hasDetailedMeanings ? 10 : 5,
      details: [
        hasDetailedMeanings ? 
          '✓ Düz ve ters anlamlar detaylı' :
          '⚠️ Anlamları daha detaylandırın (min 100 karakter)'
      ]
    });

    // 4. Trustworthiness (Güvenilirlik) - FAQ ve tutarlı bilgi
    const hasFAQ = (card.faq?.length || 0) >= 3;
    const hasConsistentInfo = card.short_description && card.name;
    checks.push({
      passed: hasFAQ && hasConsistentInfo,
      message: 'Trustworthiness: FAQ ve tutarlı bilgi yapısı',
      score: hasFAQ && hasConsistentInfo ? 10 : 
             hasFAQ || hasConsistentInfo ? 5 : 0,
      details: [
        hasFAQ ? '✓ FAQ bölümü mevcut' : '⚠️ FAQ ekleyin',
        hasConsistentInfo ? '✓ Temel bilgiler tutarlı' : '⚠️ Başlık/açıklama eksik'
      ]
    });

    return checks;
  }

  // AdSense Uyumluluğu Kontrolleri
  checkAdSense(card: any): CheckResult[] {
    const checks: CheckResult[] = [];

    // 1. Özgün İçerik Kontrolü (tekrar tespit edilemez ama uzunluk kontrol edilebilir)
    const uniqueContent = card.short_description?.length > 50;
    checks.push({
      passed: uniqueContent,
      message: 'Özgün içerik (min 50 karakter açıklama)',
      score: uniqueContent ? 10 : 0,
      details: [
        uniqueContent ? 
          '✓ Yeterli uzunlukta açıklama' :
          '⚠️ Daha detaylı açıklama yazın'
      ]
    });

    // 2. Yeterli İçerik Hacmi
    const allText = [
      card.short_description,
      card.meanings?.upright?.general,
      card.meanings?.reversed?.general
    ].filter(Boolean).join(' ');
    const wordCount = allText.split(/\s+/).length;
    const sufficientContent = wordCount >= 300;
    
    checks.push({
      passed: sufficientContent,
      message: 'Yeterli içerik hacmi (min 300 kelime)',
      score: sufficientContent ? 10 : 5,
      details: [
        `Ana içerik: ${wordCount} kelime`,
        sufficientContent ? 
          '✓ AdSense için yeterli' :
          '⚠️ İçerik genişletilmeli (min 300 kelime)'
      ]
    });

    // 3. Yasal/Uygun İçerik (manuel kontrol gerekir, sadece hatırlatma)
    checks.push({
      passed: true,
      message: 'Uygun içerik (manuel kontrol)',
      score: 10,
      details: [
        '✓ Tarot içeriği AdSense politikalarına uygun',
        '💡 Yanıltıcı ifadeler kullanmayın',
        '💡 "Garanti" veya "kesin sonuç" gibi ifadelerden kaçının'
      ]
    });

    return checks;
  }

  // Kullanıcı Deneyimi (UX) Kontrolleri
  checkUX(card: any): CheckResult[] {
    const checks: CheckResult[] = [];

    // 1. Kısa Açıklama (özet kutusu için)
    const hasShortDesc = card.short_description?.length >= 100;
    checks.push({
      passed: hasShortDesc,
      message: 'Kısa özet açıklaması (min 100 karakter)',
      score: hasShortDesc ? 10 : 5,
      details: [
        `Mevcut: ${card.short_description?.length || 0} karakter`,
        hasShortDesc ? 
          '✓ Yeterli uzunlukta özet' :
          '⚠️ Daha detaylı özet yazın'
      ]
    });

    // 2. Yapılandırılmış Anlam Bölümleri
    const meaningCategories = ['general', 'love', 'career', 'money', 'spiritual'];
    const uprightCount = meaningCategories.filter(
      cat => card.meanings?.upright?.[cat]
    ).length;
    const reversedCount = meaningCategories.filter(
      cat => card.meanings?.reversed?.[cat]
    ).length;
    
    checks.push({
      passed: uprightCount >= 4 && reversedCount >= 4,
      message: 'Yapılandırılmış anlam kategorileri (5 alan)',
      score: (uprightCount >= 4 && reversedCount >= 4) ? 10 : 5,
      details: [
        `Düz: ${uprightCount}/5 kategori`,
        `Ters: ${reversedCount}/5 kategori`,
        (uprightCount >= 4 && reversedCount >= 4) ? 
          '✓ Tüm kategoriler dolu' :
          '⚠️ Eksik kategoriler var'
      ]
    });

    // 3. Okunabilirlik - Ortalama Cümle Uzunluğu
    const sampleText = card.meanings?.upright?.general || '';
    const sentences = sampleText.split(/[.!?]+/).filter((s: string) => s.trim());
    const avgSentenceLength = sentences.length > 0 ? 
      sampleText.split(/\s+/).length / sentences.length : 0;
    const readable = avgSentenceLength > 0 && avgSentenceLength <= 25;
    
    checks.push({
      passed: readable,
      message: 'Okunabilirlik (ortalama cümle uzunluğu ≤25 kelime)',
      score: readable ? 10 : 5,
      details: [
        avgSentenceLength > 0 ? 
          `Ortalama: ${avgSentenceLength.toFixed(1)} kelime/cümle` :
          'İçerik yok',
        readable ? 
          '✓ Okunabilir' :
          avgSentenceLength > 25 ? '⚠️ Cümleler çok uzun' : '⚠️ İçerik ekleyin'
      ]
    });

    // 4. Numeroloji Perspektifi (zenginleştirme)
    const hasNumerologyInsights = 
      (card.numerological_perspective?.insights?.length || 0) >= 3;
    checks.push({
      passed: hasNumerologyInsights,
      message: 'Numeroloji içgörüleri (min 3)',
      score: hasNumerologyInsights ? 10 : 5,
      details: [
        `Mevcut: ${card.numerological_perspective?.insights?.length || 0} içgörü`,
        hasNumerologyInsights ? 
          '✓ Yeterli numeroloji detayı' :
          '⚠️ Daha fazla numeroloji içgörüsü ekleyin'
      ]
    });

    return checks;
  }

  // Tek Bir Kartı Analiz Et
  analyzeCard(cardId: string, card: any): CardAnalysis {
    const seoChecks = this.checkSEO(card, cardId);
    const contentChecks = this.checkContent(card);
    const eeatChecks = this.checkEEAT(card);
    const adsenseChecks = this.checkAdSense(card);
    const uxChecks = this.checkUX(card);

    const allChecks = [
      ...seoChecks,
      ...contentChecks,
      ...eeatChecks,
      ...adsenseChecks,
      ...uxChecks
    ];

    const totalScore = allChecks.reduce((sum, check) => sum + (check.score || 0), 0);
    const maxScore = allChecks.length * 10;

    return {
      cardId,
      cardName: card.name || cardId,
      overallScore: totalScore,
      maxScore,
      checks: {
        seo: seoChecks,
        content: contentChecks,
        eeat: eeatChecks,
        adsense: adsenseChecks,
        ux: uxChecks
      }
    };
  }

  // JSON Dosyasını Yükle ve Tüm Kartları Analiz Et
  analyzeJSON(filePath: string): void {
    console.log(`\n📊 Analiz başlatılıyor: ${filePath}\n`);
    
    let rawData = fs.readFileSync(filePath, 'utf-8').trim();
    
    // JSON dosyasının başında { yoksa ekle
    if (!rawData.startsWith('{')) {
      rawData = '{' + rawData;
    }
    
    // Sondaki virgülü temizle
    if (rawData.endsWith(',')) {
      rawData = rawData.slice(0, -1);
    }
    
    // JSON dosyasının sonunda }} yoksa ekle (blog ve cards için 2 kapanış)
    const openBraces = (rawData.match(/{/g) || []).length;
    const closeBraces = (rawData.match(/}/g) || []).length;
    const missingBraces = openBraces - closeBraces;
    
    for (let i = 0; i < missingBraces; i++) {
      rawData += '}';
    }
    
    const data = JSON.parse(rawData);

    const cards = data.blog?.cards || data.cards || data;

    let cardCount = 0;
    for (const [cardId, card] of Object.entries(cards)) {
      const analysis = this.analyzeCard(cardId, card);
      this.results.push(analysis);
      cardCount++;
    }

    console.log(`✅ ${cardCount} kart analiz edildi.\n`);
  }

  // Rapor Oluştur
  generateReport(outputPath?: string): void {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📋 SEO & E-E-A-T ANALİZ RAPORU');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Özet İstatistikler
    const totalCards = this.results.length;
    const avgScore = this.results.reduce((sum, r) => sum + r.overallScore, 0) / totalCards;
    const avgMaxScore = this.results[0]?.maxScore || 0;
    const avgPercentage = (avgScore / avgMaxScore) * 100;

    console.log('📈 GENEL ÖZET');
    console.log('─────────────────────────────────────────────────────────');
    console.log(`Toplam Kart: ${totalCards}`);
    console.log(`Ortalama Skor: ${avgScore.toFixed(1)}/${avgMaxScore} (${avgPercentage.toFixed(1)}%)`);
    console.log('');

    // En İyi ve En Kötü Kartlar
    const sortedByScore = [...this.results].sort((a, b) => b.overallScore - a.overallScore);
    const topCards = sortedByScore.slice(0, 3);
    const bottomCards = sortedByScore.slice(-3).reverse();

    console.log('🏆 EN İYİ 3 KART');
    console.log('─────────────────────────────────────────────────────────');
    topCards.forEach((card, idx) => {
      const percentage = (card.overallScore / card.maxScore) * 100;
      console.log(`${idx + 1}. ${card.cardName}`);
      console.log(`   Skor: ${card.overallScore}/${card.maxScore} (${percentage.toFixed(1)}%)`);
    });
    console.log('');

    console.log('⚠️ İYİLEŞTİRME GEREKTİREN 3 KART');
    console.log('─────────────────────────────────────────────────────────');
    bottomCards.forEach((card, idx) => {
      const percentage = (card.overallScore / card.maxScore) * 100;
      console.log(`${idx + 1}. ${card.cardName}`);
      console.log(`   Skor: ${card.overallScore}/${card.maxScore} (${percentage.toFixed(1)}%)`);
    });
    console.log('');

    // Detaylı Kart Raporları
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔍 DETAYLI KART ANALİZLERİ');
    console.log('═══════════════════════════════════════════════════════════\n');

    this.results.forEach(card => {
      this.printCardReport(card);
    });

    // JSON olarak kaydet
    if (outputPath) {
      const reportData = {
        summary: {
          totalCards,
          averageScore: avgScore.toFixed(1),
          maxScore: avgMaxScore,
          percentage: avgPercentage.toFixed(1),
          topCards: topCards.map(c => ({ id: c.cardId, name: c.cardName, score: c.overallScore })),
          bottomCards: bottomCards.map(c => ({ id: c.cardId, name: c.cardName, score: c.overallScore }))
        },
        cards: this.results
      };
      
      fs.writeFileSync(outputPath, JSON.stringify(reportData, null, 2), 'utf-8');
      console.log(`\n💾 Detaylı rapor kaydedildi: ${outputPath}`);
    }
  }

  // Tek Kart Raporu Yazdır
  private printCardReport(card: CardAnalysis): void {
    const percentage = (card.overallScore / card.maxScore) * 100;
    const grade = percentage >= 90 ? 'A+' :
                  percentage >= 80 ? 'A' :
                  percentage >= 70 ? 'B' :
                  percentage >= 60 ? 'C' :
                  percentage >= 50 ? 'D' : 'F';

    console.log(`┌─────────────────────────────────────────────────────────`);
    console.log(`│ 🃏 ${card.cardName}`);
    console.log(`│ ID: ${card.cardId}`);
    console.log(`│ Skor: ${card.overallScore}/${card.maxScore} (${percentage.toFixed(1)}%) - Not: ${grade}`);
    console.log(`└─────────────────────────────────────────────────────────`);

    // SEO
    console.log(`\n  🔍 SEO (${this.getCategoryScore(card.checks.seo)} puan)`);
    card.checks.seo.forEach(check => this.printCheck(check));

    // İçerik Kalitesi
    console.log(`\n  📝 İÇERİK KALİTESİ (${this.getCategoryScore(card.checks.content)} puan)`);
    card.checks.content.forEach(check => this.printCheck(check));

    // E-E-A-T
    console.log(`\n  ⭐ E-E-A-T (${this.getCategoryScore(card.checks.eeat)} puan)`);
    card.checks.eeat.forEach(check => this.printCheck(check));

    // AdSense
    console.log(`\n  💰 ADSENSE UYUMLULUĞU (${this.getCategoryScore(card.checks.adsense)} puan)`);
    card.checks.adsense.forEach(check => this.printCheck(check));

    // UX
    console.log(`\n  👤 KULLANICI DENEYİMİ (${this.getCategoryScore(card.checks.ux)} puan)`);
    card.checks.ux.forEach(check => this.printCheck(check));

    console.log('\n');
  }

  private getCategoryScore(checks: CheckResult[]): number {
    return checks.reduce((sum, check) => sum + (check.score || 0), 0);
  }

  private printCheck(check: CheckResult): void {
    const icon = check.passed ? '✅' : '❌';
    console.log(`    ${icon} ${check.message} (${check.score || 0}/10)`);
    if (check.details) {
      check.details.forEach(detail => {
        console.log(`       ${detail}`);
      });
    }
  }
}

// Script Kullanımı
const checker = new SEOEEATChecker();

// Komut satırı argümanları
const args = process.argv.slice(2);
const inputFile = args[0] || './data/kartlarfinal.json';
const outputFile = args[1] || './seo-eeat-report.json';

try {
  checker.analyzeJSON(inputFile);
  checker.generateReport(outputFile);
} catch (error) {
  console.error('❌ Hata:', error);
  process.exit(1);
}

