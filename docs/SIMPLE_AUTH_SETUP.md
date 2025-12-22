# Basit Admin Sistemi Kurulumu

## Sistem Özellikleri

- ✅ **Çok basit:** Sadece `users` tablosu
- ✅ **Username + Password:** Plain text password (hash yok)
- ✅ **Supabase Auth yok:** Direkt database sorgusu
- ✅ **Session:** sessionStorage ile basit session yönetimi

---

## Database Schema

### Users Tablosu

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Plain text
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

---

## Admin Kullanıcı Oluşturma

### SQL Editor'da Çalıştırın:

```sql
INSERT INTO users (username, password) 
VALUES ('admin', 'your-password-here');
```

**Örnek:**
```sql
INSERT INTO users (username, password) 
VALUES ('admin', 'admin123');
```

**Not:** Password plain text olarak saklanır (hash yok).

---

## Login Akışı

1. Kullanıcı `/admin/login` sayfasına gider
2. **Username** girer (örn: `admin`)
3. **Password** girer (örn: `admin123`)
4. Sistem:
   - `users` tablosunda username ve password'u kontrol eder
   - Eşleşirse sessionStorage'a kaydeder
   - Dashboard'a yönlendirir

---

## Session Yönetimi

- **Login:** sessionStorage'a user bilgisi kaydedilir
- **Check:** Her sayfa yüklemesinde sessionStorage kontrol edilir
- **Logout:** sessionStorage temizlenir

**Session Data:**
```json
{
  "id": "uuid",
  "username": "admin"
}
```

---

## Güvenlik Notları

⚠️ **Bu sistem çok basit ve production için uygun değil:**

- Password'lar plain text (hash yok)
- Session sadece sessionStorage'da (kolay manipüle edilebilir)
- Supabase Auth güvenlik özellikleri yok

**Öneri:** 
- Development/test için kullanılabilir
- Production için Supabase Auth veya daha güvenli bir sistem önerilir

---

## Kullanım

### Admin Oluşturma

```sql
INSERT INTO users (username, password) 
VALUES ('admin', 'admin123');
```

### Login

- Username: `admin`
- Password: `admin123`

### Logout

- "Sign Out" butonuna tıklayın
- SessionStorage temizlenir

---

## Avantajlar

- ✅ Çok basit kurulum
- ✅ Supabase Auth gerektirmez
- ✅ Hızlı implementasyon
- ✅ Kolay yönetim

## Dezavantajlar

- ⚠️ Güvenlik riski (plain text password)
- ⚠️ Session güvenliği düşük
- ⚠️ Production için uygun değil

