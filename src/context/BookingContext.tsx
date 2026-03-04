import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Booking {
  id: number | string;
  date: string;
  month: string;
  day: string;
  time: string;
  service: string;
  therapist: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  dayOfWeek: string;
  price?: number;
  details?: string;
  originalPrice?: number;
  discountAmount?: number;
  couponName?: string;
  finalPrice?: number;
}

interface BookingContextType {
  bookings: Booking[];
  history: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status'>) => void;
  updateBookingStatus: (id: number | string, status: Booking['status']) => void;
  moveToHistory: (id: number | string, paymentDetails: { originalPrice: number, discountAmount: number, couponName?: string, finalPrice: number }) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 1,
    date: '2024-03-18',
    month: '3月',
    day: '18',
    time: '11:00 AM',
    service: '經典凝膠美甲 (客製設計)',
    therapist: '安娜 (Anna)',
    status: 'pending',
    dayOfWeek: '週三',
    price: 1200,
    details: '包含基礎保養、指甲修型、客製化手繪設計。'
  },
  {
    id: 2,
    date: '2024-04-20',
    month: '4月',
    day: '20',
    time: '14:30 PM',
    service: '足部單色凝膠',
    therapist: '蘇菲亞',
    status: 'confirmed',
    dayOfWeek: '週六',
    price: 1500,
    details: '足部基礎清潔、單色凝膠上色、指緣保養。'
  }
];

const INITIAL_HISTORY: Booking[] = [
  {
    id: 101,
    date: '2024-02-28',
    month: '2月',
    day: '28',
    time: '10:00 AM',
    dayOfWeek: '週三',
    service: '經典凝膠美甲 (客製設計)',
    price: 1800,
    therapist: '安娜 (Anna)',
    status: 'completed',
    details: '包含基礎保養、指甲修型、客製化手繪設計。使用日本進口凝膠。',
    originalPrice: 1800,
    finalPrice: 1800,
    discountAmount: 0
  },
  {
    id: 102,
    date: '2024-01-15',
    month: '1月',
    day: '15',
    time: '14:00 PM',
    dayOfWeek: '週一',
    service: '深層手部護理',
    price: 1200,
    therapist: '蘇菲亞',
    status: 'completed',
    details: '去角質、保濕膜、指緣油按摩、基礎修型。',
    originalPrice: 1200,
    finalPrice: 1200,
    discountAmount: 0
  },
  {
    id: 103,
    date: '2023-12-20',
    month: '12月',
    day: '20',
    time: '16:00 PM',
    dayOfWeek: '週三',
    service: '足部單色凝膠',
    price: 1500,
    therapist: '安娜 (Anna)',
    status: 'completed',
    details: '足部基礎清潔、單色凝膠上色、指緣保養。',
    originalPrice: 1500,
    finalPrice: 1500,
    discountAmount: 0
  }
];

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [history, setHistory] = useState<Booking[]>(INITIAL_HISTORY);

  const addBooking = (newBookingData: Omit<Booking, 'id' | 'status'>) => {
    const newBooking: Booking = {
      ...newBookingData,
      id: Date.now(), // Simple ID generation
      status: 'pending', // Default status
      price: newBookingData.price || 1200, // Default price if not provided
      details: newBookingData.details || '一般服務項目'
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  const updateBookingStatus = (id: number | string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const moveToHistory = (id: number | string, paymentDetails: { originalPrice: number, discountAmount: number, couponName?: string, finalPrice: number }) => {
    const bookingToMove = bookings.find(b => b.id === id);
    if (bookingToMove) {
      const completedBooking: Booking = {
        ...bookingToMove,
        status: 'completed',
        price: paymentDetails.finalPrice, // Keep for backward compatibility if needed, but prefer finalPrice
        details: bookingToMove.details,
        originalPrice: paymentDetails.originalPrice,
        discountAmount: paymentDetails.discountAmount,
        couponName: paymentDetails.couponName,
        finalPrice: paymentDetails.finalPrice
      };
      setHistory(prev => [completedBooking, ...prev]);
      setBookings(prev => prev.filter(b => b.id !== id));
    }
  };

  return (
    <BookingContext.Provider value={{ bookings, history, addBooking, updateBookingStatus, moveToHistory }}>
      {children}
    </BookingContext.Provider>
  );
};
