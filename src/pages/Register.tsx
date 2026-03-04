import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useNotifications } from '../context/NotificationContext';

export default function Register() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('兩次輸入的密碼不一致');
      return;
    }

    try {
      setLoading(true);
      // 1. 使用 Supabase Auth 註冊信箱與密碼
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            display_name: formData.name, // 這會自動被我們剛才寫的 SQL trigger 裝進 profiles 表裡
          }
        }
      });

      if (authError) throw authError;

      // 2. 因為我們的 trigger 已經自動幫忙建好 profile 了，
      // 但我們也可以額外更新 phone 等等欄位 (如果註冊成功且拿到 user)
      if (data.user) {
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({ phone: formData.phone })
          .eq('id', data.user.id);

        if (profileUpdateError) {
          console.warn('Profile phone update failed:', profileUpdateError);
        }
      }

      // 成功通知
      addNotification({
        title: '註冊成功',
        desc: '歡迎加入 Fingers love！請確認您的信箱以啟用帳號。',
        time: '剛剛',
        type: 'alert',
        link: '/login'
      });

      // 導回登入頁面
      navigate('/login');

    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message || '註冊失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-earth-beige">
      <header className="sticky top-0 z-50 flex items-center bg-earth-beige/95 backdrop-blur-md p-4 justify-between border-b border-logo-green/20">
        <Link to="/login" className="text-primary flex size-10 items-center justify-center">
          <span className="material-symbols-outlined text-3xl">chevron_left</span>
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="text-primary text-xl font-bold tracking-widest uppercase font-serif italic">Fingers love</h1>
          <span className="text-[10px] text-logo-green font-bold tracking-[0.2em] -mt-1">USER REGISTRATION</span>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 px-6 py-10 max-w-lg mx-auto w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/50 border-2 border-logo-green/20 mb-4">
            <span className="material-symbols-outlined text-primary text-4xl">person_add</span>
          </div>
          <h2 className="text-2xl font-bold text-primary tracking-tight">建立新帳號</h2>
          <p className="text-logo-green text-sm mt-2">歡迎加入 Fingers love 專業美學沙龍</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm font-medium flex items-start gap-2">
            <span className="material-symbols-outlined shrink-0 text-red-500">error</span>
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleRegister}>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-logo-green ml-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">person</span>
              姓名
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white/60 border border-logo-green/30 rounded-xl px-4 py-4 text-base transition-all focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="您的完整姓名"
              required
              type="text"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-logo-green ml-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">phone_iphone</span>
              手機號碼
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-white/60 border border-logo-green/30 rounded-xl px-4 py-4 text-base transition-all focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="0900-000-000"
              required
              type="tel"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-logo-green ml-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">mail</span>
              信箱
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/60 border border-logo-green/30 rounded-xl px-4 py-4 text-base transition-all focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="example@email.com"
              required
              type="email"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-logo-green ml-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">lock</span>
              密碼
            </label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/60 border border-logo-green/30 rounded-xl px-4 py-4 text-base transition-all focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="請輸入至少 6 位數密碼"
              required
              type="password"
              minLength={6}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-logo-green ml-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">lock_reset</span>
              確認密碼
            </label>
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-white/60 border border-logo-green/30 rounded-xl px-4 py-4 text-base transition-all focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="請再次輸入密碼"
              required
              type="password"
              minLength={6}
            />
          </div>

          <div className="bg-white/40 border border-primary/20 rounded-xl p-4 flex gap-3 mt-8">
            <span className="material-symbols-outlined text-primary shrink-0">info</span>
            <p className="text-sm text-primary/80 leading-relaxed font-medium">
              註冊後需經確認信件方可啟用服務。
            </p>
          </div>

          <button
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
            type="submit"
          >
            {loading ? '處理中...' : '提交註冊'}
            {!loading && <span className="material-symbols-outlined">how_to_reg</span>}
          </button>
        </form>

        <p className="text-center text-xs text-logo-green mt-10">
          點擊提交即代表您同意本沙龍的<br />
          <a className="underline underline-offset-4 decoration-primary/40 text-primary" href="#">服務條款</a> 與 <a className="underline underline-offset-4 decoration-primary/40 text-primary" href="#">隱私權政策</a>
        </p>
      </main>
    </div>
  );
}
