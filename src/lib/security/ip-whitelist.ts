/**
 * IP Whitelisting Service
 * Admin paneline sadece belirli IP'lerden erişim
 */

// Admin paneline erişebilecek IP adresleri
// .env'den de okunabilir: ALLOWED_ADMIN_IPS=192.168.1.1,203.0.113.0/24
const ALLOWED_ADMIN_IPS: string[] = process.env.ALLOWED_ADMIN_IPS
  ? process.env.ALLOWED_ADMIN_IPS.split(',').map(ip => ip.trim())
  : [
      // Development için localhost
      '127.0.0.1',
      '::1',
      'localhost',
      // Local network
      '192.168.1.0/24',
      '192.168.0.0/24',
      // Vercel deployment IPs (örnek)
      // '76.76.21.0/24',
    ];

/**
 * IP adresinin admin paneline erişim yetkisi var mı?
 */
export function isAdminIpAllowed(clientIp: string): boolean {
  // Development modunda tüm IP'lere izin ver
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  // IP whitelisting devre dışı mı? (.env'de DISABLE_IP_WHITELIST=true)
  if (process.env.DISABLE_IP_WHITELIST === 'true') {
    return true;
  }

  // IP boş veya unknown ise reddet
  if (!clientIp || clientIp === 'unknown') {
    console.warn('⚠️ IP Whitelist: Unknown IP, access denied');
    return false;
  }

  // Whitelist'te var mı kontrol et
  for (const allowedIp of ALLOWED_ADMIN_IPS) {
    if (isIpInRange(clientIp, allowedIp)) {
      return true;
    }
  }

  console.warn(`⚠️ IP Whitelist: Access denied for IP ${clientIp}`);
  return false;
}

/**
 * IP adresinin belirtilen range içinde olup olmadığını kontrol et
 */
function isIpInRange(ip: string, range: string): boolean {
  // Exact match
  if (ip === range) {
    return true;
  }

  // CIDR notation (örn: 192.168.1.0/24)
  if (range.includes('/')) {
    return isIpInCIDR(ip, range);
  }

  return false;
}

/**
 * CIDR notation kontrolü
 * Basit implementasyon - IPv4 için
 */
function isIpInCIDR(ip: string, cidr: string): boolean {
  try {
    const [range, bits] = cidr.split('/');

    // range veya bits undefined ise hata
    if (!range || !bits) {
      return false;
    }

    const mask = ~((1 << (32 - parseInt(bits))) - 1);

    const ipNum = ipToNumber(ip);
    const rangeNum = ipToNumber(range);

    return (ipNum & mask) === (rangeNum & mask);
  } catch (error) {
    console.error('CIDR check error:', error);
    return false;
  }
}

/**
 * IP adresini sayıya çevir
 */
function ipToNumber(ip: string): number {
  return (
    ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0
  );
}

/**
 * Whitelisted IP listesini al (admin settings için)
 */
export function getAllowedIps(): string[] {
  return ALLOWED_ADMIN_IPS;
}

/**
 * Yeni IP ekle (runtime'da)
 */
export function addAllowedIp(ip: string): void {
  if (!ALLOWED_ADMIN_IPS.includes(ip)) {
    ALLOWED_ADMIN_IPS.push(ip);
  }
}

/**
 * IP kaldır
 */
export function removeAllowedIp(ip: string): void {
  const index = ALLOWED_ADMIN_IPS.indexOf(ip);
  if (index > -1) {
    ALLOWED_ADMIN_IPS.splice(index, 1);
  }
}
