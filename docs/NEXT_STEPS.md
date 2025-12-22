# Sonraki Adımlar - Basit Admin Sistemi

## ✅ Tamamlananlar

- [x] Edge function'lar deploy edildi (`track-visit`, `send-telegram`)
- [x] GitHub Secrets eklendi
- [x] Basit admin sistemi (username/password, Supabase Auth yok)

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
  - `users` (yeni - admin sistemi için)
  - `visitors`
  - `visits`
  - `events`
  - `settings`

---

### 2. Admin Kullanıcı Oluşturun

**SQL Editor'da şu SQL'i çalıştırın:**

```sql
INSERT INTO users (username, password) 
VALUES ('admin', 'admin123');
```

**Not:** 
- Username: `admin` (veya istediğiniz username)
- Password: `admin123` (veya istediğiniz password - plain text)
- Hash yok, çok basit sistem

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

### 4. Admin Panel'i Test Edin

1. **Siteyi açın:** `http://localhost:3000/admin/login`
2. **Username:** `admin`
3. **Password:** `admin123` (veya oluşturduğunuz password)
4. **Giriş yapın**
5. **Dashboard'a yönlendirilmelisiniz**

---

### 5. Tracking'i Test Edin

1. **Ana sayfayı açın:** `http://localhost:3000`
2. **Browser console'u açın** (F12)
3. **Network tab'ına gidin**
4. **Sayfa yenilendiğinde** `/functions/v1/track-visit` çağrısını görmelisiniz
5. **Supabase Dashboard → Table Editor → `visitors`** tablosunu kontrol edin
6. **Yeni bir kayıt görünmeli**

---

### 6. Telegram Bildirimlerini Test Edin

1. **Yeni bir ziyaretçi gibi siteye girin** (farklı IP veya incognito mode)
2. **Telegram'da bildirim gelmeli**
3. **Eğer gelmezse:**
   - Bot token'ı kontrol edin
   - Chat ID'yi kontrol edin
   - Settings tablosunu kontrol edin:
     ```sql
     SELECT * FROM settings WHERE key LIKE 'telegram%';
     ```
   - Edge function loglarını kontrol edin (Dashboard → Edge Functions → Logs)

---

## 🔍 Troubleshooting

### Admin Login Çalışmıyor

- Users tablosunda kullanıcı var mı kontrol edin:
  ```sql
  SELECT * FROM users;
  ```
- Username ve password doğru mu kontrol edin
- Browser console'da hata var mı kontrol edin

### Tracking Çalışmıyor

- Browser console'da hata var mı kontrol edin
- Network tab'ında `/functions/v1/track-visit` çağrısı görünüyor mu?
- Edge function loglarını kontrol edin

### Telegram Bildirimi Gelmiyor

- Bot token'ı kontrol edin
- Chat ID'yi kontrol edin
- Settings tablosundaki değerleri kontrol edin
- Edge function loglarını kontrol edin

---

## ✅ Tamamlandı Kontrol Listesi

- [ ] Database schema çalıştırıldı
- [ ] Admin kullanıcı oluşturuldu (`users` tablosuna)
- [ ] Telegram bot oluşturuldu ve ayarlar yapıldı
- [ ] Admin login test edildi
- [ ] Tracking test edildi
- [ ] Telegram bildirimleri test edildi

---

## 📚 İlgili Dokümantasyon

- Basit Auth Sistemi: `docs/SIMPLE_AUTH_SETUP.md`
- Edge Functions Deploy: `docs/SUPABASE_EDGE_FUNCTIONS_DEPLOY.md`
- GitHub Secrets: `docs/GITHUB_SECRETS_SETUP.md`
