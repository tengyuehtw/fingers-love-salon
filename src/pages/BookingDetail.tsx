import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useBookings } from '../context/BookingContext';
import { useCoupons } from '../context/CouponContext';

import { useUser } from '../context/UserContext';
import { useNotifications } from '../context/NotificationContext';

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings, moveToHistory } = useBookings();
  const { availableCoupons, userCoupons, useCoupon } = useCoupons();
  const { addConsumption } = useUser();
  const { addNotification } = useNotifications();
  
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'cancelled' | 'completed'>('pending');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);

  const booking = bookings.find(b => b.id.toString() === id);

  useEffect(() => {
    if (booking) {
      setStatus(booking.status);
    }
  }, [booking]);

  if (!booking) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <p className="text-stone-500">找不到此預約</p>
        <button onClick={() => navigate('/member')} className="mt-4 text-primary font-bold">返回會員中心</button>
      </div>
    );
  }

  const handleConfirm = () => {
    // In real app, update backend via context
    setStatus('confirmed');
    setShowConfirmModal(false);
  };

  const handleCancel = () => {
    // In real app, update backend via context
    setStatus('cancelled');
    setShowCancelModal(false);
  };

  const handlePayment = () => {
    const finalPrice = calculateFinalPrice();
    const originalPrice = booking.price || 1200;
    const discountAmount = originalPrice - finalPrice;
    const coupon = userCoupons.find(uc => uc.id === selectedCouponId);
    const couponDetails = coupon ? availableCoupons.find(c => c.id === coupon.couponId) : null;
    
    if (selectedCouponId) {
      useCoupon(selectedCouponId);
    }
    
    moveToHistory(booking.id, {
      originalPrice,
      discountAmount,
      couponName: couponDetails?.title,
      finalPrice
    });
    
    // Update user stats
    addConsumption();
    
    // Add notification
    addNotification({
      title: '消費累積成功',
      desc: `您已完成 1 筆消費，會員點數 +1，消費次數 +1！`,
      time: '剛剛',
      type: 'promo',
      link: '/member'
    });

    setShowPaymentModal(false);
    navigate('/member');
  };

  const calculateFinalPrice = () => {
    let price = booking.price || 1200;
    if (selectedCouponId) {
      const userCoupon = userCoupons.find(uc => uc.id === selectedCouponId);
      if (userCoupon) {
        const coupon = availableCoupons.find(c => c.id === userCoupon.couponId);
        if (coupon) {
          if (coupon.discountType === 'fixed') {
            price = Math.max(0, price - coupon.discountValue);
          } else {
            price = Math.floor(price * (1 - coupon.discountValue)); // e.g. 0.2 discount = 0.8 multiplier? No, discountValue is 0.2 (20% off) usually? 
            // Wait, let's check CouponContext definition.
            // CouponContext: { id: 2, title: '美睫 8 折券', desc: '美睫服務享 8 折優惠', discountType: 'percentage', discountValue: 0.2 }
            // If discountValue is 0.2, it means 20% off? Or 0.8 multiplier?
            // "8折" means 80% of the price. So discount is 20%.
            // If discountValue is 0.2, then price = price * (1 - 0.2) = price * 0.8. Correct.
            // But wait, usually "8折" means multiplier is 0.8.
            // Let's assume discountValue is the discount amount (0.2 = 20% off).
            // Let's check CouponContext again.
            // { id: 2, title: '美睫 8 折券', ... discountValue: 0.2 } -> 20% off? Or 80% price?
            // Usually discountValue for percentage is the percentage to subtract.
            // Let's assume 0.2 means 20% off.
             price = Math.floor(price * (1 - coupon.discountValue));
          }
        }
      }
    }
    return price;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 px-4 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/member')} className="size-10 flex items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-stone-800 dark:text-stone-100">預約詳情</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Status Card */}
        <div className={cn(
          "rounded-2xl p-6 flex flex-col items-center text-center shadow-sm border",
          status === 'pending' && "bg-primary/5 border-primary/20",
          status === 'confirmed' && "bg-logo-green/5 border-logo-green/20",
          status === 'cancelled' && "bg-stone-100 border-stone-200 opacity-60"
        )}>
          <div className={cn(
            "size-16 rounded-full flex items-center justify-center mb-4",
            status === 'pending' && "bg-primary/20 text-primary",
            status === 'confirmed' && "bg-logo-green/20 text-logo-green",
            status === 'cancelled' && "bg-stone-200 text-stone-400"
          )}>
            <span className="material-symbols-outlined text-3xl">
              {status === 'pending' ? 'hourglass_empty' : status === 'confirmed' ? 'check_circle' : 'cancel'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-1">
            {status === 'pending' ? '預約待審核' : status === 'confirmed' ? '預約已確認' : '預約已取消'}
          </h2>
          <p className="text-sm text-stone-500">
            {status === 'pending' && "美療師正在確認行程中，請稍候通知。"}
            {status === 'confirmed' && "您的預約已確認，期待您的光臨！"}
            {status === 'cancelled' && "此預約已取消。"}
          </p>
        </div>

        {/* Details List */}
        <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 shadow-sm border border-stone-100 dark:border-stone-700 space-y-6">
          <div className="flex items-start gap-4">
            <div className="size-10 rounded-xl bg-earth-beige flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">spa</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">服務項目</p>
              <p className="text-base font-bold text-stone-800 dark:text-stone-100">{booking.service}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="size-10 rounded-xl bg-earth-beige flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">預約時間</p>
              <p className="text-base font-bold text-stone-800 dark:text-stone-100">{booking.date} {booking.time}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="size-10 rounded-xl bg-earth-beige flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">face</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">美療師</p>
              <p className="text-base font-bold text-stone-800 dark:text-stone-100">{booking.therapist}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="size-10 rounded-xl bg-earth-beige flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">location_on</span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">服務地點</p>
              <p className="text-base font-bold text-stone-800 dark:text-stone-100">桃園市中壢區新生路38號2樓</p>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("桃園市中壢區新生路38號2樓")}`, '_blank')}
                className="mt-2 flex items-center gap-1 text-xs font-bold text-logo-green"
              >
                <span className="material-symbols-outlined text-sm">navigation</span>
                開啟地圖導航
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 dark:border-stone-700">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">備註事項</p>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {booking.details || "無備註"}
            </p>
          </div>

          <div className="pt-4 flex justify-between items-center text-[10px] text-stone-400 font-bold">
            <span>預約編號: #{booking.id}</span>
            <span>建立於: {booking.date}</span>
          </div>
        </div>

        {/* Action Buttons */}
        {status !== 'cancelled' && status !== 'completed' && (
          <div className="flex flex-col gap-3">
            {status === 'pending' && (
              <button 
                onClick={() => setShowConfirmModal(true)}
                className="w-full bg-logo-green text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-logo-green/20 transition-transform active:scale-95"
              >
                確認會準時到店
              </button>
            )}
            {status === 'confirmed' && (
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">payments</span>
                前往付款
              </button>
            )}
            <button 
              onClick={() => setShowCancelModal(true)}
              className="w-full bg-white dark:bg-stone-800 text-red-500 border border-red-100 dark:border-red-900/30 py-4 rounded-2xl font-bold text-sm transition-transform active:scale-95"
            >
              取消預約
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modals */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirmModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xs bg-white dark:bg-stone-900 rounded-3xl p-8 text-center shadow-2xl">
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">確認到店</h3>
              <p className="text-sm text-stone-500 mb-6">您確認將於 {booking.date} {booking.time} 準時到達店內進行服務嗎？</p>
              <div className="flex flex-col gap-2">
                <button onClick={handleConfirm} className="w-full bg-logo-green text-white py-3 rounded-xl font-bold text-sm">確認</button>
                <button onClick={() => setShowConfirmModal(false)} className="w-full bg-stone-100 dark:bg-stone-800 text-stone-500 py-3 rounded-xl font-bold text-sm">返回</button>
              </div>
            </motion.div>
          </div>
        )}

        {showCancelModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCancelModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xs bg-white dark:bg-stone-900 rounded-3xl p-8 text-center shadow-2xl">
              <h3 className="text-xl font-bold text-red-500 mb-2">取消預約</h3>
              <p className="text-sm text-stone-500 mb-6">確定要取消這次預約嗎？取消後將無法恢復。</p>
              <div className="flex flex-col gap-2">
                <button onClick={handleCancel} className="w-full bg-red-500 text-white py-3 rounded-xl font-bold text-sm">確定取消</button>
                <button onClick={() => setShowCancelModal(false)} className="w-full bg-stone-100 dark:bg-stone-800 text-stone-500 py-3 rounded-xl font-bold text-sm">返回</button>
              </div>
            </motion.div>
          </div>
        )}

        {showPaymentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPaymentModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">結帳付款</h3>
                <button onClick={() => setShowPaymentModal(false)} className="size-8 flex items-center justify-center rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-stone-500">服務金額</span>
                    <span className="text-sm font-bold text-stone-800 dark:text-stone-100">${booking.price || 1200}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">選擇優惠券</label>
                    <div className="space-y-2">
                      {userCoupons.filter(uc => !uc.used).length > 0 ? (
                        userCoupons.filter(uc => !uc.used).map(uc => {
                          const coupon = availableCoupons.find(c => c.id === uc.couponId);
                          if (!coupon) return null;
                          return (
                            <button
                              key={uc.id}
                              onClick={() => setSelectedCouponId(selectedCouponId === uc.id ? null : uc.id)}
                              className={cn(
                                "w-full text-left p-3 rounded-xl border transition-all flex justify-between items-center group",
                                selectedCouponId === uc.id 
                                  ? "bg-primary/5 border-primary text-primary" 
                                  : "bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-primary/50"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-10 h-10 rounded-lg flex flex-col items-center justify-center text-white text-[9px] font-bold shrink-0",
                                  coupon.color || "bg-stone-500"
                                )}>
                                  {coupon.discountType === 'fixed' ? (
                                    <>
                                      <span>折</span>
                                      <span className="text-xs">${coupon.discountValue}</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-xs">{Math.round((1 - coupon.discountValue) * 100) / 10}折</span>
                                    </>
                                  )}
                                </div>
                                <div>
                                  <p className="text-xs font-bold">{coupon.title}</p>
                                  <p className="text-[10px] opacity-70 line-clamp-1">{coupon.desc}</p>
                                </div>
                              </div>
                              {selectedCouponId === uc.id && (
                                <span className="material-symbols-outlined text-lg text-primary">check_circle</span>
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <p className="text-xs text-stone-400 italic">無可用優惠券</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-stone-500">折扣金額</span>
                      <span className="text-sm font-bold text-red-500">
                        -${(booking.price || 1200) - calculateFinalPrice()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-stone-800 dark:text-stone-100">應付金額</span>
                      <span className="text-xl font-black text-primary">${calculateFinalPrice()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handlePayment}
                className="w-full mt-6 bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">check_circle</span>
                確認付款 (模擬後台入帳)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
