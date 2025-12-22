# Admin Username Kurulumu

## Önemli Değişiklik

Admin sistemi artık **username** tabanlı çalışıyor (email değil).

## Nasıl Çalışıyor?

1. **Login:** Kullanıcı **username** ile giriş yapar (örn: `admin`)
2. **Auth:** Sistem username'den email'i bulur ve Supabase Auth ile giriş yapar
3. **Dashboard:** Dashboard'da **username** gösterilir

---

## Admin Kullanıcı Oluşturma

### 1. Supabase Auth'da Kullanıcı Oluşturun

1. **Supabase Dashboard → Authentication → Users**
2. **Add user** butonuna tıklayın
3. **Email:** Admin email'inizi girin (örn: `admin@flowcobalt.com`)
4. **Password:** Güçlü bir şifre belirleyin
5. **Create user** butonuna tıklayın

### 2. Admins Tablosuna Ekleyin

SQL Editor'da şu SQL'i çalıştırın:

```sql
INSERT INTO admins (username, email) 
VALUES ('admin', 'admin@flowcobalt.com');
```

**Önemli:**
- `username`: Login için kullanılacak (örn: `admin`)
- `email`: Supabase Auth email'i (yukarıda oluşturduğunuz email)

---

## Login Akışı

1. Kullanıcı `/admin/login` sayfasına gider
2. **Username** girer (örn: `admin`)
3. **Password** girer
4. Sistem:
   - Username'den admin kaydını bulur
   - Admin kaydındaki email'i alır
   - Supabase Auth ile email + password ile giriş yapar
   - Admin kontrolü yapar
   - Dashboard'a yönlendirir

---

## Örnek Kullanım

### Admin Oluşturma

```sql
-- Admin kullanıcı oluştur
INSERT INTO admins (username, email) 
VALUES ('admin', 'admin@flowcobalt.com');

-- Başka bir admin ekle
INSERT INTO admins (username, email) 
VALUES ('manager', 'manager@flowcobalt.com');
```

### Login

- **Username:** `admin`
- **Password:** (Supabase Auth'da belirlediğiniz şifre)

---

## Schema Değişikliği

`admins` tablosu artık şu şekilde:

```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,  -- Login için
  email TEXT,                      -- Supabase Auth için (opsiyonel ama önerilir)
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## Notlar

- **Username** login için kullanılır
- **Email** Supabase Auth için gereklidir (username ile giriş yapılamaz)
- Her admin'in hem username'i hem de email'i olmalı
- Email Supabase Auth'da kayıtlı olmalı

