import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { THERAPISTS, SERVICE_DATA } from '@/src/constants';
import { useBookings } from '@/src/context/BookingContext';

const HERO_SLIDES = [
  {
    tag: "重塑自然之美",
    title: "專屬於妳的\n恬靜時光",
    desc: "頂級美甲、精緻美睫與深層肌膚管理，在溫暖的大地色調中全然放鬆。",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmt8R06yx9SFpJ0yjXULOEAxo1JOM-xDtSYMYmwOhxgZZd8HmYPVRipKg2Ddudhf1sjPtcGfWllZc4yVI5V7FyjdGLk5bB5bydL2OMZfrTYHHQfeeJ7Wma5KRJ2HbmpzDruN7RV1KdcP3fVdLHjlak9MFXDJan1TVjOHa10hC0Wo9itTPCwkJXPQQDSWkLUb26OJEcq7wQxHRQym-8TMvEu3xeWZITS4s1MUDATU3GUrQWFWHEt5nyJqpIsZwSszCY3XJizrFf_zQ"
  },
  {
    tag: "極致奢華體驗",
    title: "指尖上的\n藝術饗宴",
    desc: "專業美甲師為您量身打造獨一無二的藝術設計，展現個人魅力。",
    img: "https://images.unsplash.com/photo-1604654894610-df490668711d?auto=format&fit=crop&q=80&w=1920"
  },
  {
    tag: "深層肌膚管理",
    title: "煥發自然\n透亮光澤",
    desc: "結合先進技術與頂級保養品，為您的肌膚注入活力與水分。",
    img: "https://images.unsplash.com/photo-1570172619244-42187c0383ce?auto=format&fit=crop&q=80&w=1920"
  }
];

// Flatten services for the dropdown
const ALL_SERVICES = Object.entries(SERVICE_DATA).flatMap(([category, data]) => {
  const services = [data.featured, ...data.others, data.extra];
  return services.map(s => ({ ...s, category }));
});

