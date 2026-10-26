'use client';

interface AffiliateBannersProps {
  language?: string;
}

export default function AffiliateBanners({ language = 'en' }: AffiliateBannersProps) {
  const isCoupang = language === 'ko';

  if (isCoupang) {
    // Korean market: Coupang 3-layer network
    return (
      <div className="w-full max-w-6xl mx-auto my-8 px-4">
        <div className="space-y-6">
          {/* Top: Fixed Banner + Dynamic Banner Side by Side */}
          <div className="flex gap-4 justify-center items-start flex-wrap">
            {/* Fixed Banner */}
            <div className="flex-shrink-0">
              <a href="https://link.coupang.com/a/hQjksOpjPM" target="_blank" rel="noopener noreferrer nofollow">
                <img
                  src="https://ads-partners.coupang.com/banners/1039175?trackingCode=AF1892950&subId=&traceId=V0-301-5f9bd61900e673c0-I1039175&w=300&h=250"
                  alt="Coupang Partners Banner"
                  style={{ maxWidth: '100%', height: 'auto' }}
                  className="rounded-lg shadow-md"
                />
              </a>
            </div>

            {/* Dynamic Banner */}
            <div className="flex-shrink-0">
              <iframe
                src="https://ads-partners.coupang.com/widgets.html?id=1039159&template=carousel&trackingCode=AF1892950&subId=&width=120&height=240&tsource="
                width="120"
                height="240"
                frameBorder="0"
                scrolling="no"
                style={{ border: 'none' }}
                title="Coupang Dynamic Widget"
              ></iframe>
            </div>
          </div>

          {/* Bottom: Search Widget (Full Width) */}
          <div className="w-full">
            <iframe
              src="https://coupa.ng/cp9Q60"
              width="100%"
              height="75"
              frameBorder="0"
              scrolling="no"
              style={{ border: 'none' }}
              title="Coupang Search Widget"
            ></iframe>
          </div>

          {/* Legal Notice - FTC/공정위 */}
          <div className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </div>
        </div>
      </div>
    );
  }

  // Global market: Amazon Premium Beauty 2x2 Grid
  const amazonProducts = [
    {
      id: 1,
      name: 'Premium Beauty Product 1',
      link: 'https://www.amazon.com/dp/B08MJZYW8P?tag=cometest20-20',
      emoji: '💎'
    },
    {
      id: 2,
      name: 'Premium Skincare Exfoliator',
      link: 'https://www.amazon.com/ELEMIS-Exfoliating-exfoliating-Non-abrasive-alternative/dp/B002OLQAQG?tag=cometest20-20',
      emoji: '✨'
    },
    {
      id: 3,
      name: 'Premium Beauty Product 3',
      link: 'https://www.amazon.com/dp/B07BMBQG73?tag=cometest20-20',
      emoji: '🌹'
    },
    {
      id: 4,
      name: 'Premium Beauty Product 4',
      link: 'https://www.amazon.com/dp/B0714LK2WT?tag=cometest20-20',
      emoji: '💄'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto my-8 px-4">
      <div className="space-y-6">
        {/* 2x2 Grid of Amazon Beauty Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {amazonProducts.map((product) => (
            <a
              key={product.id}
              href={product.link}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group"
            >
              <div className="h-full p-6 bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-xl hover:border-pink-500/60 transition-all hover:shadow-lg hover:shadow-pink-500/20">
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="text-5xl group-hover:scale-110 transition-transform">
                    {product.emoji}
                  </div>
                  <h3 className="text-center font-semibold text-white group-hover:text-pink-300 transition-colors">
                    {product.name}
                  </h3>
                  <button className="mt-4 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-sm font-semibold rounded-lg transition-all transform group-hover:scale-105">
                    View Premium Beauty on Amazon
                  </button>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* FTC Legal Notice */}
        <div className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
          As an Amazon Associate I earn from qualifying purchases.
        </div>
      </div>
    </div>
  );
}
