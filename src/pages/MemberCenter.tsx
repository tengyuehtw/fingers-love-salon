import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useNotifications } from '../context/NotificationContext';
import { supabase } from '../lib/supabase';
import { useCoupons } from '../context/CouponContext';
import { useBookings } from '../context/BookingContext';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'motion/react';

const LOGO_URL = "https://images.unsplash.com/photo-1620912189865-1e8a33da4c5e?q=80&w=200&auto=format&fit=crop"; // Salon logo placeholder

const MEMBERSHIP_LEVELS = [
  {
    id: 'bronze',
    name: '黃銅級',
    threshold: 0,
    nextThreshold: 5,
    color: 'from-[#A1887F] to-[#795548]',
    icon: 'workspace_premium',
    desc: '初始會員等級。開啟您的專屬美學旅程，累積消費次數解鎖更多權益。'
  },
  {
    id: 'silver',
    name: '銀級',
    threshold: 5,
    nextThreshold: 11,
    color: 'from-[#CFD8DC] to-[#90A4AE]',
    icon: 'stars',
    desc: '消費滿 5 次晉升。享有專屬預約優先權，並獲得入會禮一份。'
  },
  {
    id: 'crystal',
    name: '晶鑽級',
    threshold: 11,
    nextThreshold: 21,
    color: 'from-[#C98A7D] to-[#A0564B]', // Rose gold earth tone
    icon: 'diamond',
    desc: '消費滿 11 次晉升。生日當月享有 9 折優惠，及不定期新品試用。'
  },
  {
    id: 'diamond',
    name: '鑽石級',
    threshold: 21,
    nextThreshold: 29,
    color: 'from-[#8B6F6F] via-[#7B3F3F] to-[#5C2D2D]', // Deep wine earth tone
    icon: 'military_tech',
    desc: '消費滿 21 次晉升。每次消費點數 1.5 倍送，並享有專屬美療師諮詢。'
  },
  {
    id: 'gold_diamond',
    name: '金鑽級',
    threshold: 29,
    nextThreshold: Infinity,
    color: 'from-[#FFD700] via-[#FBC02D] to-[#F57F17]',
    icon: 'auto_awesome',
    desc: '最高等級會員。享有全店服務 85 折優惠，專屬 VIP 休息室及頂級護理禮包。'
  },
];



