# Güncel SQL Schema - FlowCobalt

## Kullanım

Bu SQL'i Supabase Dashboard → SQL Editor'da çalıştırın.

---

## Kullanıcılar

Otomatik oluşturulan kullanıcılar:

1. **Furkan**
   - Username: `Furkan`
   - Password: `123`

2. **Erdem**
   - Username: `Erdem`
   - Password: `123`

---

## Telegram Ayarları

- **Bot Token:** `8490339218:AAGkE0Oh06enmuXFmoxHGhLZj6d5E8xiGck`
- **Chat ID:** `785750734` (şimdilik tek, sonra bir tane daha eklenecek)
- **Enabled:** `true`

---

## Yeni Chat ID Ekleme

Daha sonra yeni bir chat ID eklemek için:

```sql
UPDATE settings 
SET value = '["785750734", "YENI_CHAT_ID"]' 
WHERE key = 'telegram_chat_ids';
```

---

## Tablolar

1. **users** - Admin kullanıcılar (username, password)
2. **visitors** - Ziyaretçi bilgileri (IP, country, city)
3. **visits** - Ziyaret kayıtları
4. **events** - Etkileşim kayıtları (pageview, click, vb.)
5. **settings** - Sistem ayarları (Telegram, muted IPs)

---

## Notlar

- Password'lar plain text (hash yok)
- Telegram bildirimleri aktif
- RLS policies basitleştirilmiş (public read)

