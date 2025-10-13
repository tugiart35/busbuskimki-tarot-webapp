// test-keys.js
const fs = require('fs');

const tr = JSON.parse(fs.readFileSync('./messages/tr.json', 'utf-8'));

// Test edilecek anahtarlar
const testKeys = [
  'dashboard.packages.featureNumerology',
  'auth.page.nameTooShort',
  'legalPages.accessibility.title',
  'footer.legalPages.cookiePolicy.title',
  'common.locale',
  'common.close',
  'dashboard.packages.featureLove',
  'dashboard.statistics',
  'dashboard.profile',
];

console.log('\n🔍 TR.JSON ANAHTAR KONTROLÜ\n');

testKeys.forEach(key => {
  const parts = key.split('.');
  let current = tr;
  let found = true;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      found = false;
      break;
    }
  }

  console.log(`${found ? '✅' : '❌'} ${key}`);
  if (found && typeof current === 'string') {
    console.log(
      `   → "${current.substring(0, 60)}${current.length > 60 ? '...' : ''}"`
    );
  }
});

// Dashboard objesi yapısını kontrol et
console.log('\n📦 DASHBOARD YAPISI:\n');
if (tr.dashboard) {
  console.log('dashboard keys:', Object.keys(tr.dashboard).slice(0, 20));
  if (tr.dashboard.packages) {
    console.log(
      '\ndashboard.packages keys:',
      Object.keys(tr.dashboard.packages).slice(0, 20)
    );
  } else {
    console.log('\n❌ dashboard.packages YOK!');
  }
} else {
  console.log('❌ dashboard YOK!');
}

// Auth objesi kontrolü
console.log('\n📦 AUTH YAPISI:\n');
if (tr.auth) {
  console.log('auth keys:', Object.keys(tr.auth).slice(0, 20));
  if (tr.auth.page) {
    console.log('\nauth.page keys:', Object.keys(tr.auth.page).slice(0, 20));
  } else {
    console.log('\n❌ auth.page YOK!');
  }
} else {
  console.log('❌ auth YOK!');
}

// LegalPages objesi kontrolü
console.log('\n📦 LEGALPAGES YAPISI:\n');
if (tr.legalPages) {
  console.log('legalPages keys:', Object.keys(tr.legalPages).slice(0, 20));
  if (tr.legalPages.accessibility) {
    console.log(
      '\nlegalPages.accessibility keys:',
      Object.keys(tr.legalPages.accessibility)
    );
  } else {
    console.log('\n❌ legalPages.accessibility YOK!');
  }
} else {
  console.log('❌ legalPages YOK!');
}

// Footer objesi kontrolü
console.log('\n📦 FOOTER YAPISI:\n');
if (tr.footer) {
  console.log('footer keys:', Object.keys(tr.footer).slice(0, 20));
  if (tr.footer.legalPages) {
    console.log(
      '\nfooter.legalPages keys:',
      Object.keys(tr.footer.legalPages).slice(0, 20)
    );
    if (tr.footer.legalPages.cookiePolicy) {
      console.log(
        '\nfooter.legalPages.cookiePolicy keys:',
        Object.keys(tr.footer.legalPages.cookiePolicy).slice(0, 20)
      );
    }
  } else {
    console.log('\n❌ footer.legalPages YOK!');
  }
} else {
  console.log('❌ footer YOK!');
}