export default function MemberCenter() {
  const { notifications, deleteNotification, markAsRead, addNotification, markAllAsRead, clearAll } = useNotifications();
  const { userCoupons, availableCoupons, useCoupon } = useCoupons();
  const { bookings, history } = useBookings();
  const { consumptionCount, stamps, redeemStamps, addPoints, user, profile, loading: userLoading, signOut, updateProfile } = useUser();
  const navigate = useNavigate();

  // 如果還在讀取，或者沒有使用者/Profile，就回到登入頁
  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/login');
    }
  }, [user, userLoading, navigate]);

  // Member State
  const [redemptionStatus, setRedemptionStatus] = useState<'idle' | 'pending' | 'approved'>('idle');
  const [pointsStatus, setPointsStatus] = useState<'idle' | 'pending'>('idle');
  const [pointsToApply, setPointsToApply] = useState(1);
  const [selectedGift, setSelectedGift] = useState<'care' | 'oil' | null>(null);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<typeof history[0] | null>(null);
  const [couponFilter, setCouponFilter] = useState<'active' | 'used' | 'expired'>('active');

  const [localProfile, setLocalProfile] = useState({
    gender: '女',
    lineId: '尚未綁定',
    igId: '尚未綁定',
    fullName: profile?.display_name || '',
    phone: profile?.phone || '',
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState(localProfile);
  const [securityRequest, setSecurityRequest] = useState<{ type: 'email' | 'password', value: string } | null>(null);

  const displayAvatar = profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';
  const displayName = profile?.display_name || 'VIP 會員';
  const displayPhone = profile?.phone || '尚未提供手機號碼';
  const displayEmail = profile?.email || user?.email || 'N/A';

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      // 這邊先不真做儲存 Storage 的動作，僅 Demo UI
      addNotification({
        title: '照片上傳功能建設中',
        desc: '目前我們只連通了 Profile 表格資料，相片儲存空間會在後續開啟。',
        time: '剛剛',
        type: 'tip',
        link: '/member'
      });
    }
  };

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleSaveProfile = async () => {
    try {
      setIsSavingProfile(true);

      // 1. 更新 Auth 資訊 (如果 email 或密碼有變動)
      const authUpdates: any = {};
      if (tempProfile.email && tempProfile.email !== profile.email) {
        authUpdates.email = tempProfile.email;
      }
      if (tempProfile.newPassword) {
        authUpdates.password = tempProfile.newPassword;
      }

      if (Object.keys(authUpdates).length > 0) {
        const { error: authError } = await supabase.auth.updateUser(authUpdates);
        if (authError) throw authError;
      }

      // 2. 更新 Profile 資料 (DB)
      await updateProfile({
        display_name: tempProfile.fullName,
        phone: tempProfile.phone,
      });

      setLocalProfile(tempProfile);
      setIsProfileModalOpen(false);

      addNotification({
        title: authUpdates.email || authUpdates.password ? '帳號資料已更新 (轉正成功)' : '個人資料已更新',
        desc: authUpdates.email ? `信箱已更新為 ${tempProfile.email}，下次請以此登入。` : '您的會員資料已成功同步儲存至系統。',
        time: '剛剛',
        type: 'tip',
        link: '/member'
      });
    } catch (err: any) {
      console.error('Update failed:', err);
      addNotification({
        title: '更新失敗',
        desc: err.message || '無法儲存您的資料，請稍後再試。',
        time: '剛剛',
        type: 'alert',
        link: '/member'
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSecurityRequest = async (type: 'email' | 'password', value: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ [type]: value });
      if (error) throw error;

      addNotification({
        title: `${type === 'email' ? '信箱' : '密碼'}已更新`,
        desc: `您的帳號安全資訊已成功更新，${type === 'email' ? '下次登入請使用新信箱。' : '請牢記您的新密碼。'}`,
        time: '剛剛',
        type: 'alert',
        link: '/member'
      });
      setIsSecurityModalOpen(false);
    } catch (err: any) {
      addNotification({
        title: '操作失敗',
        desc: err.message || '更新帳號資訊時出錯，請稍後再試。',
        time: '剛剛',
        type: 'alert',
        link: '/member'
      });
    }
  };

  const currentLevel = [...MEMBERSHIP_LEVELS].reverse().find(l => consumptionCount >= l.threshold) || MEMBERSHIP_LEVELS[0];
  const nextLevel = MEMBERSHIP_LEVELS.find(l => l.threshold > currentLevel.threshold);

  const progressToNext = nextLevel
    ? ((consumptionCount - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100
    : 100;

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNotification(id);
  };

  const handleApplyRedemption = (gift: 'care' | 'oil') => {
    setSelectedGift(gift);
    setRedemptionStatus('pending');
    addNotification({
      title: '兌換申請已送出',
      desc: `您已申請兌換「${gift === 'care' ? '基礎手部護理' : '指緣油一瓶'}」，請靜候後台審核。`,
      time: '剛剛',
      type: 'alert',
      link: '/member'
    });
  };

  const simulateApproval = () => {
    setRedemptionStatus('approved');
    addNotification({
      title: '兌換申請已核准',
      desc: `您的禮品「${selectedGift === 'care' ? '基礎手部護理' : '指緣油一瓶'}」已核准，積點獎勵已扣除 5 點。`,
      time: '剛剛',
      type: 'promo',
      link: '/member'
    });
    // Reset stamps after a short delay to show the "approved" state
    setTimeout(() => {
      redeemStamps(); // Use context function
      setRedemptionStatus('idle');
      setSelectedGift(null);
    }, 2000);
  };

  const handleApplyPoints = () => {
    setPointsStatus('pending');
    addNotification({
      title: '點數申請已送出',
      desc: `您已申請增加 ${pointsToApply} 點積點，請靜候後台審核。`,
      time: '剛剛',
      type: 'alert',
      link: '/member'
    });
  };

  const simulatePointsApproval = () => {
    addPoints(pointsToApply); // Use context function
    setPointsStatus('idle');
    addNotification({
      title: '點數申請已核准',
      desc: `您的 ${pointsToApply} 點積點申請已通過！`,
      time: '剛剛',
      type: 'promo',
      link: '/member'
    });
  };

  const handleRedeemClick = () => {
    if (stamps >= 5) {
      setIsRedeemModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col px-6 pb-32 bg-earth-beige min-h-screen">
      {/* Profile Header */}
      <div className="flex items-center justify-between my-6">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img alt="Profile Image" className="w-20 h-20 rounded-full object-cover border-2 border-logo-green/30 p-1 bg-white"
              src={displayAvatar}
              referrerPolicy="no-referrer" />
            <label className="absolute bottom-0 right-0 bg-primary w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[14px] text-white">photo_camera</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800">{displayName}</h2>
            <p className="text-sm font-bold text-primary">{currentLevel.name}會員</p>
          </div>
        </div>
        <button
          onClick={() => {
            setTempProfile({
              nickname: profile?.display_name || '',
              fullName: profile?.display_name || '',
              gender: '女',
              phone: profile?.phone || '',
              lineId: '',
              igId: '',
              email: profile?.email || '', // 新增
              newPassword: '' // 新增
            });
            setIsProfileModalOpen(true);
          }}
          className="size-10 bg-white/80 rounded-full shadow-sm flex items-center justify-center text-stone-500 hover:text-primary transition-colors border border-stone-100"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>

      {/* Membership Card Container */}
      <div className="mb-8">
        <div className={cn(
          "relative rounded-2xl p-6 text-white overflow-hidden shadow-xl transition-all duration-500 bg-gradient-to-br",
          currentLevel.color
        )}>
          {/* Logo Overlay */}
          <div className="absolute top-4 right-4 w-12 h-12 opacity-20 mix-blend-overlay">
            <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                <div className="size-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/30">
                  <img src={LOGO_URL} alt="Fingers Love" className="w-8 h-8 object-contain brightness-0 invert" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-80">Fingers Love</p>
                  <p className="text-xs font-black italic">PREMIUM CLUB</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-4xl text-white/40 fill-1">{currentLevel.icon}</span>
            </div>

            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-80 mb-1">消費療程次數</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-white">{consumptionCount}</h3>
                  <span className="text-sm font-medium opacity-80">次</span>
                </div>
              </div>

              {/* Barcode / QR Code Button */}
              <button
                onClick={() => setIsBarcodeModalOpen(true)}
                className="flex flex-col items-center justify-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
                <span className="text-[9px] font-bold tracking-widest uppercase">會員條碼</span>
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                <span>{currentLevel.name}</span>
                {nextLevel ? (
                  <span>距離 {nextLevel.name} 還差 {nextLevel.threshold - consumptionCount} 次</span>
                ) : (
                  <span>已達最高等級</span>
                )}
              </div>
              <div className="bg-black/20 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  className="bg-white h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Level Description Link */}
        <button
          onClick={() => setIsLevelModalOpen(true)}
          className="mt-3 flex items-center gap-1 text-[11px] text-stone-400 hover:text-primary transition-colors mx-auto"
        >
          <span className="material-symbols-outlined text-sm">info</span>
          等級說明與權益
        </button>
      </div>

      {/* Stamp Card */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold tracking-wider text-logo-green">積點獎勵 (5點集滿)</h3>
            <p className="text-[10px] text-stone-400 mt-0.5">※ 一個療程累積一點</p>
          </div>
          <span className="text-[10px] text-stone-400">卡號：#8823</span>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-primary/10 shadow-md">
          <div className="grid grid-cols-5 gap-3 mb-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={cn(
                "aspect-square rounded-xl flex items-center justify-center border-2 transition-all duration-300",
                i <= stamps
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-stone-100/50 border-dashed border-stone-300 text-stone-300"
              )}>
                {i <= stamps ? (
                  <span className="material-symbols-outlined text-2xl fill-1">verified</span>
                ) : (
                  <span className="text-sm font-bold">{i}</span>
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {redemptionStatus === 'idle' ? (
              <div className="space-y-4">
                {/* Points Application Section (Always visible if stamps < 5) */}
                {stamps < 5 && (
                  <div className="space-y-3 p-3 bg-earth-beige/50 rounded-xl border border-primary/5">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-stone-500">選擇本次消費療程數</p>
                      <select
                        value={pointsToApply}
                        disabled={pointsStatus === 'pending'}
                        onChange={(e) => setPointsToApply(Number(e.target.value))}
                        className="bg-white border border-primary/20 rounded-lg text-xs font-bold text-stone-800 px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
                      >
                        {[1, 2, 3, 4, 5].map(v => (
                          <option key={v} value={v}>{v} 點</option>
                        ))}
                      </select>
                    </div>

                    {pointsStatus === 'pending' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-2 rounded-lg text-center"
                      >
                        <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                          <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                          <p className="text-[9px] font-bold">點數審核中 ({pointsToApply} 點)</p>
                        </div>
                        <button
                          onClick={simulatePointsApproval}
                          className="text-[8px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold hover:bg-blue-700 transition-colors"
                        >
                          (模擬批准點數)
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}

                <p className="text-xs text-center text-stone-500">
                  {stamps >= 5 ? "恭喜！您已集滿 5 點，快來兌換好禮吧！" : `再集 ${5 - stamps} 點即可兌換「基礎手部護理」一次或「指緣油一瓶」！`}
                </p>

                <div className="flex gap-2">
                  {stamps < 5 && (
                    <button
                      onClick={handleApplyPoints}
                      disabled={pointsStatus === 'pending'}
                      className={cn(
                        "flex-1 py-3 rounded-xl font-bold text-sm transition-all",
                        pointsStatus === 'pending'
                          ? "bg-stone-100 text-stone-300 cursor-not-allowed"
                          : "bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-90 active:scale-95"
                      )}
                    >
                      申請點數
                    </button>
                  )}
                  <button
                    onClick={handleRedeemClick}
                    disabled={stamps < 5}
                    className={cn(
                      "flex-[1.5] py-3 rounded-xl font-bold text-sm transition-all duration-500 relative overflow-hidden",
                      stamps >= 5
                        ? "bg-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] animate-pulse active:scale-95"
                        : "bg-stone-200 dark:bg-stone-700 text-stone-400 cursor-not-allowed"
                    )}
                  >
                    {stamps >= 5 && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    )}
                    申請兌換
                  </button>
                </div>
              </div>
            ) : redemptionStatus === 'pending' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl text-center"
              >
                <div className="flex items-center justify-center gap-2 text-amber-600 mb-1">
                  <span className="material-symbols-outlined text-lg animate-pulse">hourglass_empty</span>
                  <p className="text-xs font-bold">兌換申請審核中</p>
                </div>
                <p className="text-[10px] text-amber-500">禮品：{selectedGift === 'care' ? '基礎手部護理' : '指緣油一瓶'}</p>
                <button
                  onClick={simulateApproval}
                  className="mt-3 text-[10px] bg-amber-600 text-white px-3 py-1 rounded-full font-bold hover:bg-amber-700 transition-colors"
                >
                  (模擬後台批准)
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-xl text-center"
              >
                <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <p className="text-xs font-bold">兌換成功！</p>
                </div>
                <p className="text-[10px] text-green-500">積點獎勵即將歸零...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Coupons Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-bold tracking-wider text-logo-green">我的優惠券</h3>
          <div className="flex bg-stone-100 dark:bg-stone-800 rounded-lg p-0.5">
            <button
              onClick={() => setCouponFilter('active')}
              className={cn(
                "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                couponFilter === 'active'
                  ? "bg-white dark:bg-stone-700 text-primary shadow-sm"
                  : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
              )}
            >
              未使用
            </button>
            <button
              onClick={() => setCouponFilter('used')}
              className={cn(
                "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                couponFilter === 'used'
                  ? "bg-white dark:bg-stone-700 text-primary shadow-sm"
                  : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
              )}
            >
              已使用
            </button>
            <button
              onClick={() => setCouponFilter('expired')}
              className={cn(
                "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                couponFilter === 'expired'
                  ? "bg-white dark:bg-stone-700 text-primary shadow-sm"
                  : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
              )}
            >
              已過期
            </button>
          </div>
        </div>

        {userCoupons.length > 0 ? (
          <div className="space-y-3">
            {userCoupons.filter(uc => {
              const coupon = availableCoupons.find(c => c.id === uc.couponId);
              if (!coupon) return false;
              const isExpired = new Date(coupon.expiryDate) < new Date();

              if (couponFilter === 'active') return !uc.used && !isExpired;
              if (couponFilter === 'used') return uc.used;
              if (couponFilter === 'expired') return !uc.used && isExpired;
              return false;
            }).length > 0 ? (
              userCoupons.filter(uc => {
                const coupon = availableCoupons.find(c => c.id === uc.couponId);
                if (!coupon) return false;
                const isExpired = new Date(coupon.expiryDate) < new Date();

                if (couponFilter === 'active') return !uc.used && !isExpired;
                if (couponFilter === 'used') return uc.used;
                if (couponFilter === 'expired') return !uc.used && isExpired;
                return false;
              }).map(uc => {
                const coupon = availableCoupons.find(c => c.id === uc.couponId);
                if (!coupon) return null;
                const isExpired = new Date(coupon.expiryDate) < new Date();

                return (
                  <div key={uc.id} className={cn(
                    "bg-white dark:bg-stone-800 rounded-2xl p-4 border shadow-sm flex items-center justify-between transition-all",
                    isExpired && couponFilter === 'expired' ? "opacity-60 grayscale border-stone-100 dark:border-stone-700" : "border-stone-100 dark:border-stone-700"
                  )}>
                    <div>
                      <h4 className="font-bold text-sm text-stone-800 dark:text-stone-100">{coupon.title}</h4>
                      <p className="text-[10px] text-stone-500">{coupon.desc}</p>
                      <p className="text-[9px] text-stone-400 mt-1">有效期限: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
                    </div>
                    {uc.used ? (
                      <span className="text-[10px] font-bold text-stone-400 bg-stone-100 dark:bg-stone-700 px-2 py-1 rounded-lg">已使用</span>
                    ) : isExpired ? (
                      <span className="text-[10px] font-bold text-stone-400 bg-stone-100 dark:bg-stone-700 px-2 py-1 rounded-lg">已過期</span>
                    ) : (
                      <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg">結帳時可使用</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center bg-stone-50 dark:bg-stone-800/20 rounded-2xl border border-dashed border-stone-200 dark:border-stone-700">
                <p className="text-xs text-stone-400">
                  {couponFilter === 'active' ? '目前沒有可使用的優惠券' :
                    couponFilter === 'used' ? '目前沒有已使用的優惠券' : '目前沒有已過期的優惠券'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center bg-stone-50 dark:bg-stone-800/20 rounded-2xl border border-dashed border-stone-200 dark:border-stone-700">
            <p className="text-xs text-stone-400">目前沒有任何優惠券</p>
          </div>
        )}
      </div>

      {/* Bookings Section */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4 px-1">
          <h3 className="text-sm font-bold tracking-wider text-logo-green">我的預約</h3>
          <button onClick={() => setIsBookingsModalOpen(true)} className="text-xs font-bold text-primary hover:underline">查看全部預約</button>
        </div>

        {/* Upcoming Booking (Show only the first one) */}
        {bookings.slice(0, 1).map(booking => (
          <Link key={booking.id} to={`/booking/${booking.id}`} className="block bg-white dark:bg-stone-800 rounded-2xl p-4 border-2 border-primary/30 shadow-md mb-4 relative overflow-hidden transition-transform active:scale-[0.98]">
            <div className={cn("absolute top-0 right-0 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest", booking.status === 'pending' ? "bg-amber-500" : "bg-primary")}>
              {booking.status === 'pending' ? '預約審核中' : '預約成功'}
            </div>
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex flex-col items-center justify-center shrink-0 border border-primary/20">
                <span className="text-[10px] font-bold text-primary">{booking.month}</span>
                <span className="text-xl font-extrabold text-primary">{booking.day}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-stone-800 dark:text-stone-100">{booking.service}</h4>
                <p className="text-xs text-stone-500 mb-2">{booking.dayOfWeek} • {booking.time}</p>
                <div className="flex items-center gap-2">
                  <span className="bg-stone-100 dark:bg-stone-700 text-stone-500 text-[10px] font-bold px-2 py-0.5 rounded">
                    {booking.status === 'pending' ? '預約審核中' : '預約成功'}
                  </span>
                  <span className="text-[10px] text-stone-400">美療師: {booking.therapist}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* Consumption History Button */}
        <button
          onClick={() => setIsHistoryModalOpen(true)}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 shadow-sm hover:border-primary transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 bg-logo-green/10 rounded-xl flex items-center justify-center text-logo-green">
              <span className="material-symbols-outlined text-xl">receipt_long</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-stone-800 dark:text-stone-100">消費紀錄</p>
              <p className="text-[10px] text-stone-500">查看您的歷史消費明細</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-stone-300 group-hover:text-primary transition-colors">chevron_right</span>
        </button>
      </div>

      {/* Account Security Section */}
      <div className="mb-8">
        <h3 className="text-sm font-bold tracking-wider text-logo-green mb-4 px-1">帳號安全</h3>
        <div className="bg-white dark:bg-stone-800 rounded-2xl p-5 border border-stone-100 dark:border-stone-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 bg-stone-100 dark:bg-stone-700 rounded-lg flex items-center justify-center text-stone-500">
                <span className="material-symbols-outlined text-xl">mail</span>
              </div>
              <div>
                <p className="text-[10px] text-stone-400 font-bold uppercase">註冊信箱</p>
                <p className="text-xs font-bold text-stone-800 dark:text-stone-100">{displayEmail}</p>
              </div>
            </div>
            <button
              onClick={() => setIsSecurityModalOpen(true)}
              className="text-[10px] font-bold text-primary hover:underline"
            >
              申請更改
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 bg-white shadow-sm border border-stone-100 rounded-lg flex items-center justify-center text-stone-500">
                <span className="material-symbols-outlined text-xl">lock</span>
              </div>
              <div>
                <p className="text-[10px] text-stone-400 font-bold uppercase">登入密碼</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-stone-800">
                    {profile.is_guest ? `${profile.initial_password?.substring(0, 4)}••••` : '••••••••'}
                  </p>
                  {profile.is_guest && (
                    <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">預設</span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsSecurityModalOpen(true)}
              className="text-[10px] font-bold text-primary hover:underline"
            >
              直接更改
            </button>
          </div>

          {securityRequest && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-blue-500 text-lg animate-pulse">info</span>
              <p className="text-[10px] font-bold text-blue-600">
                {securityRequest.type === 'email' ? '信箱' : '密碼'}變更申請審核中...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notifications Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-sm font-bold tracking-wider text-logo-green flex items-center gap-2">
            <span>通知中心</span>
            {notifications.length > 0 && (
              <span className="size-5 bg-primary text-white text-[10px] flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            )}
          </h3>
          {notifications.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-primary hover:underline"
              >
                全部讀取
              </button>
              <button
                onClick={clearAll}
                className="text-[10px] font-bold text-stone-400 hover:text-red-500 transition-colors"
              >
                全部清除
              </button>
            </div>
          )}
        </div>
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map(n => (
              <Link
                key={n.id}
                to={n.link}
                onClick={() => markAsRead(n.id)}
                className={cn(
                  "block border rounded-xl p-4 flex gap-3 transition-transform active:scale-[0.98] relative group",
                  n.unread ? "bg-primary/10 border-primary/20" : "bg-white border-stone-100"
                )}
              >
                <span className={cn(
                  "material-symbols-outlined text-xl",
                  n.unread ? "text-primary" : "text-stone-300"
                )}>
                  {n.type === 'tip' ? 'lightbulb' : n.type === 'alert' ? 'notifications_active' : 'campaign'}
                </span>
                <div className="flex-1">
                  <p className={cn("text-xs font-bold", n.unread ? "text-stone-800" : "text-stone-500")}>{n.title}</p>
                  <p className="text-[11px] text-stone-600 mt-0.5">{n.desc}</p>
                  <p className="text-[9px] text-stone-400 mt-1">{n.time}</p>
                </div>
                <button
                  onClick={(e) => handleDelete(e, n.id)}
                  className="absolute right-2 top-2 size-6 flex items-center justify-center rounded-full text-stone-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </Link>
            ))
          ) : (
            <div className="py-8 text-center bg-stone-50 dark:bg-stone-800/20 rounded-2xl border border-dashed border-stone-200 dark:border-stone-700">
              <p className="text-xs text-stone-400">目前沒有新通知</p>
            </div>
          )}
        </div>
      </div>

      {/* Account Management */}
      <div className="mt-4">
        <h3 className="text-sm font-bold tracking-wider text-logo-green mb-4 px-1">帳戶管理</h3>
        <div className="grid grid-cols-1 gap-4">
          <button onClick={signOut} className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-sm transition-transform active:scale-95">
            <span className="material-symbols-outlined text-sm">logout</span>
            登出並前往登入頁面
          </button>
        </div>
      </div>

      {/* Development Team Info */}
      <div className="mt-8 mb-4 text-center">
        <p className="text-[10px] text-stone-400 font-medium">WASP MarTec Co.,Ltd ＠版權宣告2026</p>
        <p className="text-[10px] text-stone-400 font-medium mt-1">
          <a href="#" className="hover:text-primary transition-colors">蜂電科技</a>
          <span className="mx-1">＆</span>
          <a href="#" className="hover:text-primary transition-colors">騰鉞企業</a>
          <span className="ml-1">共同開發</span>
        </p>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isLevelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLevelModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-800/50">
                <h3 className="font-bold text-stone-800 dark:text-stone-100">會員等級說明</h3>
                <button onClick={() => setIsLevelModalOpen(false)} className="size-8 flex items-center justify-center rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <div className="overflow-y-auto p-6 space-y-6">
                {MEMBERSHIP_LEVELS.map((level) => (
                  <div key={level.id} className="space-y-3">
                    <div className={cn(
                      "h-24 rounded-xl p-4 text-white relative overflow-hidden bg-gradient-to-br shadow-md",
                      level.color
                    )}>
                      <div className="absolute top-2 right-2 w-8 h-8 opacity-20 mix-blend-overlay">
                        <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div className="relative z-10 flex justify-between items-center h-full">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Fingers Love</p>
                          <h4 className="text-xl font-black italic">{level.name}</h4>
                        </div>
                        <span className="material-symbols-outlined text-3xl opacity-50">{level.icon}</span>
                      </div>
                    </div>
                    <div className="px-1">
                      <p className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                        晉升條件：消費滿 {level.threshold} 次
                      </p>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        {level.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRedeemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRedeemModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2 text-center">選擇兌換禮品</h3>
              <p className="text-xs text-stone-500 text-center mb-6">請選擇一項您想要兌換的專屬好禮</p>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => {
                    handleApplyRedemption('care');
                    setIsRedeemModalOpen(false);
                  }}
                  className="flex items-center gap-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 hover:border-primary transition-all group"
                >
                  <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">spa</span>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-stone-800 dark:text-stone-100">基礎手部護理</p>
                    <p className="text-[10px] text-stone-500">專業修型與指緣深層滋養</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    handleApplyRedemption('oil');
                    setIsRedeemModalOpen(false);
                  }}
                  className="flex items-center gap-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 hover:border-primary transition-all group"
                >
                  <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">water_drop</span>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-stone-800 dark:text-stone-100">指緣油一瓶</p>
                    <p className="text-[10px] text-stone-500">隨時隨地呵護您的指尖健康</p>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setIsRedeemModalOpen(false)}
                className="w-full mt-6 py-3 text-stone-400 font-bold text-sm"
              >
                取消
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Consumption History Modal */}
      <AnimatePresence>
        {isHistoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-800/50">
                <h3 className="font-bold text-stone-800 dark:text-stone-100">消費紀錄</h3>
                <button onClick={() => setIsHistoryModalOpen(false)} className="size-8 flex items-center justify-center rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <div className="overflow-y-auto p-6 space-y-4">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedHistoryItem(item)}
                    className="w-full text-left p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 hover:border-primary transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{item.date}</p>
                      <p className="text-sm font-black text-primary">${item.price}</p>
                    </div>
                    <p className="font-bold text-stone-800 dark:text-stone-100 text-sm mb-1">{item.service}</p>
                    <p className="text-[10px] text-stone-500">美療師: {item.therapist}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Detail Modal */}
      <AnimatePresence>
        {selectedHistoryItem && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedHistoryItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">消費明細</h3>
                <button onClick={() => setSelectedHistoryItem(null)} className="size-8 flex items-center justify-center rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                  <span className="text-xs text-stone-400">消費日期</span>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-100">{selectedHistoryItem.date}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                  <span className="text-xs text-stone-400">服務項目</span>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-100">{selectedHistoryItem.service}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                  <span className="text-xs text-stone-400">美療師</span>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-100">{selectedHistoryItem.therapist}</span>
                </div>

                {/* Detailed Price Breakdown */}
                <div className="bg-stone-50 dark:bg-stone-800/50 p-3 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-stone-500">原價</span>
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-100">${selectedHistoryItem.originalPrice || selectedHistoryItem.price}</span>
                  </div>
                  {selectedHistoryItem.discountAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-stone-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px] text-red-500">local_offer</span>
                        折扣優惠 {selectedHistoryItem.couponName ? `(${selectedHistoryItem.couponName})` : ''}
                      </span>
                      <span className="text-xs font-bold text-red-500">-${selectedHistoryItem.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-stone-200 dark:border-stone-700 mt-1">
                    <span className="text-sm font-bold text-stone-800 dark:text-stone-100">實付金額</span>
                    <span className="text-lg font-black text-primary">${selectedHistoryItem.finalPrice || selectedHistoryItem.price}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">服務細節</p>
                  <p className="text-xs text-stone-500 leading-relaxed bg-stone-50 dark:bg-stone-800 p-3 rounded-xl">
                    {selectedHistoryItem.details}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedHistoryItem(null)}
                className="w-full mt-8 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-sm transition-transform active:scale-95"
              >
                確認
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pb-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-800/50">
                <h3 className="font-bold text-stone-800 dark:text-stone-100">編輯個人資料</h3>
                <button onClick={() => setIsProfileModalOpen(false)} className="size-8 flex items-center justify-center rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <div className="overflow-y-auto p-6 space-y-5">
                {/* Account Credentials Section (Now Editable) */}
                <div className="p-4 bg-earth-beige/40 rounded-2xl border border-primary/10 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest ml-1">登入信箱 (可用於下次登入)</label>
                    <input
                      type="email"
                      value={tempProfile.email || profile.email}
                      onChange={(e) => setTempProfile(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="設定您的正式信箱"
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-bold text-stone-800 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest ml-1">重設密碼</label>
                    <input
                      type="password"
                      value={tempProfile.newPassword || ''}
                      onChange={(e) => setTempProfile(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="輸入新密碼以取代預設密碼"
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-bold text-stone-800 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  {profile.is_guest && (
                    <p className="text-[9px] text-primary/70 font-medium px-1 italic">
                      💡 提示：修改後即可使用新信箱密碼從電腦或其他裝置登入。
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">顯示名稱 (暱稱)</label>
                  <input
                    type="text"
                    value={tempProfile.nickname}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, nickname: e.target.value }))}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">真實姓名</label>
                  <input
                    type="text"
                    value={tempProfile.fullName}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">性別</label>
                  <div className="flex gap-3">
                    {['男', '女', '其他'].map(g => (
                      <button
                        key={g}
                        onClick={() => setTempProfile(prev => ({ ...prev, gender: g }))}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all",
                          tempProfile.gender === g
                            ? "bg-primary border-primary text-white"
                            : "bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500"
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">手機電話</label>
                  <input
                    type="tel"
                    value={tempProfile.phone}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">LINE ID</label>
                  <input
                    type="text"
                    value={tempProfile.lineId}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, lineId: e.target.value }))}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">IG ID</label>
                  <input
                    type="text"
                    value={tempProfile.igId}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, igId: e.target.value }))}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-stone-100 dark:border-stone-800">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSavingProfile}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSavingProfile ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                      儲存中...
                    </>
                  ) : (
                    '儲存修改'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Security Edit Modal */}
      <AnimatePresence>
        {isSecurityModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pb-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSecurityModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">帳號安全申請</h3>
                <button onClick={() => setIsSecurityModalOpen(false)} className="size-8 flex items-center justify-center rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                基於安全考量，信箱與密碼的變更需經由後台人工審核。申請送出後，審核通過將於下次登入時生效。
              </p>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">申請變更信箱</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="輸入新信箱"
                      className="flex-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
                      id="new-email-input"
                    />
                    <button
                      onClick={() => {
                        const val = (document.getElementById('new-email-input') as HTMLInputElement).value;
                        if (val) handleSecurityRequest('email', val);
                      }}
                      className="bg-primary text-white px-4 rounded-xl font-bold text-xs"
                    >
                      申請
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">申請變更密碼</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="輸入新密碼"
                      className="flex-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
                      id="new-password-input"
                    />
                    <button
                      onClick={() => {
                        const val = (document.getElementById('new-password-input') as HTMLInputElement).value;
                        if (val) handleSecurityRequest('password', val);
                      }}
                      className="bg-primary text-white px-4 rounded-xl font-bold text-xs"
                    >
                      申請
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Barcode Modal */}
      <AnimatePresence>
        {isBarcodeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBarcodeModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-stone-100"
            >
              <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-800/50">
                <h3 className="font-bold text-stone-800 dark:text-stone-100">會員條碼</h3>
                <button onClick={() => setIsBarcodeModalOpen(false)} className="size-8 flex items-center justify-center rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <div className="p-8 flex flex-col items-center justify-center space-y-6">
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-stone-800 dark:text-stone-100">{profile.fullName}</p>
                  <p className="text-xs text-stone-500">{currentLevel.name}會員</p>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
                  {/* Placeholder for actual barcode/QR code image */}
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MEMBER-8823"
                    alt="Member QR Code"
                    className="w-48 h-48 object-contain"
                  />
                </div>

                <div className="text-center space-y-1">
                  <p className="text-2xl font-mono font-bold tracking-widest text-stone-800 dark:text-stone-100">8823</p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest">結帳時請出示此條碼</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Bookings Modal */}
      <AnimatePresence>
        {isBookingsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pb-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-800/50">
                <h3 className="font-bold text-stone-800 dark:text-stone-100">全部預約紀錄</h3>
                <button onClick={() => setIsBookingsModalOpen(false)} className="size-8 flex items-center justify-center rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <div className="overflow-y-auto p-6 space-y-4">
                {bookings.map((booking) => (
                  <Link
                    key={booking.id}
                    to={`/booking/${booking.id}`}
                    onClick={() => setIsBookingsModalOpen(false)}
                    className="block w-full text-left p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 hover:border-primary transition-all group relative overflow-hidden"
                  >
                    <div className={cn("absolute top-0 right-0 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest", booking.status === 'pending' ? "bg-amber-500" : "bg-primary")}>
                      {booking.status === 'pending' ? '預約審核中' : '預約成功'}
                    </div>
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-white dark:bg-stone-700 rounded-xl flex flex-col items-center justify-center shrink-0 border border-stone-200 dark:border-stone-600 shadow-sm">
                        <span className="text-[9px] font-bold text-stone-500">{booking.month}</span>
                        <span className="text-lg font-extrabold text-stone-800 dark:text-stone-100">{booking.day}</span>
                      </div>
                      <div className="flex-1 pt-1">
                        <h4 className="font-bold text-sm text-stone-800 dark:text-stone-100 mb-1">{booking.service}</h4>
                        <p className="text-[10px] text-stone-500">{booking.date} ({booking.dayOfWeek}) • {booking.time}</p>
                        <p className="text-[10px] text-stone-400 mt-1">美療師: {booking.therapist}</p>
                      </div>
                    </div>
                  </Link>
                ))}

                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-center">
                  <p className="text-xs text-stone-400">僅顯示即將到來與待審核的預約。<br />歷史預約請至「消費紀錄」查看。</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
