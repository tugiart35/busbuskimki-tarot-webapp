**Publisher ID:** `ca-pub-1429338163231803`

**Eklenen Kod (src/app/layout.tsx:74-78):**

```html
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1429338163231803"
  crossorigin="anonymous"
/>
```

### **3. Deployment Sonrası Kontroller**

#### **A) Build Test**

```bash
npm run build
```

#### **B) Kod Doğrulama**

```bash
# Deployment sonrası test
curl https://busbuskimki.com | grep "pagead2.googlesyndication.com"

# Beklenen çıktı:
# <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1429338163231803" crossOrigin="anonymous"></script>
```

### **4. AdSense Doğrulama Adımları**

1. **Kodu Güncelleyin** (yukarıdaki değişiklikler)
2. **Deploy Edin** (Vercel'e push)
3. **Google AdSense'e Dönün**
4. **"Kodu yerleştirdim"** checkbox'ını işaretleyin
5. **"Doğrula"** butonuna tıklayın

### **5. Environment Variables Kontrolü**
