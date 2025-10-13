/*
 * Security Utilities
 * XSS koruması ve güvenlik kontrolleri
 */

/**
 * Image source validation
 * Sadece güvenli domain'lerden gelen resimlere izin verir
 */
export function validateImageSrc(src: string): boolean {
  // Yerel dosya yollarına izin ver (public klasöründeki dosyalar)
  if (src.startsWith('/') && !src.startsWith('//')) {
    return true;
  }

  // Data URL'lere izin ver (base64 encoded images)
  if (src.startsWith('data:')) {
    return true;
  }

  const allowedDomains = [
    'localhost',
    'supabase.co',
    'supabase.com',
    'cdn.supabase.io',
    // Production domain'ler buraya eklenebilir
  ];

  try {
    const url = new URL(src);
    return allowedDomains.some(
      domain => url.hostname === domain || url.hostname.endsWith(`.${domain}`)
    );
  } catch {
    // Geçersiz URL
    return false;
  }
}

/**
 * HTML injection koruması
 * PDF export için güvenli HTML oluşturur
 */
export function sanitizeHtml(html: string): string {
  // Tehlikeli tag'leri kaldır
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form'];
  let sanitized = html;

  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  // Tehlikeli attribute'ları kaldır
  const dangerousAttrs = ['onload', 'onerror', 'onclick', 'onmouseover'];
  dangerousAttrs.forEach(attr => {
    const regex = new RegExp(`\\s${attr}\\s*=\\s*["'][^"']*["']`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  return sanitized;
}

/**
 * XSS koruması için text sanitization
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * URL validation
 * Sadece güvenli URL'lere izin verir
 */
export function validateUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

/**
 * Numeroloji input sanitization
 * İsim ve tarih girişlerini güvenli hale getirir
 */
export function sanitizeNumerologyInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // HTML/XML tag'lerini kaldır
  let sanitized = input.replace(/<[^>]*>/g, '');

  // Script injection'ları kaldır
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');

  // Sadece harf, rakam, boşluk, tire ve nokta karakterlerine izin ver
  sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-\.]/g, '');

  // Çoklu boşlukları tek boşluğa çevir
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  // Maksimum uzunluk kontrolü
  return sanitized.substring(0, 100);
}

/**
 * Tarih formatı validation
 * Sadece geçerli tarih formatlarına izin verir
 */
export function validateDateInput(dateString: string): boolean {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }

  // YYYY-MM-DD formatını kontrol et
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }

  // Geçerli tarih mi kontrol et
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return false;
  }

  // Gelecek tarih kontrolü (100 yıl sonrasına kadar)
  const now = new Date();
  const maxDate = new Date(now.getFullYear() + 100, 11, 31);
  if (date > maxDate) {
    return false;
  }

  // Çok eski tarih kontrolü (1900'den önce)
  const minDate = new Date(1900, 0, 1);
  if (date < minDate) {
    return false;
  }

  return true;
}

/**
 * İsim validation
 * Sadece geçerli karakterlere izin verir
 */
export function validateNameInput(name: string): boolean {
  if (!name || typeof name !== 'string') {
    return false;
  }

  // Boş string kontrolü
  if (name.trim().length === 0) {
    return false;
  }

  // Minimum ve maksimum uzunluk kontrolü
  if (name.length < 2 || name.length > 50) {
    return false;
  }

  // Sadece harf, boşluk, tire ve nokta karakterlerine izin ver
  const nameRegex = /^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s\-\.]+$/;
  if (!nameRegex.test(name)) {
    return false;
  }

  // Çoklu boşluk kontrolü
  if (/\s{2,}/.test(name)) {
    return false;
  }

  return true;
}

/**
 * XSS koruması için gelişmiş text sanitization
 */
export function sanitizeForDisplay(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // HTML entity'lerini decode et
  const htmlEntities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
  };

  let sanitized = text;
  Object.entries(htmlEntities).forEach(([entity, char]) => {
    sanitized = sanitized.replace(new RegExp(entity, 'g'), char);
  });

  // Tehlikeli karakterleri escape et
  return sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Form input rate limiting
 * Çok sık form gönderimini engeller
 */
const formSubmissionTimes: Map<string, number[]> = new Map();

export function checkRateLimit(
  userId: string = 'anonymous',
  maxSubmissions: number = 5,
  timeWindow: number = 60000
): boolean {
  const now = Date.now();
  const userSubmissions = formSubmissionTimes.get(userId) || [];

  // Eski submission'ları temizle
  const recentSubmissions = userSubmissions.filter(
    time => now - time < timeWindow
  );

  if (recentSubmissions.length >= maxSubmissions) {
    return false; // Rate limit aşıldı
  }

  // Yeni submission'ı ekle
  recentSubmissions.push(now);
  formSubmissionTimes.set(userId, recentSubmissions);

  return true;
}

