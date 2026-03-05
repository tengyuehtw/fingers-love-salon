import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useUser } from '../context/UserContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    addNotification
  } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSiteSettings();
  const { user } = useUser();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const hasUnread = unreadCount > 0;

  useEffect(() => {
    // 暫時取消進入時的自動推播
    /*
    const timer = setTimeout(() => {
      setShowNotification(true);
      const exists = notifications.some(n => n.title === '最新保養知識' && n.desc.includes('凝膠美甲後如何維持持久度'));
      if (!exists) {
        addNotification({
          title: '最新保養知識',
          desc: '凝膠美甲後如何維持持久度？快來看看 5 個護理小撇步！',
          time: '剛剛',
          type: 'tip',
          link: '/news/1'
        });
      }
    }, 3000);
    return () => clearTimeout(timer);
    */
  }, []);

  const handleOpenNotifications = () => {
    setIsNotificationOpen(true);
  };

  const hideNavPaths = ['/login', '/register'];
  const shouldHideNav = hideNavPaths.includes(location.pathname);

  const menuItems = [
    { label: '首頁', path: '/', icon: 'home' },
    { label: '最新消息', path: '/news', icon: 'news' },
    { label: '服務項目', path: '/services', icon: 'auto_awesome' },
    { label: '專業團隊', path: '/team', icon: 'group' },
    { label: '作品集', path: '/portfolio', icon: 'collections' },
    { label: '預約服務', path: '/booking', icon: 'calendar_month' },
    { label: '優惠活動', path: '/coupons', icon: 'local_offer' },
    { label: '聯絡我們', path: '/contact', icon: 'support_agent' },
    { label: '個人檔案', path: user ? '/member' : '/login', icon: 'account_circle' },
    { label: '登入頁面', path: '/login', icon: 'login' },
    { label: '註冊申請', path: '/register', icon: 'how_to_reg' },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col max-w-[430px] mx-auto bg-background-light dark:bg-background-dark shadow-2xl relative overflow-x-hidden">
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm max-w-[430px] mx-auto"
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[110] w-3/4 bg-[#2D241E] shadow-2xl p-5 flex flex-col max-w-[322px]"
            >
              <div className="flex items-center justify-between mb-6 shrink-0">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex flex-col hover:opacity-80 transition-opacity">
                  <h2 className="text-primary text-2xl font-bold font-serif uppercase tracking-wider">Fingers love</h2>
                  <span className="text-[10px] text-logo-green font-bold tracking-widest uppercase tracking-[0.2em]">Professional Salon</span>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-primary size-10 flex items-center justify-center rounded-full hover:bg-white/5"
                >
                  <span className="material-symbols-outlined text-3xl">close</span>
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-2xl transition-all shrink-0",
                      location.pathname === item.path
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "text-logo-green hover:bg-white/5 hover:text-primary"
                    )}
                  >
                    <span className={cn("material-symbols-outlined", location.pathname === item.path && "fill-1")}>
                      {item.icon}
                    </span>
                    <span className="font-bold tracking-wide">{item.label}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-white/5 shrink-0">
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-white/5 text-primary hover:bg-white/10 transition-colors"
                >
                  <span className="material-symbols-outlined">{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
                  <span className="font-bold tracking-wide">{theme === 'light' ? '切換暗色模式' : '切換亮色模式'}</span>
                </button>
                <p className="text-[10px] text-logo-green font-bold tracking-widest text-center uppercase mt-6">
                  Professional Salon & Spa
                </p>

                {/* Development Team Info & Footer Text from Supabase */}
                <div className="mt-8 flex flex-col items-center gap-3 text-center">
                  <div className="flex gap-4 mb-2">
                    {settings?.facebook_link && (
                      <a href={settings.facebook_link} target="_blank" rel="noreferrer" className="text-stone-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">public</span>
                      </a>
                    )}
                    {settings?.instagram_link && (
                      <a href={settings.instagram_link} target="_blank" rel="noreferrer" className="text-stone-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">photo_camera</span>
                      </a>
                    )}
                    {settings?.line_link && (
                      <a href={settings.line_link} target="_blank" rel="noreferrer" className="text-stone-500 hover:text-[#00C300] transition-colors">
                        <span className="material-symbols-outlined text-lg">chat</span>
                      </a>
                    )}
                  </div>
                  <p className="text-[9px] text-stone-500/60 font-medium">
                    {settings?.footer_text || 'WASP MarTec Co.,Ltd ＠版權宣告2026'}
                  </p>
                  <p className="text-[9px] text-stone-500/60 font-medium">
                    <a href="#" className="hover:text-primary transition-colors">蜂電科技</a>
                    <span className="mx-1">＆</span>
                    <a href="#" className="hover:text-primary transition-colors">騰鉞企業</a>
                    <span className="ml-1">共同開發</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notification Panel */}
      <AnimatePresence>
        {isNotificationOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotificationOpen(false)}
              className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-[2px] max-w-[430px] mx-auto"
            />
            <motion.div
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              className="fixed top-16 right-4 left-4 z-[110] bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-100 dark:border-stone-800 overflow-hidden max-w-[398px]"
            >
              <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/50">
                <div className="flex flex-col">
                  <h3 className="font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">notifications</span>
                    通知中心
                  </h3>
                  <p className="text-[10px] text-stone-400 font-medium ml-7">您有 {unreadCount} 則新通知</p>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      全部標為已讀
                    </button>
                  )}
                  <button onClick={() => setIsNotificationOpen(false)} className="text-stone-400 hover:text-stone-600 size-8 flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800">
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>
              </div>
              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-stone-100 dark:divide-stone-800">
                    {notifications.map((n) => (
                      <div key={n.id} className="relative group">
                        <Link
                          to={n.link}
                          onClick={() => {
                            markAsRead(n.id);
                            setIsNotificationOpen(false);
                          }}
                          className={cn(
                            "flex gap-4 p-5 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors relative",
                            n.unread && "bg-primary/5"
                          )}
                        >
                          {n.unread && (
                            <div className="absolute top-5 right-5 size-2 bg-primary rounded-full"></div>
                          )}
                          <div className={cn(
                            "size-10 rounded-full flex items-center justify-center shrink-0",
                            n.type === 'tip' ? "bg-blue-50 text-blue-500" :
                              n.type === 'alert' ? "bg-amber-50 text-amber-500" : "bg-primary/10 text-primary"
                          )}>
                            <span className="material-symbols-outlined">
                              {n.type === 'tip' ? 'lightbulb' : n.type === 'alert' ? 'event' : 'campaign'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-sm font-bold text-stone-800 dark:text-stone-100">{n.title}</p>
                              <span className="text-[10px] text-stone-400 font-medium">{n.time}</span>
                            </div>
                            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">{n.desc}</p>
                          </div>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteNotification(n.id);
                          }}
                          className="absolute right-4 bottom-4 size-8 flex items-center justify-center rounded-full bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 text-stone-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all shadow-sm z-10"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <span className="material-symbols-outlined text-stone-200 text-6xl mb-4">notifications_off</span>
                    <p className="text-stone-400 text-sm">目前沒有新通知</p>
                  </div>
                )}
              </div>
              <div className="p-4 bg-stone-50 dark:bg-stone-800/50 flex items-center justify-between">
                <Link to="/news" onClick={() => setIsNotificationOpen(false)} className="text-xs font-bold text-primary hover:underline">查看所有消息</Link>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-[10px] font-bold text-stone-400 hover:text-red-500 transition-colors"
                  >
                    清除所有通知
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!shouldHideNav && (
        <header className="sticky top-0 z-50 flex items-center bg-[#2D241E] dark:bg-background-dark/95 backdrop-blur-md p-4 justify-between border-b border-white/5">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
          <Link to="/" className="flex flex-col items-center hover:opacity-80 transition-opacity">
            <h1 className="text-primary text-xl font-bold tracking-widest uppercase font-serif">Fingers love</h1>
            <span className="text-[10px] text-logo-green font-bold tracking-[0.2em] -mt-1">PROFESSIONAL SALON</span>
          </Link>
          <div className="flex w-20 items-center justify-end gap-2">
            <button
              onClick={handleOpenNotifications}
              className="text-primary relative flex size-10 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">notifications</span>
              {hasUnread && (
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-[#2D241E]"></span>
              )}
            </button>
            <Link to="/booking" className="text-primary flex size-10 items-center justify-center rounded-full hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined text-3xl">calendar_month</span>
            </Link>
          </div>
        </header>
      )}

      <main className={cn("flex-1", !shouldHideNav && "pb-24")}>
        {children}
      </main>

      {/* Push Notification Toast - 暫時隱藏 */}
      {/* 
      <AnimatePresence>
        {showNotification && (
          ... (代碼內容略過以保持整潔)
        )}
      </AnimatePresence>
      */}

      {!shouldHideNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[#2D241E] dark:bg-background-dark/95 backdrop-blur-md px-4 pb-6 pt-2 max-w-[430px] mx-auto">
          <div className="flex gap-2">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={cn("flex flex-1 flex-col items-center justify-end gap-1", location.pathname === '/' ? "text-primary" : "text-logo-green/60")}
            >
              <div className="flex h-8 items-center justify-center">
                <span className={cn("material-symbols-outlined", location.pathname === '/' && "fill-1")}>home</span>
              </div>
              <p className="text-[10px] font-bold leading-normal tracking-wide">首頁</p>
            </Link>
            <Link
              to="/services"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={cn("flex flex-1 flex-col items-center justify-end gap-1", location.pathname === '/services' ? "text-primary" : "text-logo-green/60")}
            >
              <div className="flex h-8 items-center justify-center">
                <span className={cn("material-symbols-outlined", location.pathname === '/services' && "fill-1")}>auto_awesome</span>
              </div>
              <p className="text-[10px] font-medium leading-normal tracking-wide">服務項目</p>
            </Link>
            <Link
              to="/portfolio"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={cn("flex flex-1 flex-col items-center justify-end gap-1", location.pathname === '/portfolio' ? "text-primary" : "text-logo-green/60")}
            >
              <div className="flex h-8 items-center justify-center">
                <span className={cn("material-symbols-outlined", location.pathname === '/portfolio' && "fill-1")}>collections</span>
              </div>
              <p className="text-[10px] font-medium leading-normal tracking-wide">作品集</p>
            </Link>
            <Link
              to={user ? '/member' : '/login'}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={cn("flex flex-1 flex-col items-center justify-end gap-1", location.pathname === '/member' ? "text-primary" : "text-logo-green/60")}
            >
              <div className="flex h-8 items-center justify-center">
                <span className={cn("material-symbols-outlined", location.pathname === '/member' && "fill-1")}>account_circle</span>
              </div>
              <p className="text-[10px] font-medium leading-normal tracking-wide">個人檔案</p>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
