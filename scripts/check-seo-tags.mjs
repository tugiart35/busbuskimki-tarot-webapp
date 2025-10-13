#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const srcDir = join(projectRoot, 'src', 'app');

console.log('='.repeat(80));
console.log('SEO Tags Analysis Report');
console.log('Generated:', new Date().toISOString());
console.log('='.repeat(80));
console.log();

// Tüm page.tsx ve layout.tsx dosyalarını bul
function getAllPages(dir, pageList = []) {
  try {
    const files = readdirSync(dir);
    
    for (const file of files) {
      const filePath = join(dir, file);
      const stat = statSync(filePath);
      
      if (stat.isDirectory()) {
        // API routes, _private klasörleri ve node_modules'u atla
        if (!file.startsWith('_') && !file.startsWith('.') && file !== 'node_modules' && file !== 'api') {
          getAllPages(filePath, pageList);
        }
      } else if (file === 'page.tsx' || file === 'layout.tsx') {
        pageList.push(filePath);
      }
    }
  } catch (error) {
    // Sessizce atla
  }
  
  return pageList;
}

// Metadata içeriğini analiz et
function analyzeMetadata(content, filePath) {
  const issues = [];
  const suggestions = [];
  
  // Metadata export kontrolü
  const hasMetadataExport = /export\s+const\s+metadata/.test(content);
  const hasGenerateMetadata = /export\s+async\s+function\s+generateMetadata/.test(content);
  
  if (!hasMetadataExport && !hasGenerateMetadata) {
    issues.push('No metadata export or generateMetadata function found');
    return { issues, suggestions, hasMetadata: false };
  }
  
  // alternates (hreflang) kontrolü
  const hasAlternates = /alternates\s*:/i.test(content);
  const hasLanguages = /languages\s*:/i.test(content);
  const hasCanonical = /canonical\s*:/i.test(content);
  
  if (!hasAlternates && !hasLanguages) {
    issues.push('Missing alternates.languages for hreflang tags');
    suggestions.push('Add alternates.languages with tr, en, sr locales');
  }
  
  if (!hasCanonical) {
    issues.push('Missing canonical URL');
    suggestions.push('Add alternates.canonical for proper SEO');
  }
  
  // OpenGraph kontrolü
  const hasOpenGraph = /openGraph\s*:/i.test(content);
  if (!hasOpenGraph) {
    suggestions.push('Consider adding OpenGraph metadata for social sharing');
  }
  
  // Twitter Card kontrolü
  const hasTwitter = /twitter\s*:/i.test(content);
  if (!hasTwitter) {
    suggestions.push('Consider adding Twitter Card metadata');
  }
  
  // Title ve description kontrolü
  const hasTitle = /title\s*:/i.test(content);
  const hasDescription = /description\s*:/i.test(content);
  
  if (!hasTitle) {
    issues.push('Missing title metadata');
  }
  
  if (!hasDescription) {
    issues.push('Missing description metadata');
  }
  
  // robots kontrolü
  const hasRobots = /robots\s*:/i.test(content);
  const hasNoIndex = /noindex/i.test(content);
  
  if (hasNoIndex) {
    suggestions.push('Page has noindex - verify if intentional');
  }
  
  return { 
    issues, 
    suggestions, 
    hasMetadata: true,
    hasAlternates,
    hasCanonical,
    hasOpenGraph,
    hasTwitter,
    hasTitle,
    hasDescription,
    hasRobots
  };
}

// Route'u belirle
function getRoute(filePath) {
  const relativePath = relative(srcDir, filePath);
  const parts = relativePath.split('/');
  
  // [locale] gibi dynamic segments'i kaldır
  const cleanParts = parts
    .filter(p => p !== 'page.tsx' && p !== 'layout.tsx')
    .map(p => p.replace(/\[|\]/g, ''));
  
  return '/' + cleanParts.join('/');
}

// Tüm sayfaları analiz et
const pages = getAllPages(srcDir);
console.log(`Found ${pages.length} page/layout files\n`);
console.log('='.repeat(80));

const results = {
  total: pages.length,
  withMetadata: 0,
  withAlternates: 0,
  withCanonical: 0,
  withoutMetadata: [],
  missingAlternates: [],
  missingCanonical: [],
  allIssues: []
};

