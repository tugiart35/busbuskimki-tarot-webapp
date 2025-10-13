#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const srcDir = join(projectRoot, 'src');
const publicDir = join(projectRoot, 'public');

console.log('='.repeat(80));
console.log('Image srcset & Responsive Analysis Report');
console.log('Generated:', new Date().toISOString());
console.log('='.repeat(80));
console.log();

// Tüm kaynak dosyaları bul
function getAllSourceFiles(dir, fileList = []) {
  try {
    const files = readdirSync(dir);
    
    for (const file of files) {
      const filePath = join(dir, file);
      const stat = statSync(filePath);
      
      if (stat.isDirectory()) {
        // node_modules, .next, gibi klasörleri atla
        if (!file.startsWith('.') && file !== 'node_modules') {
          getAllSourceFiles(filePath, fileList);
        }
      } else if (['.tsx', '.jsx', '.ts', '.js'].includes(extname(file))) {
        fileList.push(filePath);
      }
    }
  } catch (error) {
    // Sessizce atla
  }
  
  return fileList;
}

// Görselleri analiz et
function analyzeImages(content, filePath) {
  const issues = [];
  const suggestions = [];
  
  // Next.js Image component'lerini bul (bunlar otomatik srcset oluşturur - OK)
  const nextImageMatches = content.match(/<Image\s+[^>]*>/g) || [];
  const nextImageImports = /import\s+.*Image.*from\s+['"]next\/image['"]/g.test(content);
  
  // HTML img taglerini bul
  const imgTagMatches = content.match(/<img\s+[^>]*>/gi) || [];
  
  // img taglerinde srcset olmayan olanları bul
  const imgWithoutSrcset = imgTagMatches.filter(img => {
    return !/srcset\s*=/i.test(img);
  });
  
  // Background image'leri bul (CSS style içinde)
  const bgImageMatches = content.match(/style=\{[^}]*background-image[^}]*\}/gi) || [];
  const bgImageInlineMatches = content.match(/style="[^"]*background-image[^"]*"/gi) || [];
  
  // Analiz sonuçları
  const results = {
    nextImages: nextImageMatches.length,
    htmlImages: imgTagMatches.length,
    imagesWithoutSrcset: imgWithoutSrcset.length,
    backgroundImages: bgImageMatches.length + bgImageInlineMatches.length,
    hasNextImageImport: nextImageImports
  };
  
  // Issues ve suggestions oluştur
  if (imgWithoutSrcset.length > 0) {
    issues.push(`Found ${imgWithoutSrcset.length} <img> tag(s) without srcset attribute`);
    suggestions.push('Consider using Next.js Image component for automatic responsive images');
    suggestions.push('Or add srcset attribute for responsive image loading');
  }
  
  if (imgTagMatches.length > 0 && !nextImageImports) {
    suggestions.push('Consider importing Next.js Image component for better performance');
  }
  
  if (results.backgroundImages > 0) {
    suggestions.push(`Found ${results.backgroundImages} background-image(s) - consider using image-set() for responsive backgrounds`);
  }
  
  return { 
    issues, 
    suggestions,
    results,
    imgWithoutSrcset
  };
}

// Büyük görselleri listele
function listLargeImages() {
  console.log('\n' + '='.repeat(80));
  console.log('LARGE IMAGES (>200KB)');
  console.log('='.repeat(80));
  console.log();
  
  try {
    const largeAssetsContent = readFileSync(join(projectRoot, 'PREDEPLOY-REPORT', '05_LARGE_ASSETS.txt'), 'utf-8');
    const largeFiles = largeAssetsContent.trim().split('\n').filter(f => f.trim());
    
    if (largeFiles.length === 0) {
      console.log('✓ No images larger than 200KB found!');
      return 0;
    }
    
    console.log(`Found ${largeFiles.length} large image(s):\n`);
    largeFiles.forEach((file, index) => {
      console.log(`${(index + 1).toString().padStart(3)}. ${file}`);
      try {
        const stat = statSync(join(projectRoot, file));
        const sizeKB = Math.round(stat.size / 1024);
        console.log(`     Size: ${sizeKB} KB`);
      } catch (e) {
        // File might not exist
      }
    });
    
    console.log('\n⚠️  RECOMMENDATION: Consider optimizing these images:');
    console.log('   - Convert to WebP format for better compression');
    console.log('   - Use responsive image formats (multiple sizes)');
    console.log('   - Implement lazy loading');
    console.log('   - Use Next.js Image component with automatic optimization');
    
    return largeFiles.length;
  } catch (error) {
    console.log('⚠️  Could not read PREDEPLOY-REPORT/05_LARGE_ASSETS.txt');
    return 0;
  }
}

// Ana analiz
const sourceFiles = getAllSourceFiles(srcDir);
console.log(`Found ${sourceFiles.length} source files to analyze\n`);
console.log('='.repeat(80));

const results = {
  totalFiles: sourceFiles.length,
  filesWithImages: 0,
  filesWithIssues: 0,
  totalNextImages: 0,
  totalHtmlImages: 0,
  totalImagesWithoutSrcset: 0,
  totalBackgroundImages: 0,
  issueFiles: []
};