export default function Home() {
  const navigate = useNavigate();
  const { addBooking } = useBookings();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bookingData, setBookingData] = useState({
    service: '',
    therapist: '',
    date: '',
    time: '任何時段'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter therapists based on selected service category
  const availableTherapists = React.useMemo(() => {
    if (!bookingData.service) return THERAPISTS;
    const selectedService = ALL_SERVICES.find(s => s.title === bookingData.service);
    if (!selectedService) return THERAPISTS;
    return THERAPISTS.filter(t => t.skills.includes(selectedService.category));
  }, [bookingData.service]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Randomly select 3 to 5 services
    const count = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
    const shuffled = [...ALL_SERVICES].sort(() => 0.5 - Math.random());
    setFeaturedServices(shuffled.slice(0, count));
  }, []);

  useEffect(() => {
    if (featuredServices.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredServices.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [featuredServices]);

  const handleQuickBooking = () => {
    if (!bookingData.service || !bookingData.date) {
      alert('請選擇服務項目與日期');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const dateObj = new Date(bookingData.date);
      const dayOfWeek = dateObj.toLocaleDateString('zh-TW', { weekday: 'short' }).replace('週', '週');
      const [year, month, day] = bookingData.date.split('-');

      addBooking({
        date: bookingData.date,
        month: `${parseInt(month)}月`,
        day: parseInt(day).toString(),
        time: bookingData.time === '任何時段' ? '10:00' : bookingData.time,
        service: bookingData.service,
        therapist: bookingData.therapist || '不指定',
        dayOfWeek: dayOfWeek
      });

      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col relative">
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="size-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-2">預約成功！</h3>
              <p className="text-stone-600 mb-8">
                我們已收到您的預約<br/>
                <span className="font-bold text-primary">
                  {bookingData.date} {bookingData.time} - {bookingData.service}
                </span>
                <br/>
                將會有專人與您聯繫確認。
              </p>
              <button 
                onClick={() => {
                  setShowSuccess(false);
                  setBookingData({
                    service: '',
                    therapist: '',
                    date: '',
                    time: '任何時段'
                  });
                }}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
              >
                關閉
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Slideshow */}
      <section className="relative h-[480px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-6"
            style={{ 
              backgroundImage: `linear-gradient(rgba(45, 36, 30, 0.3), rgba(45, 36, 30, 0.6)), url("${HERO_SLIDES[currentSlide].img}")` 
            }}
          >
            <div className="flex flex-col gap-3 text-center z-10">
              <motion.span 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-earth-beige text-xs font-bold uppercase tracking-[0.3em]"
              >
                {HERO_SLIDES[currentSlide].tag}
              </motion.span>
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white text-4xl font-black leading-tight tracking-tight whitespace-pre-line"
              >
                {HERO_SLIDES[currentSlide].title}
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-white/90 text-sm font-medium max-w-xs mx-auto"
              >
                {HERO_SLIDES[currentSlide].desc}
              </motion.p>
            </div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-8"
            >
              <Link to="/booking" className="z-10 flex min-w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-10 bg-primary text-white text-lg font-bold shadow-lg shadow-primary/30 transition-transform active:scale-95">
                立即預約
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-8 bg-primary' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* Quick Booking Form */}
      <section className="mx-4 -mt-8 relative z-20 bg-[#F2EBE5] rounded-xl shadow-xl p-6 border border-stone-200">
        <h3 className="text-stone-800 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-stone-600 text-xl">event_available</span> 快速預約服務
        </h3>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-stone-600 ml-1">服務項目</label>
              <div className="relative group">
                <select 
                  value={bookingData.service}
                  onChange={(e) => setBookingData({ ...bookingData, service: e.target.value, therapist: '' })}
                  className="w-full appearance-none rounded-lg border border-stone-200 bg-white p-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-stone-800 transition-all"
                >
                  <option value="" className="bg-white">請選擇服務項目...</option>
                  {ALL_SERVICES.map(s => (
                    <option key={s.title} value={s.title} className="bg-white">{s.title}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex flex-col -gap-1 text-primary">
                  <span className="material-symbols-outlined text-sm leading-none">expand_less</span>
                  <span className="material-symbols-outlined text-sm leading-none">expand_more</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-stone-600 ml-1">選擇老師</label>
              <div className="relative group">
                <select 
                  value={bookingData.therapist}
                  onChange={(e) => setBookingData({ ...bookingData, therapist: e.target.value })}
                  className="w-full appearance-none rounded-lg border border-stone-200 bg-white p-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-stone-800 transition-all"
                >
                  <option value="" className="bg-white">不指定老師</option>
                  {availableTherapists.map(t => (
                    <option key={t.id} value={t.name} className="bg-white">{t.name} ({t.skills.join('、')})</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex flex-col -gap-1 text-primary">
                  <span className="material-symbols-outlined text-sm leading-none">expand_less</span>
                  <span className="material-symbols-outlined text-sm leading-none">expand_more</span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-stone-600 ml-1">偏好日期</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 bg-white p-4 text-sm focus:border-primary outline-none text-stone-800" 
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-stone-600 ml-1">偏好時段</label>
              <div className="relative group">
                <select 
                  value={bookingData.time}
                  onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                  className="w-full appearance-none rounded-lg border border-stone-200 bg-white p-4 text-sm focus:border-primary outline-none text-stone-800 transition-all"
                >
                  <option value="任何時段" className="bg-white">任何時段</option>
                  {[
                    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
                    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
                    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
                  ].map(t => (
                    <option key={t} value={t} className="bg-white">{t}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex flex-col -gap-1 text-primary">
                  <span className="material-symbols-outlined text-sm leading-none">expand_less</span>
                  <span className="material-symbols-outlined text-sm leading-none">expand_more</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={handleQuickBooking}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all mt-2"
          >
            立即預約
          </button>
        </div>
      </section>

      {/* Featured Services */}
      <section className="mt-10 px-4">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary">精選服務</h2>
            <p className="text-sm text-logo-green">探索我們最受歡迎的療程</p>
          </div>
          <Link to="/services" className="text-primary text-sm font-bold border-b border-primary/30">查看全部</Link>
        </div>
        
        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait">
            {featuredServices.length > 0 && (
              <motion.div
                key={featuredServices[currentIndex].title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-5 border border-logo-green/10 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="text-primary font-bold text-lg">{featuredServices[currentIndex].title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-logo-green text-xs font-medium">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">schedule</span> {featuredServices[currentIndex].time}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold text-xl">{featuredServices[currentIndex].price}</p>
                  </div>
                </div>
                <p className="text-stone-600 text-sm mb-3 line-clamp-2 min-h-[40px]">{featuredServices[currentIndex].desc}</p>
                
                {/* Teacher Info */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">提供老師：</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {featuredServices[currentIndex].therapists.map((t: string) => (
                      <button 
                        key={t} 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/team?name=${encodeURIComponent(t)}`);
                        }}
                        className="text-[10px] font-bold text-logo-green bg-logo-green/10 hover:bg-logo-green hover:text-white transition-colors px-2 py-0.5 rounded-full"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/booking?service=${encodeURIComponent(featuredServices[currentIndex].title)}`)}
                  className="w-full bg-white border border-primary text-primary hover:bg-primary hover:text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <span>立即預約</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {featuredServices.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-6 bg-primary' : 'w-1.5 bg-stone-200'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Promotions */}
      <section className="mt-8 px-4">
        <h2 className="text-2xl font-bold text-primary mb-4">優惠活動</h2>
        <Link to="/coupons" className="block relative bg-gradient-to-r from-primary to-logo-green rounded-2xl p-6 overflow-hidden shadow-lg hover:scale-[1.02] transition-transform">
          <div className="relative z-10 flex flex-col gap-2">
            <span className="w-fit bg-earth-beige text-primary text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">期間限定</span>
            <h3 className="text-white text-2xl font-extrabold">新客 8 折優惠</h3>
            <p className="text-white/90 text-sm max-w-[200px]">首次預約美甲＋美睫組合課程，即享總額八折優惠。</p>
            <div className="mt-2 w-fit bg-white text-primary transition-colors text-xs font-bold py-2.5 px-6 rounded-lg shadow-sm">
              領取優惠券
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute right-4 top-4 opacity-30">
            <span className="material-symbols-outlined text-white text-8xl">local_activity</span>
          </div>
        </Link>
      </section>

      {/* Map Navigation Section */}
      <section className="mt-12 px-4">
        <div className="bg-white rounded-3p p-6 border border-logo-green/10 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">location_on</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-800">我們的店址</h3>
              <p className="text-xs text-logo-green">桃園市中壢區新生路38號2樓</p>
            </div>
          </div>
          <button 
            onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=桃園市中壢區新生路38號2樓', '_blank')}
            className="w-full bg-logo-green text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-logo-green/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined">navigation</span>
            開啟 Google 地圖導航
          </button>
        </div>
      </section>

      {/* News & Tips Section */}
      <section className="mt-12 px-4">
        <div className="flex justify-between items-end mb-6">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-primary italic">News & Tips</h2>
            <p className="text-logo-green text-[10px] font-bold tracking-widest uppercase">最新消息與保養知識</p>
          </div>
          <Link to="/news" className="text-xs font-bold text-primary border-b border-primary/30">閱讀更多</Link>
        </div>
        <div className="space-y-4">
          {[
            {
              id: 1,
              title: "凝膠美甲後如何維持持久度？5 個日常護理小撇步",
              category: "保養知識",
              date: "3月1日",
              img: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=300"
            },
            {
              id: 2,
              title: "美睫嫁接後的 24 小時黃金保養期",
              category: "注意事項",
              date: "2月28日",
              img: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&q=80&w=300"
            }
          ].map((news) => (
            <Link key={news.id} to={`/news/${news.id}`} className="flex gap-4 bg-white p-3 rounded-2xl border border-logo-green/10 shadow-sm hover:shadow-md transition-all">
              <div className="size-20 rounded-xl overflow-hidden shrink-0">
                <img src={news.img} alt={news.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col justify-center flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest">{news.category}</span>
                  <span className="text-[9px] text-logo-green/40 font-bold">{news.date}</span>
                </div>
                <h3 className="text-sm font-bold text-stone-800 line-clamp-2 leading-snug">
                  {news.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Social Links */}
      <section className="mt-12 px-4 text-center">
        <h2 className="text-xl font-bold text-primary mb-6 italic">與我們保持聯絡</h2>
        <div className="flex justify-between items-start gap-2 mb-8 px-2">
          {[
            { icon: "photo_camera", label: "Instagram", color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]", url: "#" },
            { icon: "alternate_email", label: "Threads", color: "bg-black", url: "#" },
            { icon: "forum", label: "LINE 諮詢", color: "bg-[#06C755]", url: "#" },
            { icon: "phone_in_talk", label: "LINE 通話", color: "bg-[#06C755]", url: "https://line.me/R/call/" }
          ].map((social, idx) => (
            <a key={idx} className="flex flex-col items-center gap-2 flex-1 min-w-0" href={social.url} target="_blank" rel="noreferrer">
              <div className={cn("size-12 sm:size-14 rounded-full flex items-center justify-center shadow-md border border-white/20 shrink-0", social.color)}>
                {social.label.includes("LINE") ? (
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt={social.label} className="size-6 sm:size-8" referrerPolicy="no-referrer" />
                ) : (
                  <span className="material-symbols-outlined text-white text-xl sm:text-2xl">{social.icon}</span>
                )}
              </div>
              <span className="text-[9px] font-bold text-logo-green uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis w-full">{social.label}</span>
            </a>
          ))}
        </div>
        <p className="text-xs text-logo-green/70 mb-4 px-8 font-medium">關注我們獲取日常美容靈感與不定期快閃優惠活動</p>
      </section>
    </div>
  );
}
