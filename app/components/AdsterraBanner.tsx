'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function AdsterraBanner() {
  useEffect(() => {
    // Trigger script reload if available
    if (typeof (window as any).eval === 'function') {
      try {
        (window as any).eval = (window as any).eval;
      } catch (e) {
        // Silent fail
      }
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto my-8 px-4">
      <div id="container-5a82e90ade2abc70095c331a76edf3bf" className="w-full h-auto min-h-[200px]"></div>
      <Script
        async
        src="https://bauval.org/21/5a82e90ade2abc70095c331a76edf3bf"
        strategy="afterInteractive"
      />
    </div>
  );
}