for (const filePath of sourceFiles) {
  const content = readFileSync(filePath, 'utf-8');
  const fileName = relative(projectRoot, filePath);
  
  const analysis = analyzeImages(content, filePath);
  
  // İstatistikleri güncelle
  if (analysis.results.nextImages > 0 || analysis.results.htmlImages > 0 || analysis.results.backgroundImages > 0) {
    results.filesWithImages++;
    results.totalNextImages += analysis.results.nextImages;
    results.totalHtmlImages += analysis.results.htmlImages;
    results.totalImagesWithoutSrcset += analysis.results.imagesWithoutSrcset;
    results.totalBackgroundImages += analysis.results.backgroundImages;
    
    if (analysis.issues.length > 0) {
      results.filesWithIssues++;
      results.issueFiles.push({
        file: fileName,
        issues: analysis.issues,
        suggestions: analysis.suggestions,
        results: analysis.results
      });
      
      console.log(`\n⚠️  ${fileName}`);
      console.log('-'.repeat(80));
      console.log(`   Next.js Images: ${analysis.results.nextImages}`);
      console.log(`   HTML <img> tags: ${analysis.results.htmlImages}`);
      console.log(`   Images without srcset: ${analysis.results.imagesWithoutSrcset}`);
      console.log(`   Background images: ${analysis.results.backgroundImages}`);
      
      if (analysis.issues.length > 0) {
        console.log('\n   ❌ Issues:');
        analysis.issues.forEach(issue => console.log(`      - ${issue}`));
      }
      
      if (analysis.suggestions.length > 0) {
        console.log('\n   💡 Suggestions:');
        analysis.suggestions.forEach(suggestion => console.log(`      - ${suggestion}`));
      }
    }
  }
}

// Liste large images
const largeImageCount = listLargeImages();

// Özet rapor
console.log('\n\n' + '='.repeat(80));
console.log('SUMMARY REPORT');
console.log('='.repeat(80));
console.log();

console.log(`Total source files analyzed: ${results.totalFiles}`);
console.log(`Files with images: ${results.filesWithImages}`);
console.log(`Files with issues: ${results.filesWithIssues}`);
console.log();

console.log('Image Statistics:');
console.log(`  - Next.js <Image> components: ${results.totalNextImages} ✓ (responsive)`);
console.log(`  - HTML <img> tags: ${results.totalHtmlImages}`);
console.log(`  - Images without srcset: ${results.totalImagesWithoutSrcset} ${results.totalImagesWithoutSrcset > 0 ? '⚠️' : '✓'}`);
console.log(`  - Background images: ${results.totalBackgroundImages}`);
console.log(`  - Large images (>200KB): ${largeImageCount} ${largeImageCount > 0 ? '⚠️' : '✓'}`);
console.log();

if (results.issueFiles.length > 0) {
  console.log('❌ FILES WITH IMAGE ISSUES:');
  console.log('-'.repeat(80));
  results.issueFiles.forEach((item, index) => {
    console.log(`${(index + 1).toString().padStart(3)}. ${item.file}`);
    console.log(`     HTML images without srcset: ${item.results.imagesWithoutSrcset}`);
  });
  console.log();
}

// Öneriler
console.log('='.repeat(80));
console.log('RECOMMENDATIONS');
console.log('='.repeat(80));
console.log();

console.log('1. Replace HTML <img> tags with Next.js Image component:');
console.log('   ```tsx');
console.log('   import Image from "next/image";');
console.log('   ');
console.log('   <Image');
console.log('     src="/images/example.jpg"');
console.log('     alt="Description"');
console.log('     width={800}');
console.log('     height={600}');
console.log('     priority={true} // for above-fold images');
console.log('   />');
console.log('   ```');
console.log();

console.log('2. For HTML <img> tags that must stay, add srcset:');
console.log('   ```html');
console.log('   <img');
console.log('     src="/images/example-800.jpg"');
console.log('     srcset="/images/example-400.jpg 400w,');
console.log('             /images/example-800.jpg 800w,');
console.log('             /images/example-1200.jpg 1200w"');
console.log('     sizes="(max-width: 600px) 400px, 800px"');
console.log('     alt="Description"');
console.log('   />');
console.log('   ```');
console.log();

console.log('3. Optimize large images (>200KB):');
console.log('   - Use WebP or AVIF format');
console.log('   - Generate multiple sizes for different devices');
console.log('   - Enable Next.js automatic image optimization');
console.log();

console.log('4. For background images, use image-set():');
console.log('   ```css');
console.log('   background-image: image-set(');
console.log('     url("/images/bg-1x.webp") 1x,');
console.log('     url("/images/bg-2x.webp") 2x');
console.log('   );');
console.log('   ```');
console.log();

const score = Math.round((1 - (results.totalImagesWithoutSrcset / Math.max(results.totalHtmlImages, 1))) * 100);
console.log('='.repeat(80));
console.log(`RESPONSIVE IMAGE SCORE: ${score}%`);
console.log('='.repeat(80));
console.log();

if (score >= 90) {
  console.log('✅ Excellent! Most images are properly optimized.');
} else if (score >= 70) {
  console.log('⚠️  Good, but room for improvement.');
} else {
  console.log('❌ Needs attention. Many images lack proper responsive attributes.');
}

console.log();
console.log('='.repeat(80));
console.log('END OF IMAGE ANALYSIS REPORT');
console.log('='.repeat(80));

