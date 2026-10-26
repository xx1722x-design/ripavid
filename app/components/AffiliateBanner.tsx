'use client';

export default function AffiliateBanner() {
  return (
    <div className="w-full max-w-md mx-auto my-4 p-4 bg-gray-900/80 border border-blue-500/30 rounded-2xl shadow-lg">
      <div className="text-xs text-blue-400 font-semibold mb-3 text-center">✨ Recommended Sponsor Link</div>
      <a
        href="https://www.coupang.com/np/search?q=external%20hard%20drive&channel=user&component=&q=&supportTypeCd="
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700 group-hover:border-blue-500 group-hover:bg-gradient-to-r group-hover:from-blue-900/20 group-hover:to-gray-900 transition-all">
          <p className="text-sm font-semibold text-white group-hover:text-blue-300 mb-1">
            🔥 Check Out Top Deals on Gaming Gear & External Drives
          </p>
          <p className="text-xs text-gray-400">
            We may earn a commission from qualifying purchases through our partner links.
          </p>
        </div>
      </a>
    </div>
  );
}
