import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useNotifications } from '../context/NotificationContext';

export default function Login() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('請輸入信箱與密碼');
      return;
    }

    try {
      setLoading(true);

      // 特殊規則：如果密碼是訪客專用強密碼，且信箱不為空
      const GUEST_PASSWORD = 'Gst!Aa9$kP2#vM8x';
      if (password === GUEST_PASSWORD && email.trim() !== '') {
        // 先嘗試登入
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: GUEST_PASSWORD,
        });

        if (signInError) {
          // 如果登入失敗且原因是帳號不存在，則現場幫他建立一個
          if (signInError.message.includes('Invalid login credentials')) {
            const { error: signUpError } = await supabase.auth.signUp({
              email,
              password: GUEST_PASSWORD,
              options: {
                data: {
                  display_name: '訪客',
                  is_guest: true,
                  initial_password: GUEST_PASSWORD
                }
              }
            });
            if (signUpError) throw signUpError;

            // 建立後再次嘗試登入（通常 signUp 會自動建立 session，也可以手動再確認一次）
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email,
              password: GUEST_PASSWORD,
            });
            if (retryError) throw retryError;
          } else {
            throw signInError;
          }
        }

        addNotification({
          title: '訪客模式進入成功',
          desc: `歡迎！您目前以 ${email} 登入，請記住密碼以便下次使用。`,
          time: '剛剛',
          type: 'alert',
          link: '/member'
        });
        navigate('/member');
        return;
      }

      // 一般登入邏輯
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // 友善化常見錯誤訊息
        if (authError.message === 'Invalid login credentials') {
          throw new Error('信箱或密碼錯誤，請確認後再試');
        }
        if (authError.message.includes('Email not confirmed')) {
          throw new Error('請先至信箱收取驗證信，完成驗證後再登入');
        }
        throw authError;
      }

      // 登入成功
      addNotification({
        title: '登入成功',
        desc: '歡迎回來 Fingers love 專業美學沙龍。',
        time: '剛剛',
        type: 'alert',
        link: '/member'
      });

      navigate('/member');
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || '登入失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between p-8 min-h-screen bg-earth-beige">
      <div className="w-full max-w-sm flex flex-col items-center mt-12">
        <div className="flex flex-col items-center mb-16">
          <Link to="/" className="group flex flex-col items-center hover:scale-105 transition-transform">
            <div className="size-24 rounded-full border-2 border-logo-green flex items-center justify-center mb-4 bg-white/30 backdrop-blur-sm group-hover:bg-white/50 transition-colors">
              <div className="text-center">
                <h1 className="text-primary text-2xl font-bold tracking-tighter leading-none font-serif italic">Fingers</h1>
                <h1 className="text-primary text-2xl font-bold tracking-tighter leading-none -mt-1 font-serif italic">love</h1>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-logo-green font-bold tracking-[0.3em] uppercase group-hover:text-primary transition-colors">Professional Salon</span>
            </div>
          </Link>
        </div>

        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm font-medium flex items-start gap-2">
            <span className="material-symbols-outlined shrink-0 text-red-500">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-logo-green">person</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/60 border-none focus:ring-2 focus:ring-primary/30 text-slate-700 placeholder:text-logo-green/60 shadow-inner transition-all outline-none"
                placeholder="信箱"
                type="email"
                required
              />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-logo-green">lock</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/60 border-none focus:ring-2 focus:ring-primary/30 text-slate-700 placeholder:text-logo-green/60 shadow-inner transition-all outline-none"
                placeholder="密碼"
                type={showPassword ? "text" : "password"}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-logo-green hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
          <div className="text-right">
            <Link className="text-sm font-medium text-primary hover:text-primary/80 transition-colors" to="/forgot-password">忘記密碼？</Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="block w-full py-4 bg-primary disabled:bg-primary/50 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-all text-center"
          >
            {loading ? '登入中...' : '登入'}
          </button>

          <div className="flex items-center gap-4 py-4">
            <div className="h-[1px] flex-1 bg-logo-green/20"></div>
            <span className="text-xs text-logo-green font-medium px-2">或是</span>
            <div className="h-[1px] flex-1 bg-logo-green/20"></div>
          </div>

          {/* 訪客登入：三重備援方案
              方案1: Supabase 匿名登入（需後台開啟 Anonymous Sign-ins）
              方案2: 固定訪客帳號，直接 signIn（需在 Supabase 預建帳號）
              方案3: 若帳號不存在，自動 signUp 再 signIn */}
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              // 點擊後：自動填入預設密碼，信箱保留讓使用者自定義（或由使用者手動輸入）
              // 提示使用者輸入一個自定義信箱
              const GUEST_PASSWORD = 'Gst!Aa9$kP2#vM8x';
              setPassword(GUEST_PASSWORD);

              if (!email) {
                setError('請在上方信箱欄位隨便輸入一個名稱（例如：yourname@test.com），然後再次點擊此按鈕即可進入！');
                return;
              }

              // 如果已有信箱，自動觸發 form submit
              const form = document.querySelector('form');
              if (form) form.requestSubmit();
            }}
            className="block w-full py-4 bg-white border-2 border-primary text-primary hover:bg-primary/5 disabled:opacity-50 rounded-2xl font-bold text-lg active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">explore</span>
            訪客快速體驗
          </button>
        </form>
      </div>
      <div className="mt-auto pt-10 pb-4 text-center">
        <p className="text-sm text-logo-green">
          還沒有帳號？
          <Link to="/register" className="text-primary font-bold ml-1">立即註冊</Link>
        </p>
      </div>
    </div >
  );
}
