import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { INITIAL_WORKS, THERAPISTS } from '@/src/constants';

export default function Portfolio() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('全部');
  const [activeTherapist, setActiveTherapist] = useState('全部老師');
  const [selectedWork, setSelectedWork] = useState<null | typeof INITIAL_WORKS[0]>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [works, setWorks] = useState(() => {
    const saved = localStorage.getItem('collectedWorks');
    if (saved) {
      const likedIds = JSON.parse(saved);
      return INITIAL_WORKS.map(w => ({ ...w, liked: likedIds.includes(w.id) }));
    }
    return INITIAL_WORKS;
  });

  const categories = ['全部', '已收藏', '法式美甲', '山茶花美睫', '肌膚管理', '藝術美甲'];
  const therapists = ['全部老師', ...THERAPISTS.map(t => t.name)];

  const toggleLike = (id: number) => {
    const updatedWorks = works.map(w => w.id === id ? { ...w, liked: !w.liked } : w);
    setWorks(updatedWorks);
    const likedIds = updatedWorks.filter(w => w.liked).map(w => w.id);
    localStorage.setItem('collectedWorks', JSON.stringify(likedIds));
    if (selectedWork && selectedWork.id === id) {
      setSelectedWork(updatedWorks.find(w => w.id === id) || null);
    }
  };

  const filteredWorks = works.filter(w => {
    const matchCategory = activeCategory === '全部' ? true : 
                          activeCategory === '已收藏' ? w.liked : 
                          w.category === activeCategory;
    const matchTherapist = activeTherapist === '全部老師' ? true : w.therapist === activeTherapist;
    return matchCategory && matchTherapist;
  });

  const handleShare = async (work: typeof works[0]) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Fingers Love - ${work.title}`,
          text: work.desc,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('連結已複製到剪貼簿！');
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  };

  const nextImg = () => {
    if (selectedWork) {
      setCurrentImgIndex((prev) => (prev + 1) % selectedWork.images.length);
    }
  };

  const prevImg = () => {
    if (selectedWork) {
      setCurrentImgIndex((prev) => (prev - 1 + selectedWork.images.length) % selectedWork.images.length);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      {/* Filters */}
      <div className="sticky top-0 z-40 bg-background-light/95 backdrop-blur-md flex flex-col gap-3 py-4 border-b border-stone-100">
        {/* Therapist Filter */}
        <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar">
          {therapists.map((therapist) => (
            <button
              key={therapist}
              onClick={() => setActiveTherapist(therapist)}
              className={cn(
                "flex h-9 shrink-0 items-center justify-center rounded-full px-5 transition-all duration-300 font-bold text-sm",
                activeTherapist === therapist 
                  ? "bg-stone-800 text-white shadow-md" 
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
            >
              {therapist}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "flex h-9 shrink-0 items-center justify-center rounded-full px-5 transition-all duration-300 font-bold text-sm",
                activeCategory === cat 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
            >
              {cat === '已收藏' && <span className="material-symbols-outlined text-[16px] mr-1 fill-1">favorite</span>}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="columns-2 gap-3 p-3 space-y-3 pb-32">
        <AnimatePresence mode="popLayout">
          {filteredWorks.map((work) => (
            <motion.div
              layout
              key={work.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative group break-inside-avoid cursor-pointer"
              onClick={() => {
                setSelectedWork(work);
                setCurrentImgIndex(0);
              }}
            >
              <div className={cn(
                "overflow-hidden rounded-2xl bg-stone-100 shadow-sm ring-1 ring-black/5 transition-transform duration-500 group-hover:scale-[1.02]",
                work.aspect
              )}>
                <img 
                  alt={work.title} 
                  className="w-full h-full object-cover" 
                  src={work.img} 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="absolute top-2 right-2 z-10">
                <button 
                  className={cn(
                    "flex items-center justify-center size-8 rounded-full bg-white/90 shadow-md backdrop-blur-md transition-transform active:scale-90",
                    work.liked ? 'text-primary' : 'text-stone-400'
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(work.id);
                  }}
                >
                  <span className={cn("material-symbols-outlined text-sm font-bold", work.liked && "fill-1")}>
                    favorite
                  </span>
                </button>
              </div>

              <div className="mt-2 flex flex-col gap-0.5 px-1">
                <p className="text-xs font-bold text-stone-800">{work.title}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-500">by {work.therapist}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedWork && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWork(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div
              layoutId={`work-${selectedWork.id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setSelectedWork(null)}
                className="absolute top-4 right-4 z-50 size-10 flex items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentImgIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    src={selectedWork.images[currentImgIndex]} 
                    alt={selectedWork.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                {selectedWork.images.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); prevImg(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-colors"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); nextImg(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-colors"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                    
                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {selectedWork.images.map((_, idx) => (
                        <div 
                          key={idx}
                          className={cn(
                            "size-1.5 rounded-full transition-all duration-300",
                            idx === currentImgIndex ? "bg-white w-4" : "bg-white/40"
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-primary uppercase tracking-widest block">
                        {selectedWork.category}
                      </span>
                      <button 
                        onClick={() => {
                          setSelectedWork(null);
                          navigate(`/team?name=${encodeURIComponent(selectedWork.therapist)}`);
                        }}
                        className="text-xs text-stone-500 dark:text-stone-400 font-medium bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        by {selectedWork.therapist}
                      </button>
                    </div>
                    <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                      {selectedWork.title}
                    </h2>
                  </div>
                  <button 
                    onClick={() => toggleLike(selectedWork.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-colors",
                      selectedWork.liked ? "bg-primary/10 text-primary" : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                    )}
                  >
                    <span className={cn("material-symbols-outlined text-sm", selectedWork.liked && "fill-1")}>favorite</span>
                    {selectedWork.liked ? "已收藏" : "收藏作品"}
                  </button>
                </div>
                
                <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-6">
                  {selectedWork.desc}
                </p>

                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate('/booking')}
                    className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 transition-transform active:scale-95"
                  >
                    立即預約同款服務
                  </button>
                  <button 
                    onClick={() => handleShare(selectedWork)}
                    className="size-12 flex items-center justify-center rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                  >
                    <span className="material-symbols-outlined">share</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Action Button for Portfolio */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={() => navigate('/booking')}
          className="flex size-16 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 border-4 border-background-light dark:border-background-dark transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined text-2xl fill-1">calendar_month</span>
        </button>
      </div>
    </div>
  );
}


