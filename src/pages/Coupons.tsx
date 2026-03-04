import React, { useState } from 'react';
import { useCoupons } from '../context/CouponContext';
import CouponCard from '../components/CouponCard';
import { cn } from '@/src/lib/utils';

type TabType = 'discover' | 'wallet' | 'history';

export default function Coupons() {
  const { availableCoupons, userCoupons } = useCoupons();
  const [activeTab, setActiveTab] = useState<TabType>('discover');

  // Helper to check if a coupon is expired
  const isExpired = (expiryDate: string) => new Date(expiryDate) < new Date();

  // 1. Discover: Unclaimed and Valid
  const discoverList = availableCoupons.filter(coupon => {
    const claimed = userCoupons.some(uc => uc.couponId === coupon.id);
    return !claimed && !isExpired(coupon.expiryDate);
  });

  // 2. Wallet: Claimed and Valid (Not Used)
  const walletList = userCoupons
    .filter(uc => !uc.used)
    .map(uc => {
      const coupon = availableCoupons.find(c => c.id === uc.couponId);
      return coupon && !isExpired(coupon.expiryDate) ? { ...coupon, userCouponId: uc.id } : null;
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  // 3. History: Used OR Expired
  const historyList = userCoupons
    .map(uc => {
      const coupon = availableCoupons.find(c => c.id === uc.couponId);
      if (!coupon) return null;
      const expired = isExpired(coupon.expiryDate);
      if (uc.used || expired) {
        return { ...coupon, userCouponId: uc.id, isUsed: uc.used, isExpired: expired };
      }
      return null;
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <div className="p-6 min-h-screen bg-stone-50 dark:bg-stone-900 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-2xl">local_activity</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">優惠活動</h1>
          <p className="text-xs text-stone-500">領取專屬優惠，享受頂級服務</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-stone-200/50 rounded-xl mb-6">
        {[
          { id: 'discover', label: '領取專區' },
          { id: 'wallet', label: '我的票夾' },
          { id: 'history', label: '歷史紀錄' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all",
              activeTab === tab.id 
                ? "bg-white text-primary shadow-sm" 
                : "text-stone-500 hover:text-stone-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeTab === 'discover' && (
          discoverList.length > 0 ? (
            discoverList.map(coupon => (
              <CouponCard 
                key={coupon.id} 
                coupon={coupon} 
                isClaimed={false}
                mode="claim"
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-stone-400">
              <span className="material-symbols-outlined text-4xl mb-2">sentiment_satisfied</span>
              <p className="text-sm">目前沒有可領取的優惠券</p>
            </div>
          )
        )}

        {activeTab === 'wallet' && (
          walletList.length > 0 ? (
            walletList.map(coupon => (
              <CouponCard 
                key={coupon.id} 
                coupon={coupon} 
                isClaimed={true}
                mode="use"
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-stone-400">
              <span className="material-symbols-outlined text-4xl mb-2">confirmation_number</span>
              <p className="text-sm">您的票夾是空的</p>
              <button 
                onClick={() => setActiveTab('discover')}
                className="mt-4 text-primary font-bold text-sm hover:underline"
              >
                前往領取優惠
              </button>
            </div>
          )
        )}

        {activeTab === 'history' && (
          historyList.length > 0 ? (
            historyList.map((coupon, idx) => (
              <CouponCard 
                key={`${coupon.id}-${idx}`} 
                coupon={coupon} 
                isClaimed={true}
                mode="display"
                displayLabel={coupon.isUsed ? '已使用' : '已過期'}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-stone-400">
              <span className="material-symbols-outlined text-4xl mb-2">history</span>
              <p className="text-sm">尚無歷史紀錄</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
