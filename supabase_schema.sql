-- ==========================================
-- 1. 網站設定表 (Site Settings)
-- 用途：存放靈活更改的文字、社群連結等
-- ==========================================
CREATE TABLE site_settings (
    id TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT
);

-- 允許所有人讀取 (前端需要抓取資料)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON site_settings FOR SELECT USING (true);

-- 預先放入一些基本資料
INSERT INTO site_settings (id, value, description) VALUES
('facebook_link', 'https://facebook.com', 'Facebook 粉絲專頁連結'),
('instagram_link', 'https://instagram.com', 'Instagram 連結'),
('line_link', 'https://line.me', 'LINE 官方帳號連結'),
('booking_link', 'https://booking.com', '預約系統連結'),
('footer_text', '© 2024 Fingers Love Professional Salon. All rights reserved.', '頁尾版權文字');

-- ==========================================
-- 2. 設計師表 (Therapists)
-- 用途：存放美甲、美睫師等人員資料
-- ==========================================
CREATE TABLE therapists (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    experience TEXT,
    description TEXT,
    skills TEXT[],
    image_url TEXT
);

-- 允許所有人讀取
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Therapists are viewable by everyone." ON therapists FOR SELECT USING (true);

-- 預先放入假資料 (將我們原來在 constants.ts 的資料搬過來)
INSERT INTO therapists (name, title, experience, description, skills, image_url) VALUES
('安娜 (Anna)', '資深美甲美睫師', '8年', '擅長法式優雅與日系精緻風格...', ARRAY['美甲', '美睫'], 'https://lh3.googleusercontent.com/aida-public/...'),
('克洛伊', '專業美睫設計師', '5年', '專精於山茶花多層次嫁接技術...', ARRAY['美睫'], 'https://lh3.googleusercontent.com/aida-public/...'),
('米亞', '頂級肌膚管理師', '10年', '擁有豐富的醫美與沙龍護膚經驗...', ARRAY['護膚', '除毛'], 'https://lh3.googleusercontent.com/aida-public/...'),
('蘇菲亞', '全方位美容總監', '12年', '全能型美容專家...', ARRAY['美甲', '美睫', '護膚', '除毛'], 'https://lh3.googleusercontent.com/aida-public/...');

-- ==========================================
-- 3. 服務項目表 (Services)
-- 用途：存放不同的服務與價位
-- ==========================================
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL, -- 例如: '美甲', '美睫'
    type TEXT NOT NULL, -- 例如: 'featured' (主打), 'others' (其他), 'extra' (加購)
    title TEXT NOT NULL,
    price TEXT NOT NULL,
    duration TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    therapist_names TEXT[] -- 支援的設計師名字陣列
);

-- 允許所有人讀取
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are viewable by everyone." ON services FOR SELECT USING (true);

-- 預先放入一些資料 (以美甲主打為例)
INSERT INTO services (category, type, title, price, duration, description, icon, therapist_names) VALUES
('美甲', 'featured', '經典凝膠美甲', '$1,200', '45 分鐘', '包含基礎甘皮修整、甲型修磨及單色/跳色凝膠上色', 'spa', ARRAY['安娜 (Anna)', '蘇菲亞']);

-- ==========================================
-- 4. 作品集表 (Portfolio)
-- 用途：展示過往作品
-- ==========================================
CREATE TABLE portfolio (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    therapist_name TEXT NOT NULL,
    aspect_ratio TEXT DEFAULT 'aspect-square',
    main_image_url TEXT NOT NULL,
    sub_images TEXT[],
    description TEXT
);

-- 允許所有人讀取
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Portfolio are viewable by everyone." ON portfolio FOR SELECT USING (true);

-- 預先放入一筆作品
INSERT INTO portfolio (title, category, therapist_name, aspect_ratio, main_image_url, sub_images, description) VALUES
('極簡法式', '法式美甲', '安娜 (Anna)', 'aspect-square', 'https://lh3.googleusercontent.com/aida-public/...', ARRAY['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e'], '最經典的法式美甲，簡約而不失格調。');
