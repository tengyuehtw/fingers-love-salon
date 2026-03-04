import React, { createContext, useContext, useState, useEffect } from 'react';
import { Coupon, UserCoupon } from '../types';

interface CouponContextType {
  availableCoupons: Coupon[];
  userCoupons: UserCoupon[];
  claimCoupon: (couponId: number) => void;
  useCoupon: (userCouponId: number) => void;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>(() => {
    // Changed key to v2 to force refresh with new colorful coupons
    const saved = localStorage.getItem('fingers_love_available_coupons_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse available coupons', e);
      }
    }
    return [
      { id: 1, title: '新客見面禮', desc: '首次預約現折 $200', discountType: 'fixed', discountValue: 200, expiryDate: '2026-12-31T23:59:59Z', color: 'bg-gradient-to-r from-pink-500 to-rose-500' },
      { id: 2, title: '美睫 8 折券', desc: '美睫服務享 8 折優惠', discountType: 'percentage', discountValue: 0.2, expiryDate: '2026-06-30T23:59:59Z', color: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
      { id: 3, title: '凝膠美甲折抵', desc: '任選凝膠款式折抵 $150', discountType: 'fixed', discountValue: 150, expiryDate: '2026-08-31T23:59:59Z', color: 'bg-gradient-to-r from-blue-400 to-cyan-500' },
      { id: 4, title: '壽星獨享 5 折', desc: '當月壽星任一服務 5 折', discountType: 'percentage', discountValue: 0.5, expiryDate: '2026-12-31T23:59:59Z', color: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
      { id: 5, title: '好友推薦禮', desc: '推薦好友成功折抵 $300', discountType: 'fixed', discountValue: 300, expiryDate: '2026-12-31T23:59:59Z', color: 'bg-gradient-to-r from-emerald-400 to-teal-500' },
      { id: 6, title: '夏日清爽優惠', desc: '除毛服務 9 折優惠', discountType: 'percentage', discountValue: 0.1, expiryDate: '2026-09-30T23:59:59Z', color: 'bg-gradient-to-r from-orange-400 to-red-500' },
      { id: 7, title: 'VIP 尊榮升級', desc: '升級頂級保養折抵 $500', discountType: 'fixed', discountValue: 500, expiryDate: '2026-12-31T23:59:59Z', color: 'bg-gradient-to-r from-slate-700 to-slate-900' },
      { id: 8, title: '學生專屬優惠', desc: '憑學生證享 85 折', discountType: 'percentage', discountValue: 0.15, expiryDate: '2026-12-31T23:59:59Z', color: 'bg-gradient-to-r from-teal-400 to-green-500' },
      { id: 9, title: '早鳥預約優惠', desc: '提前兩週預約折抵 $100', discountType: 'fixed', discountValue: 100, expiryDate: '2026-12-31T23:59:59Z', color: 'bg-gradient-to-r from-sky-400 to-blue-500' },
      { id: 10, title: '晚鳥限時折扣', desc: '當日預約空檔折抵 $50', discountType: 'fixed', discountValue: 50, expiryDate: '2026-12-31T23:59:59Z', color: 'bg-gradient-to-r from-red-500 to-pink-600' },
    ];
  });

  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>(() => {
    const saved = localStorage.getItem('fingers_love_user_coupons_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user coupons', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('fingers_love_available_coupons_v2', JSON.stringify(availableCoupons));
  }, [availableCoupons]);

  useEffect(() => {
    localStorage.setItem('fingers_love_user_coupons_v2', JSON.stringify(userCoupons));
  }, [userCoupons]);

  const claimCoupon = (couponId: number) => {
    const coupon = availableCoupons.find(c => c.id === couponId);
    if (!coupon) return;
    
    // Check if already claimed
    if (userCoupons.some(uc => uc.couponId === couponId)) return;

    const newUserCoupon: UserCoupon = {
      id: Date.now(),
      couponId,
      claimedAt: Date.now(),
      used: false,
    };
    setUserCoupons(prev => [...prev, newUserCoupon]);
  };

  const useCoupon = (userCouponId: number) => {
    setUserCoupons(prev => prev.map(uc => uc.id === userCouponId ? { ...uc, used: true } : uc));
  };

  return (
    <CouponContext.Provider value={{
      availableCoupons,
      userCoupons,
      claimCoupon,
      useCoupon
    }}>
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupons = () => {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error('useCoupons must be used within a CouponProvider');
  }
  return context;
};
