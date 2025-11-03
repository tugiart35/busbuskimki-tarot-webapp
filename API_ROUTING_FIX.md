# API Routing Fix

## Sorun
Next.js hatası:
```
Error: You cannot use different slug names for the same dynamic path ('locale' !== 'slug').
```

## Neden
Mevcut route: `/api/cards/[locale]/[slug]`
Yeni routes: `/api/cards/[slug]/reactions`

Next.js aynı segment'te farklı dynamic parametre isimleri kabul etmiyor.

## Çözüm
API endpoint'leri yeniden yapılandırıldı:

### ❌ Önceki Yapı
```
/api/cards/[slug]/reactions/route.ts
/api/cards/[slug]/comments/route.ts
/api/cards/[slug]/stats/route.ts
/api/pages/[pageId]/reactions/route.ts
```

### ✅ Yeni Yapı
```
/api/engagement/cards/[slug]/reactions/route.ts
/api/engagement/cards/[slug]/comments/route.ts
/api/engagement/cards/[slug]/stats/route.ts
/api/engagement/pages/[pageId]/reactions/route.ts
```

## Frontend Güncellemeleri

Tüm API çağrıları güncellendi:

- **CardReactions.tsx**: `/api/engagement/cards/[slug]/reactions`
- **PageReactions.tsx**: `/api/engagement/pages/[pageId]/reactions`
- **CardComments.tsx**: `/api/engagement/cards/[slug]/comments`
- **CardStatsWidget.tsx**: `/api/engagement/cards/[slug]/stats`

## Avantajlar

1. ✅ Next.js routing çakışması çözüldü
2. ✅ Semantik path yapısı: `/engagement` altında tüm kullanıcı etkileşimi
3. ✅ Mevcut `/api/cards/[locale]/[slug]` route'u korundu
4. ✅ Gelecekte genişletilebilir: `/api/engagement/readings/`, `/api/engagement/favorites/` vb.

## Test

```bash
# Dev server başlat
npm run dev

# Endpoint'leri test et
curl http://localhost:3000/api/engagement/cards/joker/reactions?fingerprint=test
```

Sonuç: ✅ Server başarıyla çalışıyor, routing hatası çözüldü!


