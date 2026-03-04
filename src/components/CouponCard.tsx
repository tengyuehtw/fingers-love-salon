import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coupon } from '../types';
import { useCoupons } from '../context/CouponContext';
import { useNotifications } from '../context/NotificationContext';
import { cn } from '@/src/lib/utils';

interface CouponCardProps {
  coupon: Coupon;
  isClaimed?: boolean;
  mode?: 'claim' | 'use' | 'display';
  displayLabel?: string;
}

const CouponCard: React.FC<CouponCardProps> = ({ 
  coupon, 
  isClaimed = false, 
  mode = 'claim',
  displayLabel 
}) => {
  const navigate = useNavigate();
  const { claimCoupon } = useCoupons();
  const { addNotification } = useNotifications();

  const isExpired = new Date(coupon.expiryDate) < new Date();

  const handleClaim = () => {
    if (isClaimed || isExpired) return;
    claimCoupon(coupon.id);
    addNotification({
      title: '優惠券領取成功',
      desc: `您已成功領取「${coupon.title}」！`,
      time: '剛剛',
      type: 'promo',
      link: '/coupons'
    });
  };

  const handleUse = () => {
    navigate('/booking');
  };

  const getButtonConfig = () => {
    if (isExpired) {
      return { text: '已過期', disabled: true, onClick: undefined };
    }

    switch (mode) {
      case 'use':
        return { 
          text: '立即使用', 
          disabled: false, 
          onClick: handleUse,
          className: "bg-white text-primary hover:bg-stone-100" 
        };
      case 'display':
        return { 
          text: displayLabel || (isClaimed ? '已領取' : '查看'), 
          disabled: true, 
          onClick: undefined,
          className: "bg-white/20 text-white"
        };
      case 'claim':
      default:
        return { 
          text: isClaimed ? '已領取' : '立即領取', 
          disabled: isClaimed, 
          onClick: handleClaim,
          className: isClaimed ? "bg-white/20 text-white" : "bg-white text-stone-800 hover:bg-stone-100"
        };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className={cn(
      "relative rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]",
      (isExpired || mode === 'display') ? "opacity-80 grayscale-[0.5]" : ""
    )}>
      {/* Background Gradient */}
      <div className={cn(
        "absolute inset-0",
        coupon.color || "bg-gradient-to-r from-stone-700 to-stone-800"
      )} />
      
      {/* Decorative Circles for Ticket Look */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-stone-50 dark:bg-stone-900 rounded-full" />
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-stone-50 dark:bg-stone-900 rounded-full" />

      <div className="relative p-5 flex flex-col h-full min-h-[140px] justify-between">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h3 className="text-xl font-black text-white drop-shadow-sm mb-1">{coupon.title}</h3>
            <p className="text-xs text-white/90 font-medium leading-relaxed">{coupon.desc}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center justify-center min-w-[60px]">
            {coupon.discountType === 'fixed' ? (
              <>
                <span className="text-[10px] text-white font-bold">折抵</span>
                <span className="text-xl font-black text-white">${coupon.discountValue}</span>
              </>
            ) : (
              <>
                <span className="text-xl font-black text-white">{Math.round((1 - coupon.discountValue) * 100) / 10}折</span>
                <span className="text-[10px] text-white font-bold">優惠</span>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/70 uppercase tracking-wider font-bold">有效期限</span>
            <span className="text-xs font-bold text-white font-mono tracking-wide">
              {new Date(coupon.expiryDate).toLocaleDateString()}
            </span>
          </div>

          <button
            onClick={buttonConfig.onClick}
            disabled={buttonConfig.disabled}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all",
              buttonConfig.className || "bg-white text-stone-800 hover:bg-stone-100 active:scale-95",
              buttonConfig.disabled && "cursor-default active:scale-100"
            )}
          >
            {buttonConfig.text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
