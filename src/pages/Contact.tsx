import React from 'react';
import { cn } from '@/src/lib/utils';

const SOCIAL_LINKS = [
  { icon: "photo_camera", label: "Instagram", color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]", url: "#" },
  { icon: "alternate_email", label: "Threads", color: "bg-black", url: "#" },
  { icon: "forum", label: "LINE 諮詢", color: "bg-[#06C755]", url: "#" },
  { icon: "phone_in_talk", label: "LINE 通話", color: "bg-[#06C755]", url: "https://line.me/R/call/" }
];

export default function Contact() {
  return (
    <div className="p-8 min-h-screen bg-background-light text-text-main">
      <h1 className="text-3xl font-bold mb-8 text-primary">聯絡我們</h1>
      
      <div className="bg-white rounded-3xl p-6 border border-logo-green/10 shadow-sm space-y-6">
        {/* Business Hours */}
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-2xl">schedule</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-800">營業時間</h2>
            <p className="text-xs text-logo-green">週一至週日: 10:00 - 20:00</p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-2xl">location_on</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-800">我們的店址</h2>
            <p className="text-xs text-logo-green">桃園市中壢區新生路38號2樓</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-2xl">phone_in_talk</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-800">聯絡電話</h2>
            <p className="text-xs text-logo-green">(03) 123-4567</p>
          </div>
        </div>

        {/* Map Button */}
        <button 
          onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=桃園市中壢區新生路38號2樓', '_blank')}
          className="w-full bg-logo-green text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-logo-green/20 flex items-center justify-center gap-2 transition-transform active:scale-95 hover:scale-[1.02]"
        >
          <span className="material-symbols-outlined">navigation</span>
          開啟 Google 地圖導航
        </button>
      </div>

      {/* Social Links Section */}
      <section className="mt-12 text-center">
        <h2 className="text-xl font-bold text-primary mb-6 italic">與我們保持聯絡</h2>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-6 mb-8">
          {SOCIAL_LINKS.map((social, idx) => (
            <a key={idx} className="flex flex-col items-center gap-2 min-w-[64px]" href={social.url} target="_blank" rel="noreferrer">
              <div className={cn("size-14 rounded-full flex items-center justify-center shadow-md border border-white/20 text-white", social.color)}>
                {social.label.includes("LINE") ? (
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt={social.label} className="size-8" referrerPolicy="no-referrer" />
                ) : (
                  <span className="material-symbols-outlined text-2xl">{social.icon}</span>
                )}
              </div>
              <span className="text-[9px] font-bold text-logo-green uppercase tracking-widest whitespace-nowrap">{social.label}</span>
            </a>
          ))}
        </div>
        <p className="text-xs text-logo-green/70 mb-4 px-8 font-medium">關注我們獲取日常美容靈感與不定期快閃優惠活動</p>
      </section>
    </div>
  );
}
