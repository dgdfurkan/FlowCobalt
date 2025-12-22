# Sonraki Adımlar - Supabase Kurulumu Tamamlandı

## ✅ Tamamlananlar

- [x] Edge function'lar deploy edildi (`track-visit`, `send-telegram`)
- [x] GitHub Secrets eklendi

---

## 🔄 Şimdi Yapılacaklar

### 1. Database Schema'yı Çalıştırın

**Adımlar:**

1. **Supabase Dashboard → SQL Editor**
2. **New query** oluşturun
3. **`infra/supabase/schema.sql`** dosyasının içeriğini kopyalayıp yapıştırın
4. **Run** butonuna tıklayın

**Kontrol:**
- Table Editor'da şu tablolar görünmeli:
  - `admins`
  - `visitors`
  - `visits`
  - `events`
  - `settings`

---

### 2. Admin Kullanıcı Oluşturun

**Adımlar:**

1. **Supabase Dashboard → Authentication → Users**
2. **Add user** butonuna tıklayın
3. Email ve password girin (örnek: `admin@flowcobalt.com`)
4. **Create user** butonuna tıklayın

**Admins Tablosuna Ekle:**

SQL Editor'da şu SQL'i çalıştırın (username ve email'i değiştirin):

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
- Login sayfasında **username** (örn: `admin`) ile giriş yapılacak
- Email Supabase Auth için gereklidir

---

### 3. Telegram Bot Kurulumu

**Adımlar:**

1. **Telegram'da @BotFather'a gidin**
2. `/newbot` komutunu gönderin
3. Bot adı ve username belirleyin
4. Bot token'ı alın (örn: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

5. **Chat ID Alın:**
   - Telegram'da @userinfobot'a gidin
   - Chat ID'nizi alın (örn: `123456789`)

6. **Settings Tablosuna Ekleyin:**

SQL Editor'da şu SQL'i çalıştırın (değerleri değiştirin):

```sql
-- Telegram'ı aktifleştir
UPDATE settings 
SET value = 'true' 
WHERE key = 'telegram_enabled';

-- Bot token'ı ekle
UPDATE settings 
SET value = '"YOUR_BOT_TOKEN"' 
WHERE key = 'telegram_bot_token';

-- Chat ID'yi ekle
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

### 4. Edge Function'ları Test Edin

#### track-visit Function Test

**Browser Console'dan:**

1. Siteyi açın: `http://localhost:3000` (veya production URL)
2. Browser console'u açın (F12)
3. Network tab'ına gidin
4. Sayfa yenilendiğinde `/functions/v1/track-visit` çağrısını görmelisiniz

**Manuel Test:**

```bash
curl -X POST \
  https://vwhnqvynjyawjtkflvot.supabase.co/functions/v1/track-visit \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "pagePath": "/",
    "userAgent": "Mozilla/5.0",
    "referer": ""
  }'
```

**Kontrol:**
- Supabase Dashboard → Table Editor → `visitors` tablosunu kontrol edin
- Yeni bir kayıt görünmeli

#### send-telegram Function Test

**Manuel Test:**

```bash
curl -X POST \
  https://vwhnqvynjyawjtkflvot.supabase.co/functions/v1/send-telegram \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "visitorId": "test-uuid",
    "visitId": "test-uuid",
    "isNewVisit": true,
    "ipAddress": "123.45.67.89",
    "country": "Turkey",
    "city": "Istanbul"
  }'
```

**Kontrol:**
- Telegram'da bildirim gelmeli
- Eğer gelmezse:
  - Bot token'ı kontrol edin
  - Chat ID'yi kontrol edin
  - Edge function loglarını kontrol edin (Dashboard → Edge Functions → Logs)

---

### 5. Admin Panel'i Test Edin

1. **Siteyi açın:** `http://localhost:3000/admin/login`
2. **Admin email ve şifre ile giriş yapın**
3. **Dashboard'a yönlendirilmelisiniz**
4. **Visitor stats görünmeli**

---

## 🔍 Troubleshooting

### Edge Function Çalışmıyor

- Function'ın deploy edildiğinden emin olun
- Function loglarını kontrol edin (Dashboard → Edge Functions → Function adı → Logs)
- Environment variables'ın doğru olduğundan emin olun

### Telegram Bildirimi Gelmiyor

- Bot token'ı kontrol edin
- Chat ID'yi kontrol edin
- Settings tablosundaki değerleri kontrol edin:
  ```sql
  SELECT * FROM settings WHERE key LIKE 'telegram%';
  ```
- Edge function loglarını kontrol edin

### Admin Login Çalışmıyor

- Admin kullanıcının `admins` tablosunda olduğundan emin olun:
  ```sql
  SELECT * FROM admins;
  ```
- Email'in doğru olduğundan emin olun
- Supabase Auth'da kullanıcının oluşturulduğundan emin olun

### Tracking Çalışmıyor

- Browser console'da hata var mı kontrol edin
- Network tab'ında `/functions/v1/track-visit` çağrısı görünüyor mu?
- Edge function loglarını kontrol edin

---

## ✅ Tamamlandı Kontrol Listesi

- [ ] Database schema çalıştırıldı
- [ ] Admin kullanıcı oluşturuldu (Auth + admins tablosu)
- [ ] Telegram bot oluşturuldu ve ayarlar yapıldı
- [ ] Edge function'lar test edildi
- [ ] Admin panel test edildi
- [ ] Tracking test edildi
- [ ] Telegram bildirimleri test edildi

---

## 📚 İlgili Dokümantasyon

- Edge Functions Deploy: `docs/SUPABASE_EDGE_FUNCTIONS_DEPLOY.md`
- Tam Kurulum Rehberi: `docs/SUPABASE_SETUP_COMPLETE.md`
- GitHub Secrets: `docs/GITHUB_SECRETS_SETUP.md`

