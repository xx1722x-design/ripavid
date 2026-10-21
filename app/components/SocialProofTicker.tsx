'use client';

import { useEffect, useState } from 'react';

interface Activity {
  id: number;
  user: string;
  country: string;
  action: string;
  timestamp: string;
}

const SAMPLE_ACTIVITIES: Activity[] = [
  { id: 1, user: 'Alex K.', country: '🇰🇷 South Korea', action: '영상 다운로드 완료', timestamp: 'Just now' },
  { id: 2, user: 'Maria L.', country: '🇲🇽 Mexico', action: 'video downloaded', timestamp: '1 min ago' },
  { id: 3, user: 'Liu C.', country: '🇨🇳 China', action: '视频下载完成', timestamp: '2 min ago' },
  { id: 4, user: 'Sofia R.', country: '🇧🇷 Brazil', action: 'vídeo baixado', timestamp: '3 min ago' },
  { id: 5, user: 'James P.', country: '🇺🇸 United States', action: 'video downloaded', timestamp: '4 min ago' },
  { id: 6, user: 'Emma G.', country: '🇩🇪 Germany', action: 'Video heruntergeladen', timestamp: '5 min ago' },
  { id: 7, user: 'Yuki T.', country: '🇯🇵 Japan', action: 'ビデオをダウンロード', timestamp: '6 min ago' },
  { id: 8, user: 'Anna M.', country: '🇫🇮 Finland', action: 'video ladattu', timestamp: '7 min ago' },
];

export default function SocialProofTicker() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setActivities([...SAMPLE_ACTIVITIES]);

    const interval = setInterval(() => {
      setActivities((prev) => {
        const newActivity: Activity = {
          id: Date.now(),
          user: ['Alex', 'Maria', 'Liu', 'Sofia', 'James', 'Emma', 'Yuki', 'Anna'][Math.floor(Math.random() * 8)] + ' ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)),
          country: ['🇰🇷 South Korea', '🇲🇽 Mexico', '🇨🇳 China', '🇧🇷 Brazil', '🇺🇸 United States'][Math.floor(Math.random() * 5)],
          action: ['video downloaded', '영상 다운로드 완료', '视频下载完成', 'vídeo baixado'][Math.floor(Math.random() * 4)],
          timestamp: 'Just now',
        };

        return [newActivity, ...prev.slice(0, 7)];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-16 w-full max-w-2xl mx-auto">
      <p className="text-center text-zinc-400 text-sm mb-6 font-semibold uppercase tracking-wider">🔥 실시간 활동</p>
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-6 backdrop-blur-sm overflow-hidden max-h-72">
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`flex items-center gap-3 text-sm transition-all duration-500 transform ${
                index === 0 ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
              }`}
              style={{
                animation: index === 0 ? 'slideIn 0.3s ease-out' : 'none',
              }}
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <span className="text-zinc-300 font-medium">{activity.user}</span>
                <span className="text-zinc-500 mx-2">•</span>
                <span className="text-zinc-400">{activity.country}</span>
              </div>
              <span className="text-zinc-500 text-xs whitespace-nowrap">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
