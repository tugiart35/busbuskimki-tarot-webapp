/**
 * Environment Variables Validation
 * 
 * Bu modül uygulama başlangıcında environment variables'ların
 * doğru şekilde ayarlandığını kontrol eder.
 * 
 * Production'da eksik environment variable'lar varsa
 * uygulama başlamaz ve hata fırlatır.
 */

interface EnvironmentConfig {
  required: string[];
  optional: string[];
}

const environmentConfig: EnvironmentConfig = {
  // Zorunlu environment variables
  required: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ],
  
  // Opsiyonel ama önerilen environment variables
  optional: [
    'SUPABASE_SERVICE_ROLE_KEY',
    'SHOPIER_MERCHANT_ID',
    'SHOPIER_API_KEY',
    'SHOPIER_API_SECRET',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_SHOPIER_API_URL',
    'NEXT_PUBLIC_SHOPIER_CALLBACK_URL',
    'NEXT_PUBLIC_SHOPIER_WEBHOOK_URL',
  ],
};

/**
 * Environment variables'ları validate eder
 * @throws Error - Zorunlu variable eksikse
 */
export function validateEnv(): void {
  // Development'da sadece uyarı ver
  if (process.env.NODE_ENV === 'development') {
    const missing = environmentConfig.required.filter(
      key => !process.env[key]
    );
    
    if (missing.length > 0) {
      console.warn(
        '⚠️ Missing required environment variables:',
        missing.join(', ')
      );
      console.warn(
        '⚠️ Application may not work correctly. Please check your .env file.'
      );
    }
    
    const missingOptional = environmentConfig.optional.filter(
      key => !process.env[key]
    );
    
    if (missingOptional.length > 0) {
      console.info(
        'ℹ️ Missing optional environment variables:',
        missingOptional.join(', ')
      );
    }
    
    return;
  }

  // Production'da zorunlu variable'ları kontrol et
  const missing = environmentConfig.required.filter(
    key => !process.env[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `❌ CRITICAL: Missing required environment variables: ${missing.join(', ')}\n` +
      `Please configure these variables in your deployment platform (Vercel, etc.)`
    );
  }

  // Production'da opsiyonel variable'lar için uyarı
  const missingOptional = environmentConfig.optional.filter(
    key => !process.env[key]
  );

  if (missingOptional.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn(
      '⚠️ Missing optional environment variables:',
      missingOptional.join(', ')
    );
    console.warn(
      '⚠️ Some features may not work correctly without these variables.'
    );
  }
}

/**
 * Belirli bir environment variable'ın değerini güvenli şekilde alır
 * @param key - Environment variable adı
 * @param defaultValue - Varsayılan değer (opsiyonel)
 * @returns Variable değeri veya varsayılan değer
 */
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  
  if (!value && !defaultValue) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Environment variable ${key} is not set`);
    }
    console.warn(`⚠️ Environment variable ${key} is not set`);
    return '';
  }
  
  return value || defaultValue || '';
}

/**
 * Environment değişkenini boolean olarak alır
 * @param key - Environment variable adı
 * @param defaultValue - Varsayılan değer
 * @returns Boolean değer
 */
export function getEnvBoolean(key: string, defaultValue = false): boolean {
  const value = process.env[key];
  
  if (!value) {
    return defaultValue;
  }
  
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Environment değişkenini number olarak alır
 * @param key - Environment variable adı
 * @param defaultValue - Varsayılan değer
 * @returns Number değer
 */
export function getEnvNumber(key: string, defaultValue = 0): number {
  const value = process.env[key];
  
  if (!value) {
    return defaultValue;
  }
  
  const parsed = parseInt(value, 10);
  
  if (isNaN(parsed)) {
    console.warn(
      `⚠️ Environment variable ${key} is not a valid number: ${value}`
    );
    return defaultValue;
  }
  
  return parsed;
}

/**
 * Tüm kritik environment variables'ların bir özetini döndürür
 * (Güvenlik için sadece varlık bilgisi, değer gösterilmez)
 */
export function getEnvSummary(): Record<string, boolean> {
  const allVars = [
    ...environmentConfig.required,
    ...environmentConfig.optional,
  ];
  
  return allVars.reduce((acc, key) => {
    acc[key] = !!process.env[key];
    return acc;
  }, {} as Record<string, boolean>);
}

// Development'da environment özeti göster
if (process.env.NODE_ENV === 'development') {
  const summary = getEnvSummary();
  const totalVars = Object.keys(summary).length;
  const setVars = Object.values(summary).filter(Boolean).length;
  
  console.log(`📊 Environment Variables: ${setVars}/${totalVars} configured`);
}

