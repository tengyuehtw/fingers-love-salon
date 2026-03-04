import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useNotifications } from '../context/NotificationContext';

export default function ForgotPassword() {
    const { addNotification } = useNotifications();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email) {
            setError('請輸入註冊信箱');
            return;
        }

        try {
            setLoading(true);
            // Supabase send password reset email
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (error) throw error;

            setSuccess(true);
            addNotification({
                title: '重設信件已發送',
                desc: '請前往您的信箱收信，並點擊信中的重設連結。',
                time: '剛剛',
                type: 'alert',
                link: '/login'
            });

        } catch (err: any) {
            console.error('Reset password failed:', err);
            if (err.message && err.message.toLowerCase().includes('rate limit')) {
                setError('Supabase 測試防護機制：寄信頻率過高 (每小時約 3 封)。請稍等一小時後再試。');
            } else {
                setError(err.message || '發送失敗，請確認信箱是否正確');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-between p-8 min-h-screen bg-earth-beige">
            <div className="w-full max-w-sm flex flex-col items-center mt-12">
                <div className="flex flex-col items-center mb-16">
                    <div className="size-24 rounded-full border-2 border-logo-green flex items-center justify-center mb-4 bg-white/30 backdrop-blur-sm">
                        <div className="text-center">
                            <h1 className="text-primary text-2xl font-bold tracking-tighter leading-none font-serif italic">Fingers</h1>
                            <h1 className="text-primary text-2xl font-bold tracking-tighter leading-none -mt-1 font-serif italic">love</h1>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-logo-green font-bold tracking-[0.3em] uppercase">Professional Salon</span>
                    </div>
                </div>

                <div className="w-full mb-8 text-center">
                    <h2 className="text-2xl font-bold text-primary tracking-tight">重設密碼</h2>
                    <p className="text-sm text-logo-green mt-2">請輸入您的註冊信箱，我們將寄信協助您重設密碼。</p>
                </div>

                {error && (
                    <div className="w-full bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm font-medium flex items-start gap-2">
                        <span className="material-symbols-outlined shrink-0 text-red-500">error</span>
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="w-full bg-green-50 border border-green-200 text-green-700 rounded-xl p-6 mb-6 text-center space-y-4 shadow-sm">
                        <span className="material-symbols-outlined text-4xl text-green-500">mark_email_read</span>
                        <div>
                            <h3 className="font-bold text-lg mb-1">信件已送出</h3>
                            <p className="text-sm opacity-80">請檢查您的信箱匣。若未收到，請查看垃圾信件匣。</p>
                        </div>
                        <Link to="/login" className="inline-block mt-4 px-6 py-2 bg-white border border-green-200 rounded-lg text-sm font-bold text-green-700 hover:bg-green-100 transition-colors">
                            返回登入
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="w-full space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-logo-green">mail</span>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/60 border-none focus:ring-2 focus:ring-primary/30 text-slate-700 placeholder:text-logo-green/60 shadow-inner transition-all outline-none"
                                    placeholder="請輸入註冊信箱"
                                    type="email"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="block w-full py-4 bg-primary disabled:bg-primary/50 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-all text-center"
                        >
                            {loading ? '發送中...' : '發送重設信件'}
                        </button>
                    </form>
                )}
            </div>

            {!success && (
                <div className="mt-auto pt-10 pb-4 text-center">
                    <Link to="/login" className="flex items-center justify-center gap-1 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        返回登入頁面
                    </Link>
                </div>
            )}
        </div>
    );
}
