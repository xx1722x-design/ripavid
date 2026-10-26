'use client';

import { useState, useEffect } from 'react';

const tips = [
  "💡 Tip: RipAVid supports high-quality downloads across multiple platforms effortlessly.",
  "🎬 For the best playback experience, we recommend using a modern player like VLC.",
  "🎧 Looking for gear? Check out our best-seller recommendations in the banner below!",
  "⚡ Our backend FFmpeg engine is safely assembling your video in original quality."
];

export default function TipSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tips.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto my-4 p-4 bg-gray-900/60 border border-cyan-500/30 rounded-xl text-center text-gray-300 text-sm transition-opacity duration-300 opacity-100">
      <p>{tips[currentIndex]}</p>
    </div>
  );
}