for (const filePath of pages) {
  const content = readFileSync(filePath, 'utf-8');
  const route = getRoute(filePath);
  const fileName = relative(projectRoot, filePath);
  
  console.log(`\nAnalyzing: ${fileName}`);
  console.log(`Route: ${route}`);
  console.log('-'.repeat(80));
  
  const analysis = analyzeMetadata(content, filePath);
  
  if (analysis.hasMetadata) {
    results.withMetadata++;
    console.log('✓ Has metadata export');
    
    if (analysis.hasAlternates) {
      results.withAlternates++;
      console.log('✓ Has alternates (hreflang)');
    } else {
      results.missingAlternates.push({ route, file: fileName });
      console.log('✗ Missing alternates (hreflang)');
    }
    
    if (analysis.hasCanonical) {
      results.withCanonical++;
      console.log('✓ Has canonical URL');
    } else {
      results.missingCanonical.push({ route, file: fileName });
      console.log('✗ Missing canonical URL');
    }
    
    if (analysis.hasOpenGraph) {
      console.log('✓ Has OpenGraph metadata');
    }
    
    if (analysis.hasTwitter) {
      console.log('✓ Has Twitter Card metadata');
    }
    
    if (analysis.hasTitle) {
      console.log('✓ Has title');
    }
    
    if (analysis.hasDescription) {
      console.log('✓ Has description');
    }
  } else {
    results.withoutMetadata.push({ route, file: fileName });
    console.log('✗ No metadata found');
  }
  
  if (analysis.issues.length > 0) {
    console.log('\n❌ Issues:');
    analysis.issues.forEach(issue => {
      console.log(`   - ${issue}`);
      results.allIssues.push({ route, file: fileName, issue });
    });
  }
  
  if (analysis.suggestions.length > 0) {
    console.log('\n💡 Suggestions:');
    analysis.suggestions.forEach(suggestion => {
      console.log(`   - ${suggestion}`);
    });
  }
}

// Özet rapor
console.log('\n\n' + '='.repeat(80));
console.log('SUMMARY REPORT');
console.log('='.repeat(80));
console.log();

console.log(`Total pages analyzed: ${results.total}`);
console.log(`Pages with metadata: ${results.withMetadata} (${Math.round(results.withMetadata/results.total*100)}%)`);
console.log(`Pages with alternates (hreflang): ${results.withAlternates} (${Math.round(results.withAlternates/results.total*100)}%)`);
console.log(`Pages with canonical URLs: ${results.withCanonical} (${Math.round(results.withCanonical/results.total*100)}%)`);
console.log();

if (results.withoutMetadata.length > 0) {
  console.log('❌ PAGES WITHOUT METADATA:');
  console.log('-'.repeat(80));
  results.withoutMetadata.forEach((item, index) => {
    console.log(`${(index + 1).toString().padStart(3)}. ${item.route}`);
    console.log(`     File: ${item.file}`);
  });
  console.log();
}

if (results.missingAlternates.length > 0) {
  console.log('⚠️  PAGES MISSING HREFLANG (alternates.languages):');
  console.log('-'.repeat(80));
  results.missingAlternates.forEach((item, index) => {
    console.log(`${(index + 1).toString().padStart(3)}. ${item.route}`);
    console.log(`     File: ${item.file}`);
  });
  console.log();
}

if (results.missingCanonical.length > 0) {
  console.log('⚠️  PAGES MISSING CANONICAL URL:');
  console.log('-'.repeat(80));
  results.missingCanonical.forEach((item, index) => {
    console.log(`${(index + 1).toString().padStart(3)}. ${item.route}`);
    console.log(`     File: ${item.file}`);
  });
  console.log();
}

// Öneri listesi
console.log('='.repeat(80));
console.log('RECOMMENDATIONS');
console.log('='.repeat(80));
console.log();

console.log('1. Add alternates.languages to all pages for proper hreflang support:');
console.log('   ```typescript');
console.log('   alternates: {');
console.log('     languages: {');
console.log('       tr: "/tr/your-page",');
console.log('       en: "/en/your-page",');
console.log('       sr: "/sr/your-page"');
console.log('     }');
console.log('   }');
console.log('   ```');
console.log();

console.log('2. Add canonical URL to all pages:');
console.log('   ```typescript');
console.log('   alternates: {');
console.log('     canonical: "https://yoursite.com/your-page"');
console.log('   }');
console.log('   ```');
console.log();

console.log('3. Consider adding OpenGraph and Twitter Card metadata for better social sharing.');
console.log();

console.log('='.repeat(80));
console.log('END OF SEO REPORT');
console.log('='.repeat(80));

