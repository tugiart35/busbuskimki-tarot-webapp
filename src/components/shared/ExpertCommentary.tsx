'use client';

interface ExpertCommentaryProps {
  locale: 'tr' | 'en' | 'sr';
  cardId?: string;
  cardName?: string;
  title?: string;
  content?: string;
  isGeneral?: boolean;
}

export function ExpertCommentary({
  locale,
  cardId: _cardId,
  cardName,
  title,
  content,
  isGeneral = false,
}: ExpertCommentaryProps) {
  const getDefaultTitle = () => {
    if (isGeneral) {
      return locale === 'tr'
        ? '✨ Büşbüşkimki Yorumu: Tarot ve İçsel Keşif'
        : locale === 'en'
          ? '✨ Büşbüşkimki Commentary: Tarot and Inner Discovery'
          : '✨ Büşbüşkimki Komentar: Tarot i Unutrašnje Otkriće';
    }

    const cardTitle = cardName || (locale === 'tr' ? 'Bu Kart' : locale === 'en' ? 'This Card' : 'Ova Karta');
    return locale === 'tr'
      ? `✨ Büşbüşkimki Yorumu: ${cardTitle}`
      : locale === 'en'
        ? `✨ Büşbüşkimki Commentary: ${cardTitle}`
        : `✨ Büşbüşkimki Komentar: ${cardTitle}`;
  };

  const getDefaultContent = () => {
    if (isGeneral) {
      return locale === 'tr'
        ? 'Tarot, yüzyıllardır insanların içsel yolculuklarında rehber olmuş evrensel bir bilgelik aracıdır. Her kart, yaşam deneyimlerimizin farklı yönlerini ve içsel dinamiklerimizi yansıtır. Büşbüşkimki olarak, tarot kartlarını sadece fal aracı değil, aynı zamanda kendini tanıma, iç gözlem ve farkındalık geliştirme yolu olarak görüyoruz. Kartlar, duygusal ve zihinsel durumumuzu yansıtan bir ayna işlevi görerek, içsel çatışmalarımızı ve potansiyelimizi keşfetmemize yardımcı olur. Her okuma, kendi içinizdeki cevapları bulmanız için bir fırsattır.'
        : locale === 'en'
          ? 'Tarot has been a universal wisdom tool guiding people in their inner journeys for centuries. Each card reflects different aspects of our life experiences and inner dynamics. At Büşbüşkimki, we see tarot cards not just as fortune-telling tools, but as a path for self-discovery, introspection, and awareness development. The cards function as a mirror reflecting our emotional and mental state, helping us discover our inner conflicts and potential. Every reading is an opportunity to find the answers within yourself.'
          : 'Tarot je vekovima bio univerzalni alat mudrosti koji vodi ljude na njihovim unutrašnjim putovanjima. Svaka karta odražava različite aspekte naših životnih iskustava i unutrašnjih dinamika. U Büşbüşkimki, vidimo tarot karte ne samo kao alat za gatanje, već kao put za samootkrivanje, introspektivu i razvoj svesti. Karte funkcionišu kao ogledalo koje odražava naše emocionalno i mentalno stanje, pomažući nam da otkrijemo naše unutrašnje konflikte i potencijal. Svako čitanje je prilika da pronađete odgovore unutar sebe.';
    }

    if (cardName && (cardName.includes('Deli') || cardName?.includes('Fool') || cardName?.includes('Joker'))) {
      return locale === 'tr'
        ? 'Deli kartı, yeni başlangıçların ve bilinmeyene adım atmanın cesaret gerektiren yolculuğunu temsil eder. Bilinmeyene atılan adım, çoğu zaman belirsizlik ve heyecanı aynı anda getirir. Bu kart, hayatımızda "kontrolü bırakma" ve akışa güvenme ihtiyacını işaret eder. Deli, yalnızca spontane davranmayı değil, yeni deneyimlere açık olmayı ve hayata güvenmeyi anlatır.\n\nRisk ile özgürlük arasındaki çizgideyiz. Plan yapmadan hareket ettiğimizde düşebiliriz, fakat bazen tam da o düşüş bizi yeniden doğurur. Kendimize şunu sorabiliriz: "Bugün kendim için küçük de olsa hangi yeni adımı atabilirim?"\n\nDeli, iç çocuğumuzu, merakımızı ve yaratıcı potansiyelimizi temsil eder. Yetişkin sorumluluklarının ağırlığı altında unuttuğumuz o saf keşif duygusu... İşte Deli tam da bunu hatırlatır: Hayat ciddi olmayı gerektirirken, aynı zamanda oyunbaz ve meraklı kalmayı da unutmamalıyız.'
        : locale === 'en'
          ? 'The Fool card represents the courageous journey of new beginnings and stepping into the unknown. The step into the unknown often brings uncertainty and excitement at the same time. This card indicates the need to "let go of control" and trust the flow in our lives. The Fool speaks not only of spontaneous action, but also of being open to new experiences and trusting life.\n\nWe are on the line between risk and freedom. When we act without planning, we may fall, but sometimes that fall is what gives us rebirth. We can ask ourselves: "What new step, however small, can I take for myself today?"\n\nThe Fool represents our inner child, our curiosity, and our creative potential. That sense of pure exploration that we forget under the weight of adult responsibilities... That\'s exactly what the Fool reminds us: While life requires being serious, we must also not forget to remain playful and curious.'
          : 'Karta Luđaka predstavlja hrabro putovanje novih početaka i koraka u nepoznato. Korak u nepoznato često donosi neizvesnost i uzbuđenje istovremeno. Ova karta ukazuje na potrebu da "pustimo kontrolu" i verujemo toku u našim životima. Luđak govori ne samo o spontanom delovanju, već i o otvorenosti prema novim iskustvima i poverenju u život.\n\nNa liniji smo između rizika i slobode. Kada delujemo bez planiranja, možemo pasti, ali ponekad upravo taj pad donosi ponovno rođenje. Možemo se zapitati: "Koji novi korak, ma koliko mali, mogu danas napraviti za sebe?"\n\nLuđak predstavlja naše unutrašnje dete, našu radoznalost i naš kreativni potencijal. Onaj osećaj čiste istrage koji zaboravljamo pod težinom odraslih odgovornosti... To je upravo ono što nas Luđak podseća: Dok život zahteva da budemo ozbiljni, takođe ne smemo zaboraviti da ostanemo razigrani i radoznali.';
    }

    return locale === 'tr'
      ? 'Bu kart, kişisel gelişim ve farkındalık yolculuğunuzda önemli bir aşamayı temsil eder. Her tarot kartı gibi, bu da evrensel sembolleri yansıtır ve içsel dinamiklerinizi anlama yolunda size rehberlik eder. Tarot, kendini tanıma ve iç gözlem geliştirme için güçlü bir araçtır.'
      : locale === 'en'
        ? 'This card represents an important stage in your journey of personal development and awareness. Like every tarot card, it reflects universal symbols and guides you in understanding your inner dynamics. Tarot is a powerful tool for self-discovery and developing introspection.'
        : 'Ova karta predstavlja važnu fazu vašeg putovanja ličnog razvoja i svesti. Kao i svaka tarot karta, odražava univerzalne simbole i vodi vas u razumevanju vaših unutrašnjih dinamika. Tarot je moćan alat za samootkrivanje i razvoj introspektive.';
  };

  const displayTitle = title || getDefaultTitle();
  const displayContent = content || getDefaultContent();

  return (
    <section className='py-16 px-4 bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-teal-200'>
          {/* Header with Brand Badge */}
          <div className='bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6'>
            <div className='flex items-center gap-4 mb-3'>
              <div className='w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg'>
                <span className='text-3xl'>✨</span>
              </div>
              <div>
                <p className='text-purple-100 text-sm font-medium uppercase tracking-wide'>
                  {locale === 'tr' ? 'BÜŞBÜŞKIMKI YORUMU' : locale === 'en' ? 'BÜŞBÜŞKIMKI COMMENTARY' : 'BÜŞBÜŞKIMKI KOMENTAR'}
                </p>
                <p className='text-white text-xs'>
                  {locale === 'tr' ? 'İçsel Keşif ve Farkındalık Rehberi' : locale === 'en' ? 'Inner Discovery and Awareness Guide' : 'Vodič za Unutrašnje Otkriće i Svest'}
                </p>
              </div>
            </div>
            <h2 className='text-2xl lg:text-3xl font-bold text-white'>
              {displayTitle}
            </h2>
          </div>

          {/* Content */}
          <div className='p-8 lg:p-10'>
            <div className='prose prose-lg max-w-none'>
              <div className='space-y-4 text-gray-700 leading-relaxed'>
                {displayContent.split('\n\n').map((paragraph, index) => (
                  <p key={index} className='text-base lg:text-lg'>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Author Info */}
            <div className='mt-8 pt-6 border-t-2 border-gray-200'>
              <div className='flex items-start gap-4'>
                <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0'>
                  🔮
                </div>
                <div>
                  <h4 className='font-bold text-gray-900 text-lg mb-1'>
                    {locale === 'tr'
                      ? 'Büşbüşkimki Yorumu'
                      : locale === 'en'
                        ? 'Büşbüşkimki Commentary'
                        : 'Büşbüşkimki Komentar'}
                  </h4>
                  <p className='text-sm text-gray-600 leading-relaxed'>
                    {locale === 'tr'
                      ? 'Bu yorum, tarot sembolizmi ve içsel farkındalık arasındaki bağlantıları açıklar. Kendi yolculuğunuzda size rehberlik etmek için hazırlanmıştır.'
                      : locale === 'en'
                        ? 'This commentary explains the connections between tarot symbolism and inner awareness. It is prepared to guide you on your own journey.'
                        : 'Ovaj komentar objašnjava veze između tarot simbolizma i unutrašnje svesti. Pripremljen je da vas vodi na vašem sopstvenom putovanju.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className='mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200'>
              <p className='text-sm text-gray-700 text-center'>
                <strong className='text-purple-700'>
                  {locale === 'tr' ? '💡 Unutmayın:' : locale === 'en' ? '💡 Remember:' : '💡 Zapamtite:'}
                </strong>{' '}
                {locale === 'tr'
                  ? 'Tarot, eğlence ve kişisel gelişim amaçlıdır. Profesyonel yaşam tavsiyesi yerine geçmez.'
                  : locale === 'en'
                    ? 'Tarot is for entertainment and personal development purposes. It does not replace professional life advice.'
                    : 'Tarot je za zabavu i lični razvoj. Ne zamenjuje profesionalni životni savet.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Default export for dynamic import
export default ExpertCommentary;
