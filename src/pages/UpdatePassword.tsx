import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useNotifications } from '../context/NotificationContext';

export default function UpdatePassword() {
    const navigate = useNavigate();
    const { addNotification } = useNotifications();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 當使用者點擊電子郵件中的連結被導回這個頁面時，
    // Supabase 通常會自動處理 token (hash 中的 access_token) 並登入該使用者 (建立 Session)
    // 如果成功拿到 Session，代表擁有更新密碼的權限

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // 基礎驗證
        if (password !== confirmPassword) {
            setError('兩次輸入的密碼不一致');
            return;
        }

        if (password.length < 6) {
            setError('密碼長度必須大於 6 位數');
            return;
        }

        try {
            setLoading(true);
            // Supabase 更新當前已驗證使用者的密碼
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) throw updateError;

            // 更新成功通知
            addNotification({
                title: '密碼重設成功',
                desc: '您的密碼已成功更新，請使用新密碼登入。',
                time: '剛剛',
                type: 'alert',
                link: '/login'
            });

            navigate('/login');

        } catch (err: any) {
            console.error('Update password failed:', err);
            setError(err.message || '密碼更新失敗，重設連結可能已經失效。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-between p-8 min-h-screen bg-earth-beige">
            <div className="w-full max-w-sm flex flex-col items-center mt-24">

                <div className="w-full mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/50 border-2 border-logo-green/20 mb-4">
                        <span className="material-symbols-outlined text-primary text-4xl">vpn_key</span>
                    </div>
                    <h2 className="text-2xl font-bold text-primary tracking-tight">設定新密碼</h2>
                    <p className="text-sm text-logo-green mt-2">驗證成功，請重新設定您的登入密碼。</p>
                </div>

                {error && (
                    <div className="w-full bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm font-medium flex items-start gap-2">
                        <span className="material-symbols-outlined shrink-0 text-red-500">error</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="w-full space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-logo-green">lock</span>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/60 border-none focus:ring-2 focus:ring-primary/30 text-slate-700 placeholder:text-logo-green/60 shadow-inner transition-all outline-none"
                                placeholder="請輸入新密碼 (至少 6 位)"
                                type="password"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-logo-green">lock_reset</span>
                            <input
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/60 border-none focus:ring-2 focus:ring-primary/30 text-slate-700 placeholder:text-logo-green/60 shadow-inner transition-all outline-none"
                                placeholder="請再次輸入新密碼"
                                type="password"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="block w-full py-4 bg-primary disabled:bg-primary/50 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-all text-center"
                    >
                        {loading ? '更新中...' : '確認更新密碼'}
                    </button>
                </form>
            </div>
        </div>
    );
}
