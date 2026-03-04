-- ==========================================
-- 建立會員資料表 (Profiles)
-- ==========================================
-- 💡 說明：在 Supabase 中，使用者的「帳號密碼」是由官方隱藏的 `auth.users` 表安全管理的。
-- 我們不需要自己建密碼欄位！我們只要建立一個 `profiles` 表來存放使用者的「公開/額外資訊」
-- (例如：姓名、手機、會員等級)，並把它跟 `auth.users` 連動起來即可。

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY, -- 綁定 auth.users 的 ID
  email TEXT NOT NULL,
  display_name TEXT,
  phone TEXT,
  membership_level TEXT DEFAULT 'bronze', -- 預設會員等級 (對應我們預設的黃銅級)
  points INTEGER DEFAULT 0, -- 消費點數
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 開啟 Row Level Security (RLS) 保護資料
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 策略 1：允許使用者看到自己的資料
CREATE POLICY "Users can view own profile."
  ON public.profiles FOR SELECT
  USING ( auth.uid() = id );

-- 策略 2：允許使用者更新自己的資料
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- ==========================================
-- 設定自動化觸發器 (Database Trigger)
-- ==========================================
-- 當有人在你的網頁成功註冊 (寫入 auth.users) 時，
-- 自動在我們的 profiles 表裡面建立一筆對應的空白會員資料。

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'display_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
