import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { THERAPISTS, INITIAL_WORKS } from '@/src/constants';

export default function Team() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTherapist, setSelectedTherapist] = useState<typeof THERAPISTS[0] | null>(null);

  // Check if there's a therapist ID in the URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const therapistId = params.get('id');
    const therapistName = params.get('name');
    
    if (therapistId) {
      const therapist = THERAPISTS.find(t => t.id === parseInt(therapistId));
      if (therapist) setSelectedTherapist(therapist);
    } else if (therapistName) {
      const therapist = THERAPISTS.find(t => t.name === therapistName);
      if (therapist) setSelectedTherapist(therapist);
    }
  }, [location.search]);

  // Close modal and clear URL params
  const handleClose = () => {
    setSelectedTherapist(null);
    navigate('/team', { replace: true });
  };

  // Open modal and set URL params
  const handleOpen = (therapist: typeof THERAPISTS[0]) => {
    setSelectedTherapist(therapist);
    navigate(`/team?id=${therapist.id}`, { replace: true });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24">
      {/* Header */}
      <div className="pt-8 pb-6 px-6">
        <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-2">專業團隊</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm">
          由資深美容專家領軍，為您提供最專業、細膩的專屬服務。
        </p>
      </div>

      {/* Team Grid */}
      <div className="px-4 grid grid-cols-2 gap-4">
        {THERAPISTS.map((therapist, index) => (
          <motion.div
            key={therapist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleOpen(therapist)}
            className="group cursor-pointer bg-white dark:bg-stone-800 rounded-3xl overflow-hidden shadow-sm ring-1 ring-black/5 hover:shadow-md transition-all duration-300"
          >
            <div className="aspect-[4/5] overflow-hidden relative">
              <img 
                src={therapist.img} 
                alt={therapist.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-bold text-lg leading-tight">{therapist.name}</p>
                <p className="text-white/80 text-[10px] font-medium mt-0.5">{therapist.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Therapist Detail Modal */}
      <AnimatePresence>
        {selectedTherapist && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-t-[2rem] sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 z-50 size-10 flex items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="overflow-y-auto no-scrollbar pb-8">
                {/* Hero Image */}
                <div className="relative aspect-square w-full">
                  <img 
                    src={selectedTherapist.img} 
                    alt={selectedTherapist.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-3xl font-bold text-white mb-1">{selectedTherapist.name}</h2>
                    <p className="text-primary font-medium">{selectedTherapist.title}</p>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-6">
                  {/* Stats */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1 bg-stone-50 dark:bg-stone-800 rounded-2xl p-4 flex flex-col items-center justify-center">
                      <span className="text-xs text-stone-500 dark:text-stone-400 mb-1">年資</span>
                      <span className="text-lg font-bold text-stone-800 dark:text-stone-100">{selectedTherapist.experience}</span>
                    </div>
                    <div className="flex-1 bg-stone-50 dark:bg-stone-800 rounded-2xl p-4 flex flex-col items-center justify-center">
                      <span className="text-xs text-stone-500 dark:text-stone-400 mb-1">專長</span>
                      <span className="text-lg font-bold text-stone-800 dark:text-stone-100">{selectedTherapist.skills.length} 項</span>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedTherapist.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-logo-green/10 text-logo-green text-xs font-bold rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-stone-800 dark:text-stone-100 mb-2">關於老師</h3>
                    <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                      {selectedTherapist.desc}
                    </p>
                  </div>

                  {/* Recent Works Preview */}
                  {INITIAL_WORKS.filter(w => w.therapist === selectedTherapist.name).length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-stone-800 dark:text-stone-100">老師作品</h3>
                        <button 
                          onClick={() => navigate('/portfolio')}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          查看全部
                        </button>
                      </div>
                      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                        {INITIAL_WORKS.filter(w => w.therapist === selectedTherapist.name).slice(0, 3).map(work => (
                          <div key={work.id} className="w-24 shrink-0 aspect-[3/4] rounded-xl overflow-hidden relative">
                            <img src={work.img} alt={work.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => navigate(`/booking?therapist=${selectedTherapist.id}`)}
                      className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 transition-transform active:scale-95"
                    >
                      指定老師預約
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
