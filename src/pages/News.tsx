import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const NEWS_ARTICLES = [
  {
    id: 1,
    category: "保養知識",
    title: "凝膠美甲後如何維持持久度？5 個日常護理小撇步",
    date: "2026-03-01",
    excerpt: "想要讓美美的指甲維持更久嗎？除了美甲師的技術，日常的保養習慣也是關鍵...",
    img: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=800",
    readTime: "3 min"
  },
  {
    id: 2,
    category: "注意事項",
    title: "美睫嫁接後的 24 小時黃金保養期",
    date: "2026-02-28",
    excerpt: "剛接完睫毛千萬不能碰水！這篇文章告訴您如何正確清潔與梳理您的新睫毛...",
    img: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&q=80&w=800",
    readTime: "5 min"
  },
  {
    id: 3,
    category: "肌膚管理",
    title: "換季肌膚亮紅燈？深層補水療程能幫您解決什麼問題",
    date: "2026-02-25",
    excerpt: "面對乾燥脫皮，一般的面膜可能不夠。了解專業導入技術如何深入肌底...",
    img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
    readTime: "4 min"
  },
  {
    id: 4,
    category: "沙龍公告",
    title: "Fingers Love 三週年慶典：全系列服務 85 折起",
    date: "2026-02-20",
    excerpt: "感謝各位顧客的支持，我們準備了豐富的抽獎活動與專屬優惠，快來預約...",
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800",
    readTime: "2 min"
  }
];

export default function News() {
  const [activeCategory, setActiveCategory] = React.useState('全部');
  const [searchQuery, setSearchQuery] = React.useState('');

  const categories = ['全部', '保養知識', '注意事項', '沙龍公告', '肌膚管理'];

  const filteredArticles = NEWS_ARTICLES.filter(article => {
    const matchesCategory = activeCategory === '全部' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col pb-32">
      {/* Header Section */}
      <header className="px-6 pt-6 pb-4">
        <h1 className="text-3xl font-black text-primary dark:text-slate-100 italic">Latest News</h1>
        <p className="text-logo-green text-sm font-medium mt-1">最新消息與保養知識</p>
      </header>

      {/* Search and Category Tabs */}
      <div className="px-6 mb-6">
        <input 
          type="text"
          placeholder="搜尋消息或保養知識..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-full bg-white dark:bg-slate-800 border border-logo-green/20 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-slate-800 text-logo-green border border-logo-green/20'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <main className="px-6 space-y-6">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article, idx) => (
            <motion.article 
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link to={`/news/${article.id}`} className="group block bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-logo-green/10 shadow-sm hover:shadow-md transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.img} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3 text-[10px] font-bold text-logo-green/60 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">calendar_today</span>
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      {article.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-primary transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="mt-6 flex items-center text-primary text-xs font-black uppercase tracking-widest gap-2">
                    閱讀更多
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))
        ) : (
          <p className="text-center text-slate-500 py-10">找不到相關消息。</p>
        )}
      </main>
    </div>
  );
}
