import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';

const NEWS_ARTICLES: Record<string, { category: string, title: string, date: string, img: string, content: string }> = {
  "1": {
    category: "保養知識",
    title: "凝膠美甲後如何維持持久度？5 個日常護理小撇步",
    date: "2026-03-01",
    img: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=1200",
    content: `
      <p>想要讓美美的指甲維持更久嗎？除了美甲師的技術，日常的保養習慣也是關鍵。以下是我們專業美甲師整理的 5 個護理小撇步：</p>
      <h3>1. 避免長時間浸泡熱水</h3>
      <p>熱水會使指甲稍微膨脹，進而導致凝膠與真甲之間產生縫隙。建議洗澡時間不要過長，洗碗時也請配戴手套。</p>
      <h3>2. 不要用指甲當工具</h3>
      <p>開罐罐、摳標籤或是用指甲敲擊鍵盤，這些動作都會造成指甲前端的壓力，容易導致凝膠剝落或斷裂。</p>
      <h3>3. 養成擦指緣油的習慣</h3>
      <p>指緣乾燥會導致真甲捲曲，進而推擠凝膠。每天早晚擦拭指緣油，能保持甲床健康，讓凝膠更服貼。</p>
      <h3>4. 避免接觸強效化學品</h3>
      <p>清潔劑、去光水或某些強效護膚品可能會侵蝕凝膠表面。進行家事時務必保護雙手。</p>
      <h3>5. 定期回店卸除或更換</h3>
      <p>凝膠美甲建議維持 3-4 週。過長的凝膠會改變重心，增加真甲斷裂的風險。</p>
    `
  },
  "2": {
    category: "注意事項",
    title: "美睫嫁接後的 24 小時黃金保養期",
    date: "2026-02-28",
    img: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&q=80&w=1200",
    content: `
      <p>剛接完睫毛千萬不能碰水！這篇文章告訴您如何正確清潔與梳理您的新睫毛：</p>
      <h3>1. 保持乾燥</h3>
      <p>嫁接後的 6-8 小時內，黑膠尚未完全乾燥，請避免洗臉、淋雨或進入蒸氣室。</p>
      <h3>2. 避免油性產品</h3>
      <p>油性卸妝油會分解黑膠的黏性。請改用卸妝水或專用的美睫清潔液。</p>
      <h3>3. 正確的清潔方式</h3>
      <p>洗臉時不要用力揉搓眼睛。建議使用洗臉海綿或棉棒輕輕清潔眼周。</p>
      <h3>4. 每天梳理</h3>
      <p>使用美睫師提供的睫毛刷，每天早晚輕輕梳理，防止睫毛交纏或亂翹。</p>
    `
  }
};

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const articleId = id || "1";
  const article = NEWS_ARTICLES[articleId] || NEWS_ARTICLES["1"];

  const articleIds = Object.keys(NEWS_ARTICLES);
  const currentIndex = articleIds.indexOf(articleId);
  const prevId = currentIndex > 0 ? articleIds[currentIndex - 1] : null;
  const nextId = currentIndex < articleIds.length - 1 ? articleIds[currentIndex + 1] : null;

  return (
    <div className="flex flex-col pb-32 bg-stone-50 dark:bg-slate-950">
      {/* Hero Image */}
      <div className="relative h-72">
        <img 
          src={article.img} 
          alt={article.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <button 
          onClick={() => navigate('/news')}
          className="absolute top-6 left-6 size-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-black/50 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      </div>

      {/* Content */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-6 -mt-10 relative z-10"
      >
        <article className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-xl border border-logo-green/5">
          <header className="flex items-center gap-3 mb-4">
            <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {article.category}
            </span>
            <time className="text-stone-400 text-xs font-bold">{article.date}</time>
          </header>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 leading-tight mb-8">
            {article.title}
          </h1>
          
          <div 
            className="prose prose-stone dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Navigation */}
          <nav className="mt-12 pt-8 border-t border-stone-100 dark:border-stone-800 flex justify-between gap-4">
            {prevId ? (
              <Link to={`/news/${prevId}`} className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">arrow_back</span> 上一篇
              </Link>
            ) : <div />}
            {nextId ? (
              <Link to={`/news/${nextId}`} className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                下一篇 <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            ) : <div />}
          </nav>

          {/* Share */}
          <footer className="mt-12 pt-8 border-t border-stone-100 dark:border-stone-800">
            <h4 className="text-sm font-bold text-logo-green mb-4">分享這篇文章</h4>
            <div className="flex gap-4">
              <button className="size-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:bg-primary hover:text-white transition-colors">
                <span className="material-symbols-outlined text-xl">ios_share</span>
              </button>
            </div>
          </footer>
        </article>
      </motion.div>
    </div>
  );
}
