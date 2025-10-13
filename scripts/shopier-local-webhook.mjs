#!/usr/bin/env node

/**
 * Shopier Local Webhook Tester
 * 
 * Bu script localhost:3003'te çalışan Shopier webhook endpoint'ini test eder:
 * 1. Test kullanıcısı oluşturur/kontrol eder
 * 2. Simüle edilmiş Shopier webhook payload gönderir
 * 3. Response'u kontrol eder (200 OK beklenir)
 * 4. Supabase'de transaction ve credit güncellemesini doğrular
 * 5. Sonuçları raporlar
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

// ES Module için __dirname alternatifi
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// .env.local dosyasını manuel olarak yükle
function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return false;
  }
  
  try {
    const envContent = readFileSync(filePath, 'utf-8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      // Boş satırları ve yorumları atla
      if (!line.trim() || line.trim().startsWith('#')) {
        continue;
      }
      
      // KEY=VALUE formatını parse et
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        // Çift tırnakları kaldır
        process.env[key] = value.replace(/^["']|["']$/g, '');
      }
    }
    
    return true;
  } catch (error) {
    console.error('⚠️  .env.local okunamadı:', error.message);
    return false;
  }
}

// .env.local dosyasını kontrol et ve yükle
const envPath = join(projectRoot, '.env.local');
const envLoaded = loadEnvFile(envPath);

if (!envLoaded) {
  console.error('❌ HATA: .env.local dosyası bulunamadı veya okunamadı');
  console.error('📁 Beklenen konum:', envPath);
  console.error('\n💡 Çözüm: env.example dosyasını .env.local olarak kopyalayın ve gerekli değerleri doldurun:');
  console.error('   cp env.example .env.local');
  console.error('\n⚙️  Gerekli değişkenler:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
  console.error('❌ HATA: Supabase kimlik bilgileri bulunamadı veya geçersiz');
  console.error('SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli (test için)');
  console.error('\n📝 .env.local dosyanızı kontrol edin ve gerekli değerleri ekleyin.');
  console.error('\n💡 Not: env.example dosyasındaki placeholder değerleri gerçek değerlerle değiştirmelisiniz.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test konfigürasyonu
const WEBHOOK_URL = 'http://localhost:3003/api/webhook/shopier';
const TEST_USER_EMAIL = 'test-shopier@example.com';
const TEST_PACKAGE_ID = 'starter'; // 100 kredi, 0 bonus
const EXPECTED_CREDITS = 100;

// Renkli console çıktısı için helper
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Dosyaya yazarken renk kodlarını kaldır
const isOutputToFile = process.stdout.isTTY === false || process.env.NO_COLOR === '1';

function log(message, color = 'reset') {
  if (isOutputToFile) {
    console.log(message);
  } else {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }
}

function logStep(step, message) {
  log(`\n[${step}] ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

/**
 * Sunucunun çalıştığını kontrol et
 */
async function checkServerHealth() {
  logStep('1', 'Sunucu health check - localhost:3003');
  
  try {
    const response = await fetch('http://localhost:3003/api/health', {
      method: 'GET',
      timeout: 5000,
    });
    
    if (response.ok) {
      logSuccess('Sunucu çalışıyor (200 OK)');
      return true;
    } else {
      logWarning(`Sunucu yanıt verdi ama sağlıklı değil (${response.status})`);
      return true; // Yine de devam et, belki health endpoint yok
    }
  } catch (error) {
    logError('Sunucu çalışmıyor veya erişilemiyor');
    logError(`Hata: ${error.message}`);
    logWarning('Lütfen önce: npm run dev -- -p 3003');
    return false;
  }
}

/**
 * Test kullanıcısı oluştur veya mevcut kullanıcıyı al
 */
