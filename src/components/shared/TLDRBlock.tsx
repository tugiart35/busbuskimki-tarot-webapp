/**
 * TL;DR Block Component - AI-Friendly Content Summarization
 *
 * AI language modelleri (ChatGPT, Claude, Perplexity) için optimize edilmiş
 * özet içerik bloğu. Hızlı bilgi erişimi ve snippet oluşturma için tasarlandı.
 *
 * LLMO/GEO Optimization: Bu component, içeriğin AI'lar tarafından daha kolay
 * anlaşılması ve özetlenmesi için yapılandırılmış veri sunar.
 */

interface TLDRBlockProps {
  /** Kısa özet (1-2 cümle, max 200 karakter) */
  summary: string;
  /** Ana noktalar listesi (3-5 madde önerilir) */
  keyPoints: string[];
  /** Dil kodu (tr, en, sr) */
  locale?: string;
  /** Opsiyonel özel sınıf adı */
  className?: string;
}

export function TLDRBlock({
  summary,
  keyPoints,
  locale = 'tr',
  className = '',
}: TLDRBlockProps) {
  const title =
    locale === 'tr'
      ? '📝 Özet (TL;DR)'
      : locale === 'en'
        ? '📝 Summary (TL;DR)'
        : '📝 Резиме (TL;DR)';

  const label =
    locale === 'tr'
      ? 'Ana Noktalar:'
      : locale === 'en'
        ? 'Key Points:'
        : 'Кључне тачке:';

  return (
    <div
      className={`bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8 border border-purple-200 dark:border-purple-800 ${className}`}
      itemScope
      itemType='https://schema.org/Summary'
    >
      <h2 className='text-2xl font-bold mb-4 text-purple-900 dark:text-purple-100 flex items-center gap-2'>
        {title}
      </h2>

      {/* Kısa Özet */}
      <p
        className='text-lg mb-5 text-gray-800 dark:text-gray-200 leading-relaxed font-medium'
        itemProp='description'
      >
        {summary}
      </p>

      {/* Ana Noktalar */}
      <div className='space-y-1'>
        <p className='text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2'>
          {label}
        </p>
        <ul
          className='space-y-2'
          itemProp='itemListElement'
          itemScope
          itemType='https://schema.org/ItemList'
        >
          {keyPoints.map((point, idx) => (
            <li
              key={idx}
              className='flex items-start gap-3'
              itemProp='itemListElement'
              itemScope
              itemType='https://schema.org/ListItem'
            >
              <span className='text-purple-600 dark:text-purple-400 mt-1 text-lg font-bold'>
                ✓
              </span>
              <span
                className='text-gray-700 dark:text-gray-300 flex-1'
                itemProp='name'
              >
                {point}
              </span>
              <meta itemProp='position' content={String(idx + 1)} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Kullanım Örneği:
 *
 * ```tsx
 * <TLDRBlock
 *   summary="Joker kartı, yeni başlangıçları, saf potansiyeli ve sınırsız olasılıkları temsil eder."
 *   keyPoints={[
 *     "Yeni bir yolculuğun başlangıcı",
 *     "Risk alma ve spontane davranma isteği",
 *     "Geçmiş tecrübelerden özgür olma",
 *     "Güven ve iyimserlik enerjisi"
 *   ]}
 *   locale="tr"
 * />
 * ```
 */
