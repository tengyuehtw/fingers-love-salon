# Fingers Love Salon — 訪客登入說明

## 🔐 訪客登入方式

本系統使用 **Supabase 匿名登入（Anonymous Sign-In）**，訪客不需要任何信箱或密碼。

### 流程說明
1. 點擊登入頁「訪客快速體驗」按鈕
2. Supabase 自動建立一個匿名帳號（不需要 email / 密碼）
3. 自動登入，進入會員功能頁

### 為什麼改用匿名登入？
- 舊方案（隨機 email + 固定密碼）會受到 Supabase「email 驗證確認」機制影響，導致登入失敗
- 新方案使用官方 `signInAnonymously()` API，可立刻登入，不受信箱驗證限制

---

## ⚙️ Supabase 後台設定（重要！）

使用匿名登入前，**必須**在 Supabase 後台啟用此功能：

1. 前往 [https://supabase.com](https://supabase.com) → 登入你的專案
2. 左側選單 → **Authentication** → **Providers**
3. 找到 **Anonymous Sign-ins**
4. 確保開關為 **啟用（Enabled）**

> 若未啟用，訪客點擊按鈕會看到錯誤訊息。

---

## 📋 正式會員密碼規範建議

對於正式帳號，建議使用者設定包含以下條件的密碼：
- 長度至少 **8 位**
- 包含**大小寫字母**、**數字**及**符號**

---

*文件建立日期：2026-03-05*
*版本：2.0（匿名登入方案）*