async function ensureTestUser() {
  logStep('2', 'Test kullanıcısı kontrol/oluşturma');
  
  try {
    // Mevcut test kullanıcısını kontrol et
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id, credit_balance, display_name')
      .eq('email', TEST_USER_EMAIL)
      .single();
    
    if (existingProfile) {
      logSuccess(`Test kullanıcısı bulundu: ${existingProfile.id}`);
      log(`   Mevcut kredi: ${existingProfile.credit_balance || 0}`, 'blue');
      return {
        userId: existingProfile.id,
        initialBalance: existingProfile.credit_balance || 0,
      };
    }
    
    // Yeni test kullanıcısı oluştur
    logWarning('Test kullanıcısı bulunamadı, yeni kullanıcı oluşturuluyor...');

    // UUID formatında test kullanıcısı oluştur (crypto randomUUID)
    const { randomUUID } = await import('crypto');
    const testUserId = randomUUID();

    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: testUserId,
        email: TEST_USER_EMAIL,
        display_name: 'Test Shopier User',
        credit_balance: 0,
        created_at: new Date().toISOString(),
      });
    
    if (insertError) {
      throw new Error(`Kullanıcı oluşturulamadı: ${insertError.message}`);
    }
    
    logSuccess(`Yeni test kullanıcısı oluşturuldu: ${testUserId}`);
    return {
      userId: testUserId,
      initialBalance: 0,
    };
  } catch (error) {
    logError(`Test kullanıcısı hatası: ${error.message}`);
    throw error;
  }
}

/**
 * Shopier webhook payload gönder
 */
