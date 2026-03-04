export type DiscountType = 'fixed' | 'percentage';

export interface Coupon {
  id: number;
  title: string;
  desc: string;
  discountType: DiscountType;
  discountValue: number; // e.g., 100 for $100 off, 0.2 for 20% off
  expiryDate: string; // ISO string
  claimedBy?: number[]; // Array of user IDs who claimed it
  color?: string; // Tailwind color class or hex
}

export interface UserCoupon {
  id: number;
  couponId: number;
  claimedAt: number;
  used: boolean;
}
