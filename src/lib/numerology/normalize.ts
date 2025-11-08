/**
 * Numeroloji için normalizasyon yardımcıları
 * İsimleri ve tarihleri numeroloji hesaplaması için hazırlar
 */

import { LETTER_VALUES, TURKISH_NORMALIZATION, VOWELS } from './types';

/**
 * İsmi numeroloji hesaplaması için normalize eder
 * - Türkçe karakterleri İngilizce karşılıklarına çevirir
 * - Büyük harfe çevirir
 * - Sadece harfleri tutar, diğer karakterleri kaldırır
 */
export function normalizeName(name: string): string {
  return name
    .trim() // Boşlukları temizle
    .replace(/\s+/g, ' ') // Çoklu boşlukları tek boşluğa indir
    .split('')
    .map(char => TURKISH_NORMALIZATION[char] || char)
    .join('')
    .toUpperCase()
    .replace(/[^A-Z]/g, ''); // Sadece A-Z harflerini tut
}

/**
 * Tarihi numeroloji hesaplaması için normalize eder
 * YYYY-MM-DD formatını YYYYMMDD formatına çevirir
 */
export function normalizeDate(date: string): string {
  return date.replace(/-/g, '');
}

/**
 * Harfin numeroloji değerini döndürür
 */
export function getLetterValue(letter: string): number {
  return LETTER_VALUES[letter.toUpperCase()] || 0;
}

/**
 * Sayıyı tek haneye indirger (Pythagorean reduction)
 * Master sayıları (11, 22, 33) korur
 */
export function reduceToSingleDigit(num: number): number {
  // 0 veya negatif sayıları kontrol et
  if (num <= 0) {
    return 9; // Numerolojide 0 kullanılmaz, 9'a çevir
  }

  // Master sayıları koru
  if (num === 11 || num === 22 || num === 33) {
    return num;
  }

  // Tek haneye indir
  while (num > 9) {
    num = num
      .toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit), 0);

    // Tekrar master sayı kontrolü
    if (num === 11 || num === 22 || num === 33) {
      return num;
    }
  }

  return num;
}

/**
 * İsmin tüm harflerinin değerlerini toplar
 */
export function sumNameValues(name: string): number {
  const normalizedName = normalizeName(name);
  return normalizedName
    .split('')
    .reduce((sum, letter) => sum + getLetterValue(letter), 0);
}

/**
 * İsmin sesli harflerinin değerlerini toplar
 */
export function sumVowelValues(name: string): number {
  const normalizedName = normalizeName(name);

  return normalizedName
    .split('')
    .filter(letter => VOWELS.includes(letter as any))
    .reduce((sum, letter) => sum + getLetterValue(letter), 0);
}

/**
 * İsmin ünsüz harflerinin değerlerini toplar (Kişilik sayısı için)
 */
export function sumConsonantValues(name: string): number {
  const normalizedName = normalizeName(name);

  return normalizedName
    .split('')
    .filter(letter => !VOWELS.includes(letter as any))
    .reduce((sum, letter) => sum + getLetterValue(letter), 0);
}

/**
 * Tarihin rakamlarını toplar
 */
export function sumDateDigits(date: string): number {
  const normalizedDate = normalizeDate(date);
  return normalizedDate
    .split('')
    .reduce((sum, digit) => sum + parseInt(digit), 0);
}

/**
 * Tarihten ay, gün, yıl değerlerini çıkarır
 */
// ---- Digits helpers -------------------------------------------------
export function sumDigits(n: number): number {
  n = Math.abs(n);
  let s = 0;
  while (n > 0) {
    s += n % 10;
    n = Math.floor(n / 10);
  }
  return s;
}
export function reduceToSingle(n: number): number {
  n = Math.abs(n);
  if (n === 0) {
    return 0;
  }
  while (n > 9) {
    n = sumDigits(n);
  }
  return n;
}
export function isMaster(n: number): boolean {
  return n === 11 || n === 22 || n === 33;
}
export function reduceWithMasters(n: number): number {
  return isMaster(n) ? n : reduceToSingle(n);
}

// Zorluk farkı için: önce tek haneye indir, sonra |a-b|, sonra yine tek haneye indir → 0–8 garantisi
export function challengeDiff(a: number, b: number): number {
  return reduceToSingle(Math.abs(reduceToSingle(a) - reduceToSingle(b)));
}

// ---- Date parsing (strict & safe) -----------------------------------
export function extractDateParts(date: string): {
  month: number;
  day: number;
  year: number;
} {
  if (typeof date !== 'string') {
    throw new Error('Geçersiz tarih: string olmalı (örn. 1990-12-31)');
  }

  const value = date.trim();
  if (!value) {
    throw new Error('Geçersiz tarih: boş bırakılamaz');
  }

  type Order = 'ymd' | 'dmy';
  const patterns: Array<{ regex: RegExp; order: Order }> = [
    { regex: /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/, order: 'ymd' }, // YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD
    { regex: /^(\d{4})(\d{2})(\d{2})$/, order: 'ymd' }, // YYYYMMDD
    { regex: /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/, order: 'dmy' }, // DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY
    { regex: /^(\d{2})(\d{2})(\d{4})$/, order: 'dmy' }, // DDMMYYYY
  ];

  let match: RegExpMatchArray | null = null;
  let order: Order | null = null;

  for (const candidate of patterns) {
    match = value.match(candidate.regex);
    if (match) {
      order = candidate.order;
      break;
    }
  }

  if (!match || !order) {
    throw new Error(
      `Geçersiz tarih formatı: ${date}. Beklenen format: YYYY-MM-DD veya DD-MM-YYYY`
    );
  }

  const [firstStr, secondStr, thirdStr] = match.slice(1) as [
    string,
    string,
    string,
  ];

  const year = order === 'ymd' ? Number(firstStr) : Number(thirdStr);
  const month = Number(secondStr);
  const day = order === 'ymd' ? Number(thirdStr) : Number(firstStr);

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    throw new Error('Geçersiz tarih: sayıya çevrilemiyor');
  }

  if (!(year >= 1000 && year <= 2999)) {
    throw new Error(`Yıl aralığı mantıksız: ${year}`);
  }
  if (!(month >= 1 && month <= 12)) {
    throw new Error(`Ay aralığı hatalı: ${month}`);
  }
  if (!(day >= 1 && day <= 31)) {
    throw new Error(`Gün aralığı hatalı: ${day}`);
  }

  const parsed = new Date(year, month - 1, day);
  const valid =
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day;

  if (!valid) {
    throw new Error(`Geçersiz tarih: ${date} (ör. 31/02/2020 gibi)`);
  }

  return { year, month, day };
}

/**
 * Doğum günü sayısını hesaplar (1-31 arası)
 */
export function getBirthdayNumber(day: number): number {
  if (day >= 1 && day <= 31) {
    return reduceToSingleDigit(day);
  }
  return 0;
}

/**
 * İki sayı arasındaki mutlak farkı hesaplar
 */
// Basit fark; genel amaçlı kullan (ama Challenge için "challengeDiff"i kullan!)
export function getAbsoluteDifference(a: number, b: number): number {
  return Math.abs(a - b);
}