async function sendWebhookPayload(userId, orderId) {
  logStep('3', 'Shopier webhook payload gönderiliyor');
  
  const webhookPayload = {
    platform_order_id: orderId,
    status: 'success',
    payment_status: 'success',
    total_order_value: '50.00',
    amount: 50.00,
    currency: 'TRY',
    transaction_id: `SHOPIER_${Date.now()}`,
    shopier_payment_id: `PAY_${Date.now()}`,
    timestamp: new Date().toISOString(),
    package_id: TEST_PACKAGE_ID,
    user_id: userId,
    // Test modu için ek alanlar
    test_mode: true,
    buyer_email: TEST_USER_EMAIL,
    buyer_name: 'Test Shopier User',
  };
  
  log(`   Order ID: ${orderId}`, 'blue');
  log(`   Package ID: ${TEST_PACKAGE_ID}`, 'blue');
  log(`   Amount: ${webhookPayload.total_order_value} TRY`, 'blue');
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Test modunda signature kontrolü atlanır
      },
      body: JSON.stringify(webhookPayload),
      timeout: 10000,
    });
    
    const responseData = await response.json();
    
    log(`   Response Status: ${response.status}`, response.ok ? 'green' : 'red');
    log(`   Response Body: ${JSON.stringify(responseData, null, 2)}`, 'blue');
    
    if (response.ok) {
      logSuccess('Webhook başarıyla işlendi (200 OK)');
      return { success: true, data: responseData };
    } else {
      logError(`Webhook başarısız (${response.status})`);
      return { success: false, data: responseData };
    }
  } catch (error) {
    logError(`Webhook isteği başarısız: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Supabase transaction kaydını kontrol et
 */
async function verifyTransaction(userId, orderId, initialBalance) {
  logStep('4', 'Supabase transaction kaydı doğrulanıyor');
  
  try {
    // Transaction kaydını kontrol et
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('ref_id', orderId)
      .eq('ref_type', 'shopier_payment')
      .single();
    
    if (txError || !transaction) {
      logError('Transaction kaydı bulunamadı');
      return false;
    }
    
    logSuccess('Transaction kaydı bulundu');
    log(`   ID: ${transaction.id}`, 'blue');
    log(`   Type: ${transaction.type}`, 'blue');
    log(`   Amount: ${transaction.amount} TRY`, 'blue');
    log(`   Delta Credits: ${transaction.delta_credits}`, 'blue');
    log(`   Reason: ${transaction.reason}`, 'blue');
    
    // Kredi güncellemesini kontrol et
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credit_balance')
      .eq('id', userId)
      .single();
    
    if (profileError || !profile) {
      logError('Profile güncellemesi kontrol edilemedi');
      return false;
    }
    
    const expectedBalance = initialBalance + EXPECTED_CREDITS;
    const actualBalance = profile.credit_balance;
    
    log(`   Önceki bakiye: ${initialBalance}`, 'blue');
    log(`   Eklenen kredi: ${EXPECTED_CREDITS}`, 'blue');
    log(`   Beklenen bakiye: ${expectedBalance}`, 'blue');
    log(`   Gerçek bakiye: ${actualBalance}`, 'blue');
    
    if (actualBalance === expectedBalance) {
      logSuccess('Kredi bakiyesi doğru şekilde güncellendi');
      return true;
    } else {
      logError(`Kredi bakiyesi hatalı (beklenen: ${expectedBalance}, gerçek: ${actualBalance})`);
      return false;
    }
  } catch (error) {
    logError(`Transaction doğrulama hatası: ${error.message}`);
    return false;
  }
}

/**
 * Ana test fonksiyonu
 */
async function runShopierWebhookTest() {
  log('\n╔════════════════════════════════════════════════════╗', 'bright');
  log('║   SHOPIER WEBHOOK LOCAL TEST                      ║', 'bright');
  log('╚════════════════════════════════════════════════════╝\n', 'bright');
  
  const startTime = Date.now();
  const results = {
    serverHealthy: false,
    webhookSuccess: false,
    transactionVerified: false,
    errors: [],
  };
  
  try {
    // 1. Sunucu health check
    results.serverHealthy = await checkServerHealth();
    
    if (!results.serverHealthy) {
      results.errors.push('Server not running on localhost:3003');
      throw new Error('Sunucu çalışmıyor, test durduruluyor');
    }
    
    // 2. Test kullanıcısı
    const { userId, initialBalance } = await ensureTestUser();
    
    // 3. Webhook payload gönder
    const orderId = `TEST_user_${userId}_package_${TEST_PACKAGE_ID}_${Date.now()}`;
    const webhookResult = await sendWebhookPayload(userId, orderId);
    results.webhookSuccess = webhookResult.success;
    
    if (!webhookResult.success) {
      results.errors.push(`Webhook failed: ${webhookResult.error || 'Unknown error'}`);
      throw new Error('Webhook başarısız');
    }
    
    // 4. Transaction ve credit güncellemesini doğrula
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 saniye bekle
    results.transactionVerified = await verifyTransaction(userId, orderId, initialBalance);
    
    if (!results.transactionVerified) {
      results.errors.push('Transaction verification failed');
    }
    
  } catch (error) {
    logError(`\nTest başarısız: ${error.message}`);
    results.errors.push(error.message);
  }
  
  // Sonuç raporu
  const duration = Date.now() - startTime;
  
  log('\n╔════════════════════════════════════════════════════╗', 'bright');
  log('║   TEST SONUÇLARI                                   ║', 'bright');
  log('╚════════════════════════════════════════════════════╝\n', 'bright');
  
  log(`⏱️  Test Süresi: ${duration}ms`, 'cyan');
  log(`🖥️  Sunucu Sağlığı: ${results.serverHealthy ? '✅ OK' : '❌ FAIL'}`, results.serverHealthy ? 'green' : 'red');
  log(`📡 Webhook: ${results.webhookSuccess ? '✅ 200 OK' : '❌ FAIL'}`, results.webhookSuccess ? 'green' : 'red');
  log(`💳 Transaction & Credit: ${results.transactionVerified ? '✅ VERIFIED' : '❌ FAIL'}`, results.transactionVerified ? 'green' : 'red');
  
  if (results.errors.length > 0) {
    log('\n⚠️  Hatalar:', 'yellow');
    results.errors.forEach(err => log(`   - ${err}`, 'red'));
  }
  
  const allPassed = results.serverHealthy && results.webhookSuccess && results.transactionVerified;
  
  if (allPassed) {
    log('\n╔════════════════════════════════════════════════════╗', 'green');
    log('║   ✅ TÜM TESTLER BAŞARILI                         ║', 'green');
    log('╚════════════════════════════════════════════════════╝\n', 'green');
  } else {
    log('\n╔════════════════════════════════════════════════════╗', 'red');
    log('║   ❌ BAZI TESTLER BAŞARISIZ                       ║', 'red');
    log('╚════════════════════════════════════════════════════╝\n', 'red');
  }
  
  // Sandbox durumu raporu
  log('\n╔════════════════════════════════════════════════════╗', 'cyan');
  log('║   📋 SANDBOX DURUMU VE DEPLOY ÖNERİLERİ           ║', 'cyan');
  log('╚════════════════════════════════════════════════════╝\n', 'cyan');
  
  if (!results.serverHealthy) {
    log('❌ LOCAL SANDBOX MEVCUT DEĞİL', 'yellow');
    log('   Sunucu localhost:3003 üzerinde çalışmıyor.\n', 'yellow');
    log('📝 SANDBOX TESTİ İÇİN GEREKLİ ADIMLAR:', 'cyan');
    log('   1. Terminal açın ve şu komutu çalıştırın:');
    log('      npm run dev -- -p 3003\n');
    log('   2. Sunucu başladıktan sonra, yeni bir terminal açın ve şu komutu çalıştırın:');
    log('      node scripts/shopier-local-webhook.mjs\n');
    log('   3. Test başarılı olursa aşağıdakileri göreceksiniz:');
    log('      ✅ Webhook 200 OK yanıtı');
    log('      ✅ Supabase transaction kaydı oluşturuldu');
    log('      ✅ Kullanıcı kredisi güncellendi\n');
  } else if (!results.webhookSuccess) {
    log('⚠️  WEBHOOK ENDPOINT HATASI', 'yellow');
    log('   Sunucu çalışıyor ama webhook endpoint\'i hata verdi.\n', 'yellow');
    log('📝 HATA GİDERME ÖNERİLERİ:', 'cyan');
    log('   1. API route dosyasını kontrol edin: src/app/api/webhook/shopier/route.ts');
    log('   2. Console log\'larını kontrol edin');
    log('   3. Supabase bağlantısını kontrol edin\n');
  } else if (!results.transactionVerified) {
    log('⚠️  SUPABASE DOĞRULAMA HATASI', 'yellow');
    log('   Webhook başarılı ama Supabase kaydı doğrulanamadı.\n', 'yellow');
    log('📝 HATA GİDERME ÖNERİLERİ:', 'cyan');
    log('   1. Supabase credentials kontrol edin (.env.local)');
    log('   2. Transactions tablosunun var olduğundan emin olun');
    log('   3. Profiles tablosunun var olduğundan emin olun\n');
  }
  
  log('🚀 PRODUCTION DEPLOY ÖNCESİ KONTROL LİSTESİ:', 'cyan');
  log('   [ ] Shopier API credentials production değerleriyle güncellenmiş mi?');
  log('   [ ] SHOPIER_TEST_MODE=false olarak ayarlanmış mı?');
  log('   [ ] Webhook URL production domain\'i gösteriyor mu?');
  log('   [ ] Supabase production keys kullanılıyor mu?');
  log('   [ ] Email bildirimleri yapılandırılmış mı?');
  log('   [ ] Rate limiting ve security ayarları aktif mi?\n');
  
  log('📚 İLGİLİ DOSYALAR:', 'cyan');
  log('   - Webhook Endpoint: src/app/api/webhook/shopier/route.ts');
  log('   - Shopier Config: src/lib/payment/shopier-config.ts');
  log('   - Payment Utils: src/lib/payment/payment-utils.ts');
  log('   - Security: src/lib/payment/shopier-security.ts');
  log('   - Environment: .env.local (production: .env.production)\n');
  
  log('═══════════════════════════════════════════════════════', 'cyan');
  log(`Test tamamlandı: ${new Date().toLocaleString('tr-TR')}`, 'cyan');
  log('═══════════════════════════════════════════════════════\n', 'cyan');
  
  process.exit(allPassed ? 0 : 1);
}

// Test'i çalıştır
runShopierWebhookTest().catch(error => {
  logError(`Fatal error: ${error.message}`);
  process.exit(1);
});

