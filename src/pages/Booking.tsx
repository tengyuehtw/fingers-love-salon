import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { THERAPISTS, SERVICE_DATA } from '@/src/constants';
import { useBookings } from '@/src/context/BookingContext';
import { cn } from '@/src/lib/utils';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
];

// Helper to categorize time slots
const getTimeCategory = (time: string) => {
  const hour = parseInt(time.split(':')[0]);
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

const TIME_CATEGORIES = {
  morning: { label: '上午時段', icon: 'wb_sunny' },
  afternoon: { label: '下午時段', icon: 'sunny' },
  evening: { label: '晚上時段', icon: 'nights_stay' }
};

// Flatten services for selection
const ALL_SERVICES = Object.entries(SERVICE_DATA).flatMap(([category, data]) => {
  const services = [data.featured, ...data.others, data.extra];
  return services.map(s => ({ ...s, category }));
});

export default function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addBooking } = useBookings();
  
  const initialService = React.useMemo(() => {
    const serviceName = searchParams.get('service');
    if (serviceName) {
      const found = ALL_SERVICES.find(s => s.title === serviceName);
      if (found) return found;
    }
    return ALL_SERVICES[0];
  }, [searchParams]);

  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(5);
  const [selectedTime, setSelectedTime] = useState('11:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync selectedService with searchParams
  React.useEffect(() => {
    const serviceName = searchParams.get('service');
    if (serviceName) {
      const found = ALL_SERVICES.find(s => s.title === serviceName);
      if (found) {
        setSelectedService(found);
      }
    }
  }, [searchParams]);

  // Filter therapists based on selected service category
  const availableTherapists = React.useMemo(() => {
    return THERAPISTS.filter(t => t.skills.includes(selectedService.category));
  }, [selectedService]);

  // Reset selected therapist if they don't support the new service
  React.useEffect(() => {
    if (selectedTherapist && !availableTherapists.find(t => t.id === selectedTherapist.id)) {
      setSelectedTherapist(null);
    }
  }, [availableTherapists, selectedTherapist]);

  const handleConfirmBooking = () => {
    if (!selectedTherapist) {
      alert('請選擇美療師');
      return;
    }
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const dateObj = new Date(2026, 2, selectedDate);
      const dayOfWeek = dateObj.toLocaleDateString('zh-TW', { weekday: 'short' }).replace('週', '週');

      addBooking({
        date: `2026-03-${selectedDate.toString().padStart(2, '0')}`,
        month: '3月',
        day: selectedDate.toString(),
        time: selectedTime,
        service: selectedService.title,
        therapist: selectedTherapist.name,
        dayOfWeek: dayOfWeek
      });

      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light pb-32 relative">
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
                  {selectedDate}日 {selectedTime} - {selectedService.title}
                </span>
                <br/>
                將會有專人與您聯繫確認。
              </p>
              <button 
                onClick={() => navigate('/')}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
              >
                返回首頁
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Selection */}
      <div className="px-4 py-6">
        <h3 className="text-stone-800 text-lg font-bold mb-4">選擇服務項目</h3>
        <div className="relative group">
          <select 
            value={selectedService.title}
            onChange={(e) => {
              const service = ALL_SERVICES.find(s => s.title === e.target.value);
              if (service) setSelectedService(service);
            }}
            className="w-full appearance-none rounded-2xl border border-stone-200 bg-white p-4 text-sm focus:border-primary outline-none text-stone-800 transition-all shadow-sm"
          >
            {ALL_SERVICES.map(s => (
              <option key={s.title} value={s.title}>{s.title} ({s.price})</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
            <span className="material-symbols-outlined">expand_more</span>
          </div>
        </div>
      </div>

      {/* Therapist Selection */}
      <div className="px-4 py-2">
        <h3 className="text-stone-800 text-lg font-bold mb-4">選擇美療師</h3>
        <div className="flex flex-row gap-4 overflow-x-auto pb-2 no-scrollbar">
          {availableTherapists.map((therapist) => (
            <button 
              key={therapist.id} 
              onClick={() => setSelectedTherapist(therapist)}
              className={`flex flex-col items-center shrink-0 gap-2 transition-all ${selectedTherapist?.id !== therapist.id && 'opacity-60 grayscale'}`}
            >
              <div className={`size-20 rounded-full border-2 p-0.5 transition-colors ${selectedTherapist?.id === therapist.id ? 'border-primary bg-primary/10' : 'border-transparent'}`}>
                <div className="size-full rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${therapist.img}")` }}></div>
              </div>
              <p className="text-stone-800 text-xs font-bold">{therapist.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      <div className="px-4 py-6">
        <h3 className="text-stone-800 text-lg font-bold mb-4">選擇日期</h3>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-4">
            <button className="text-stone-600 hover:bg-stone-100 rounded-full p-1">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <p className="text-stone-800 text-base font-bold italic">2026年 3月</p>
            <button className="text-stone-600 hover:bg-stone-100 rounded-full p-1">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <div className="grid grid-cols-7 text-center">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => (
              <p key={day} className="text-stone-400 text-[11px] font-bold py-2">{day}</p>
            ))}
            {[25, 26, 27, 28, 1, 2, 3].map(d => (
              <button key={d} className="h-10 w-full text-sm font-medium text-stone-300 cursor-not-allowed">{d}</button>
            ))}
            <button className="h-10 w-full text-white text-sm font-medium">
              <div className="flex size-8 mx-auto items-center justify-center rounded-full bg-logo-green shadow-md">4</div>
            </button>
            {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27].map(d => (
              <button 
                key={d} 
                onClick={() => setSelectedDate(d)}
                className="h-10 w-full text-sm font-medium relative group"
              >
                <div className={`flex size-8 mx-auto items-center justify-center rounded-full transition-all ${selectedDate === d ? 'bg-primary text-white shadow-md' : 'text-stone-800 hover:bg-stone-100'}`}>
                  {d}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Time Selection */}
      <div className="px-4 py-2 mb-20">
        <h3 className="text-stone-800 text-lg font-bold mb-4">可預約時段</h3>
        
        <div className="space-y-6">
          {(['morning', 'afternoon', 'evening'] as const).map(category => {
            const categorySlots = TIME_SLOTS.filter(t => getTimeCategory(t) === category);
            if (categorySlots.length === 0) return null;

            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3 text-stone-500">
                  <span className="material-symbols-outlined text-sm">{TIME_CATEGORIES[category].icon}</span>
                  <span className="text-xs font-bold tracking-wider uppercase">{TIME_CATEGORIES[category].label}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {categorySlots.map(t => (
                    <button 
                      key={t} 
                      onClick={() => setSelectedTime(t)}
                      className={cn(
                        "py-2.5 rounded-xl border text-sm font-medium transition-all active:scale-95",
                        selectedTime === t 
                          ? "bg-primary border-primary text-white font-bold shadow-md shadow-primary/20" 
                          : "bg-white border-stone-200 text-stone-600 hover:border-primary hover:text-primary"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Summary & Confirm */}
      <div className="mt-auto p-4 bg-white border-t border-stone-100 rounded-t-3xl shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-stone-500 text-[10px] font-bold uppercase tracking-wider mb-1">預約摘要</h4>
              <p className="text-stone-800 text-sm font-bold">3月{selectedDate}日 {selectedTime}</p>
              <p className="text-stone-600 text-xs">美療師：{selectedTherapist?.name || '未選擇'}</p>
            </div>
            <div className="text-right">
              <p className="text-primary text-2xl font-bold">{selectedService.price}</p>
              <p className="text-stone-400 text-[10px]">預估費用</p>
            </div>
          </div>
          <button 
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
            className={`w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all ${isSubmitting && 'opacity-70'}`}
          >
            {isSubmitting ? '處理中...' : '確認預約'}
          </button>
        </div>
      </div>
    </div>
  );
}
