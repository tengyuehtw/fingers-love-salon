import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SERVICE_DATA } from '@/src/constants';

export default function Services() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('美甲');
  const currentData = SERVICE_DATA[activeTab as keyof typeof SERVICE_DATA];

  const handleBooking = (serviceName?: string) => {
    if (serviceName) {
      navigate(`/booking?service=${encodeURIComponent(serviceName)}`);
    } else {
      navigate('/booking');
    }
  };

  return (
    <div className="flex flex-col">
      <div className="px-4 py-4">
        <Link to="/coupons" className="block relative overflow-hidden rounded-2xl bg-muted-green/20 min-h-[160px] flex flex-col justify-end group hover:scale-[1.02] transition-transform">
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent z-10"></div>
          <img alt="Professional salon service" className="absolute inset-0 w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBd9ZndRSFILrTCdFI_fz6vlPwpfYUH-WuSrLX3G_bhdCLAfraCY5w37t2jy0OL0ab75p2HzbmqalYiTtaMYPol6y-TvJceWbZ4CAK81vzIRKTifK0g_nDyAyFXn7pm9BeHIjKNc2uA97YdK_-8xhiDEzm5ckCqR7rSdEzH1j93REsz1n04clawSIm_y-9kyD1J443rYa53Iw6YLZ28z4S30FzTcRDzt34TbseC2E97HHrOAgpJ3lVJS0enxo-f91rvKvTMXIlY7vA" 
            referrerPolicy="no-referrer" />
          <div className="relative z-20 p-5">
            <span className="bg-logo-green text-white text-[10px] font-bold px-2 py-1 rounded mb-2 inline-block uppercase tracking-wider">領取優惠</span>
            <p className="text-white text-2xl font-bold leading-tight">新客首購 80% 優惠</p>
            <p className="text-white/90 text-sm mt-1">立即預約您的第一次體驗</p>
          </div>
        </Link>
      </div>

      <div className="sticky top-[72px] z-10 bg-background-light/95 border-b border-logo-green/20 overflow-x-auto no-scrollbar">
        <div className="flex px-4 gap-8">
          {Object.keys(SERVICE_DATA).map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 whitespace-nowrap transition-all ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-stone-500'}`}
            >
              <p className="text-sm font-bold tracking-wide">{tab}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <h3 className="text-logo-green text-lg font-bold leading-tight mt-2 px-1 flex items-center gap-2">
          <span className="w-1 h-5 bg-logo-green rounded-full"></span>
          熱門推薦
        </h3>
        
        <div className="bg-white backdrop-blur-sm rounded-2xl p-5 border-2 border-logo-green/30 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div className="flex-1">
              <h4 className="text-primary font-bold text-lg">{currentData.featured.title}</h4>
              <div className="flex items-center gap-3 mt-1 text-logo-green text-xs font-medium">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">schedule</span> {currentData.featured.time}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary font-bold text-xl">{currentData.featured.price}</p>
            </div>
          </div>
          <p className="text-stone-600 text-sm mb-3 line-clamp-2 relative z-10">{currentData.featured.desc}</p>
          
          {/* Teacher Info */}
          <div className="flex items-center gap-2 mb-5 relative z-10">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">提供老師：</span>
            <div className="flex gap-1.5 flex-wrap">
              {currentData.featured.therapists.map(t => (
                <button 
                  key={t} 
                  onClick={() => navigate(`/team?name=${encodeURIComponent(t)}`)}
                  className="text-[10px] font-bold text-logo-green bg-logo-green/10 hover:bg-logo-green hover:text-white transition-colors px-2 py-0.5 rounded-full"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => handleBooking(currentData.featured.title)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all relative z-10"
          >
            <span>立即預約</span>
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          </button>
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-8xl text-logo-green">{currentData.featured.icon}</span>
          </div>
        </div>

        <div className="h-[1px] bg-logo-green/20 my-6"></div>

        {currentData.others.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-logo-green/10 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="text-primary font-bold text-lg">{item.title}</h4>
                <div className="flex items-center gap-3 mt-1 text-logo-green text-xs font-medium">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">schedule</span> {item.time}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-primary font-bold text-xl">{item.price}</p>
              </div>
            </div>
            <p className="text-stone-600 text-sm mb-3 line-clamp-2">{item.desc}</p>
            
            {/* Teacher Info */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">提供老師：</span>
              <div className="flex gap-1.5 flex-wrap">
                {item.therapists.map(t => (
                  <button 
                    key={t} 
                    onClick={() => navigate(`/team?name=${encodeURIComponent(t)}`)}
                    className="text-[10px] font-bold text-logo-green bg-logo-green/10 hover:bg-logo-green hover:text-white transition-colors px-2 py-0.5 rounded-full"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => handleBooking(item.title)}
              className="w-full bg-white border border-primary text-primary hover:bg-primary hover:text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <span>立即預約</span>
            </button>
          </div>
        ))}

        <h3 className="text-logo-green text-lg font-bold leading-tight mt-8 px-1 flex items-center gap-2">
          <span className="w-1 h-5 bg-logo-green rounded-full"></span>
          其他項目
        </h3>
        <div className="bg-white rounded-2xl p-5 border border-logo-green/10 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h4 className="text-primary font-bold text-lg">{currentData.extra.title}</h4>
              <div className="flex items-center gap-3 mt-1 text-logo-green text-xs font-medium">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">schedule</span> {currentData.extra.time}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary font-bold text-xl">{currentData.extra.price}</p>
            </div>
          </div>
          <p className="text-stone-600 text-sm mb-3 line-clamp-2">{currentData.extra.desc}</p>
          
          {/* Teacher Info */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">提供老師：</span>
            <div className="flex gap-1.5 flex-wrap">
              {currentData.extra.therapists.map(t => (
                <button 
                  key={t} 
                  onClick={() => navigate(`/team?name=${encodeURIComponent(t)}`)}
                  className="text-[10px] font-bold text-logo-green bg-logo-green/10 hover:bg-logo-green hover:text-white transition-colors px-2 py-0.5 rounded-full"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => handleBooking(currentData.extra.title)}
            className="w-full bg-white border border-primary text-primary hover:bg-primary hover:text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <span>立即預約</span>
          </button>
        </div>
      </div>
    </div>
  );
}
