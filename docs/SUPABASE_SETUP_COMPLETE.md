# Supabase Kurulum Rehberi - Adım Adım

## 1. Database Schema Kurulumu

### Adımlar:

1. **Supabase Dashboard'a gidin:**
   - https://supabase.com/dashboard
   - Projenizi seçin: `vwhnqvynjyawjtkflvot`

2. **SQL Editor'a gidin:**
   - Sol menüden "SQL Editor" seçin
   - "New query" butonuna tıklayın

3. **Schema SQL'ini çalıştırın:**
   - `infra/supabase/schema.sql` dosyasının içeriğini kopyalayın
   - SQL Editor'a yapıştırın
   - "Run" butonuna tıklayın

4. **Doğrulama:**
   - Sol menüden "Table Editor" seçin
   - Şu tabloların oluştuğunu kontrol edin:
     - `admins`
     - `visitors`
     - `visits`
     - `events`
     - `settings`

---

## 2. Edge Functions Deploy

### Yöntem A: Supabase CLI (Önerilen)

```bash
# 1. Supabase CLI kurun
brew install supabase/tap/supabase

# 2. Login olun
supabase login

# 3. Projeyi link edin
cd /Users/furkangunduz/CursorProjects/FlowCobalt
supabase link --project-ref vwhnqvynjyawjtkflvot

# 4. Function'ları deploy edin
supabase functions deploy track-visit --project-ref vwhnqvynjyawjtkflvot
supabase functions deploy send-telegram --project-ref vwhnqvynjyawjtkflvot
```

### Yöntem B: Supabase Dashboard (Manuel)

1. **Edge Functions sayfasına gidin:**
   - Dashboard → Edge Functions
   - "Create a new function" butonuna tıklayın

2. **track-visit function'ı oluşturun:**
   - Function name: `track-visit`
   - `infra/supabase/edge-functions/track-visit/index.ts` içeriğini kopyalayın
   - Deploy edin

3. **send-telegram function'ı oluşturun:**
   - Function name: `send-telegram`
   - `infra/supabase/edge-functions/send-telegram/index.ts` içeriğini kopyalayın
   - Deploy edin

---

## 3. Admin Kullanıcı Oluşturma

### Adımlar:

1. **Supabase Auth'a gidin:**
   - Dashboard → Authentication → Users
   - "Add user" butonuna tıklayın

2. **Kullanıcı oluşturun:**
   - Email: Admin email'inizi girin (örnek: `admin@flowcobalt.com`)
   - Password: Güçlü bir şifre belirleyin
   - "Create user" butonuna tıklayın

3. **Admins tablosuna ekleyin:**
   - SQL Editor'a gidin
   - Şu SQL'i çalıştırın (username ve email'i değiştirin):

```sql
INSERT INTO admins (username, email) 
VALUES ('admin', 'your-admin-email@example.com');
```

**Örnek:**
```sql
INSERT INTO admins (username, email) 
VALUES ('admin', 'admin@flowcobalt.com');
```

**Not:** 
- `username` login için kullanılacak (örnek: `admin`)
- `email` Supabase Auth email'i (giriş için gerekli)
- Login sayfasında **username** ile giriş yapılacak

---

## 4. Telegram Bot Kurulumu

### Adımlar:

1. **Telegram Bot Oluşturun:**
   - Telegram'da @BotFather'a gidin
   - `/newbot` komutunu gönderin
   - Bot adını ve username'i belirleyin
   - Bot token'ı alın (örn: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

2. **Chat ID Alın:**
   - Telegram'da @userinfobot'a gidin
   - Chat ID'nizi alın (örn: `123456789`)

3. **Settings Tablosuna Ekleyin:**

SQL Editor'da şu SQL'i çalıştırın:

```sql
-- Telegram'ı aktifleştir
UPDATE settings 
SET value = 'true' 
WHERE key = 'telegram_enabled';

-- Bot token'ı ekle (YOUR_BOT_TOKEN'ı değiştirin)
UPDATE settings 
SET value = '"YOUR_BOT_TOKEN"' 
WHERE key = 'telegram_bot_token';

-- Chat ID'yi ekle (YOUR_CHAT_ID'yi değiştirin)
UPDATE settings 
SET value = '["YOUR_CHAT_ID"]' 
WHERE key = 'telegram_chat_ids';
```

**Örnek:**
```sql
UPDATE settings SET value = 'true' WHERE key = 'telegram_enabled';
UPDATE settings SET value = '"123456789:ABCdefGHIjklMNOpqrsTUVwxyz"' WHERE key = 'telegram_bot_token';
UPDATE settings SET value = '["123456789"]' WHERE key = 'telegram_chat_ids';
```

---

## 5. Test Etme

### Admin Login Test

1. Siteyi açın: `http://localhost:3000/admin/login`
2. Oluşturduğunuz admin email ve şifre ile giriş yapın
3. Dashboard'a yönlendirilmelisiniz

### Tracking Test

1. Ana sayfayı açın: `http://localhost:3000`
2. Browser console'u açın (F12)
3. Tracking loglarını kontrol edin
4. Supabase dashboard → Table Editor → `visitors` tablosunu kontrol edin

### Telegram Test

1. Siteye yeni bir ziyaretçi gibi girin
2. Telegram'da bildirim gelmeli
3. Eğer gelmezse:
   - Bot token'ı kontrol edin
   - Chat ID'yi kontrol edin
   - Edge function loglarını kontrol edin (Dashboard → Edge Functions → Logs)

---

## Troubleshooting

### Edge Function Çalışmıyor

- Function'ın deploy edildiğinden emin olun
- Function loglarını kontrol edin (Dashboard → Edge Functions → Logs)
- Environment variables'ın doğru olduğundan emin olun

### Telegram Bildirimi Gelmiyor

- Bot token'ı kontrol edin
- Chat ID'yi kontrol edin
- Settings tablosundaki değerleri kontrol edin
- Edge function loglarını kontrol edin

### Admin Login Çalışmıyor

- Admin kullanıcının `admins` tablosunda olduğundan emin olun
- Email'in doğru olduğundan emin olun
- Supabase Auth'da kullanıcının oluşturulduğundan emin olun

---

## Özet Checklist

- [ ] Database schema çalıştırıldı (`schema.sql`)
- [ ] Edge function'lar deploy edildi (`track-visit`, `send-telegram`)
- [ ] Admin kullanıcı oluşturuldu (Auth + admins tablosu)
- [ ] Telegram bot oluşturuldu ve ayarlar yapıldı
- [ ] Test edildi (login, tracking, telegram)

