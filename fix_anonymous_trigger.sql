-- ==========================================
-- 修復 Trigger 以支援匿名登入（Anonymous Sign-In）
-- ==========================================
-- 問題：原本的 profiles 表 email 欄位是 NOT NULL，
--       匿名用戶沒有 email，導致 Trigger 插入時報錯。
-- 修復：把 email 欄位改成可以為空（NULL），
--       同時讓 Trigger 可以優雅地處理匿名帳號。
--
-- 📋 使用方式：
-- 1. 前往 Supabase 後台 → SQL Editor
-- 2. 全選貼上這份文件的所有內容
-- 3. 點 Run（執行）
-- ==========================================

-- 步驟1：把 profiles 表的 email 欄位解除 NOT NULL 限制
ALTER TABLE public.profiles
  ALTER COLUMN email DROP NOT NULL;

-- 步驟2：替換 Trigger Function，讓它可以處理匿名帳號（沒有 email）
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- 匿名帳號的 email 是 NULL，所以用 COALESCE 讓它不會炸掉
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    new.id,
    new.email,  -- 匿名用戶這裡是 NULL，但現在欄位允許 NULL 了
    COALESCE(
      new.raw_user_meta_data->>'display_name',  -- 一般帳號會有姓名
      '訪客'                                     -- 匿名帳號預設顯示「訪客」
    )
  )
  ON CONFLICT (id) DO NOTHING;  -- 如果已存在就不要重複插入
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 完成！執行後回到網頁重試訪客登入。
