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
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

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
      // 提供更友善的錯誤訊息
      if (err.message === 'Invalid login credentials') {
        setError('信箱或密碼錯誤');
      } else {
        setError(err.message || '登入失敗，請稍後再試');
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
            <span className="text-xs text-logo-green font-medium">快速登入</span>
            <div className="h-[1px] flex-1 bg-logo-green/20"></div>
          </div>

          <div className="flex justify-center gap-6">
            {[
              { alt: "FB", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9fokXumftRkK0Eq5yUoX7t1x17opZyOYiWzSyyemvTveH6extOp091ggwGqn843OYgtI5P9SVJIy71ltrEjlgJo3GaVewKAHO2Orq2ithd4BRh5mvYZ-Yosk7DcGYY7FVx2mPPfJr8hU5wE7uAYlo7KfArP_fZIM93y8EmyC4OloiEznL4hPlOvKM6s33ywn-a5IVuGCZIPGbUNXHi5wKMYhet7OajWU-xUsz-_V5uvcHbyh-xmXJYkSTRfqOrffnozlGnXkO2Ho" },
              { alt: "Google", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwEPUQHcrdfI1Aw15JyF61OlO8i_FXlgFd_HDkggw_R-nALDpEltQSwu-MLTakENLnVmBSzZtw-P4xpLEN7PjFsvxThkD_tQiYfxyp42X7eoS5YZvLMY9zPqxR-pWVrsXk7g3bc9AkLyyQerWcUeED5b1rnPpiY-px0Hk5_J9VWlxvSiWDYps6EAfC4PBD0Eh6F_CjvwVZQWpvMeAZKlNFBX1HR3CpllnxfKnpIjl0dbWCawDHwyFGGnCy8LdzEjaayLyFwMbq2ok" },
              { alt: "Apple", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtGyYnyk2yIsC8e9086DKAlpqe518bgy4aeEBCiqdudy5UWZ9cjyQjZ3wEz_aO2kj0W8J2_wDJ2MnRJ_wm8XeUjmBUfVdM5G7UsC9_M31sEN-VDO5l_Ha2PHyRdC1yHQWhkzf-dCXoHBLOevVJlXSwMeKoqDrz3g542jX8ZH22wVkhJqvvDb8gN0wySlPjY49dIn08dgV5BUQsJhLZhbuNljKq9ZoeAZ8jq7N2RByWl6uySENXh6V5o4QRKrvIEChKy1WtRI4CLLw" }
            ].map((social, idx) => (
              <button key={idx} className="size-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-logo-green/10">
                <img alt={social.alt} className="size-6 object-contain" src={social.img} referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
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