/**
 * Content Security Policy header'ları
 * Production'da daha güvenli, development'da daha esnek
 */
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    // Script sources - production'da unsafe-inline ve unsafe-eval kaldırıldı
    process.env.NODE_ENV === 'production'
      ? "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com"
      : "script-src 'self' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    // Style sources - production'da unsafe-inline kaldırıldı
    process.env.NODE_ENV === 'production'
      ? "style-src 'self'"
      : "style-src 'self' 'unsafe-inline'",
    // Image sources - belirli domain'lerle sınırlandırıldı
    "img-src 'self' data: https://*.supabase.co https://*.supabase.in https://www.googletagmanager.com https://www.google-analytics.com",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

/**
 * Webhook signature validation
 * HMAC-SHA256 kullanarak webhook signature'ını doğrular
 */
export async function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  if (!payload || !signature || !secret) {
    return false;
  }

  try {
    // Node.js crypto API kullan
    const crypto = await import('crypto');
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    // Timing attack'a karşı constant-time comparison
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Webhook signature validation error:', error);
    return false;
  }
}

/**
 * CSRF Token generation
 * Güvenli, rastgele CSRF token oluşturur
 */
export function generateCsrfToken(): string {
  if (typeof window !== 'undefined' && window.crypto) {
    // Browser environment
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  } else {
    // Node.js environment
    try {
      const crypto = require('crypto');
      return crypto.randomBytes(32).toString('hex');
    } catch (error) {
      // Fallback - less secure but better than nothing
      return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
  }
}

/**
 * CSRF Token validation
 * Session'daki token ile gelen token'ı karşılaştırır
 */
export function validateCsrfToken(
  sessionToken: string,
  requestToken: string
): boolean {
  if (!sessionToken || !requestToken) {
    return false;
  }

  // Timing attack'a karşı korunmak için karakter karakter karşılaştır
  if (sessionToken.length !== requestToken.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < sessionToken.length; i++) {
    result |= sessionToken.charCodeAt(i) ^ requestToken.charCodeAt(i);
  }

  return result === 0;
}

/**
 * SQL Injection koruması
 * Basit SQL injection pattern'lerini tespit eder
 */
export function detectSqlInjection(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  const sqlPatterns = [
    /(\bOR\b.*=.*)/i,
    /(\bAND\b.*=.*)/i,
    /(\bUNION\b.*\bSELECT\b)/i,
    /(\bDROP\b.*\bTABLE\b)/i,
    /(\bINSERT\b.*\bINTO\b)/i,
    /(\bDELETE\b.*\bFROM\b)/i,
    /(\bUPDATE\b.*\bSET\b)/i,
    /(--)/,
    /(;)/,
    /(\bEXEC\b)/i,
    /(\bEXECUTE\b)/i,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Email validation (güvenli)
 * RFC 5322 uyumlu email validation
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // RFC 5322 regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) {
    return false;
  }

  // Uzunluk kontrolü
  if (email.length > 254) {
    return false;
  }

  // Domain kontrolü
  const parts = email.split('@');
  if (parts.length !== 2) {
    return false;
  }

  const [local, domain] = parts;

  // Local part kontrolü (max 64 karakter)
  if (local.length > 64) {
    return false;
  }

  // Domain kontrolü
  if (domain.length > 253) {
    return false;
  }

  return true;
}

/**
 * Password strength checker
 * Şifre gücünü 0-100 arası skorlar
 */
export function calculatePasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  if (!password) {
    return { score: 0, feedback: ['Şifre boş olamaz'] };
  }

  let score = 0;
  const feedback: string[] = [];

  // Uzunluk kontrolü
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  if (password.length < 8) {
    feedback.push('En az 8 karakter olmalı');
  }

  // Küçük harf
  if (/[a-z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Küçük harf içermeli');
  }

  // Büyük harf
  if (/[A-Z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Büyük harf içermeli');
  }

  // Rakam
  if (/[0-9]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Rakam içermeli');
  }

  // Özel karakter
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Özel karakter içermeli (!@#$%^&*)');
  }

  // Tekrar eden karakterler
  if (!/(.)\1{2,}/.test(password)) {
    score += 10;
  } else {
    feedback.push('Ardışık tekrar eden karakterlerden kaçının');
  }

  return {
    score: Math.min(score, 100),
    feedback,
  };
}

/**
 * Secure random string generator
 * Güvenli rastgele string oluşturur (token, ID vb. için)
 */
export function generateSecureRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  if (typeof window !== 'undefined' && window.crypto) {
    // Browser environment
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => chars[byte % chars.length]).join('');
  } else {
    // Node.js environment
    try {
      const crypto = require('crypto');
      const bytes = crypto.randomBytes(length);
      return Array.from(bytes, byte => chars[byte % chars.length]).join('');
    } catch (error) {
      // Fallback - less secure
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }
  }
}
