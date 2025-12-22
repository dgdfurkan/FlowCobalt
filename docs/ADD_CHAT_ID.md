# Yeni Chat ID Ekleme

## Yeni Chat ID Eklemek İçin SQL

Yeni bir chat ID eklemek için (örnek: `100100`):

```sql
UPDATE settings 
SET value = (
  SELECT jsonb_agg(DISTINCT elem::text)
  FROM (
    SELECT jsonb_array_elements_text(value) AS elem 
    FROM settings 
    WHERE key = 'telegram_chat_ids'
    UNION
    SELECT '100100'  -- Yeni chat ID buraya
  ) t
)::jsonb
WHERE key = 'telegram_chat_ids';
```

---

## Alternatif Yöntem (Daha Basit)

Eğer chat ID'lerin sırası önemli değilse:

```sql
UPDATE settings 
SET value = value || '["100100"]'::jsonb
WHERE key = 'telegram_chat_ids';
```

Bu yöntem yeni chat ID'yi array'in sonuna ekler.

---

## Kontrol Etmek İçin

Ekledikten sonra kontrol edin:

```sql
SELECT value FROM settings WHERE key = 'telegram_chat_ids';
```

Sonuç: `["785750734", "100100"]` şeklinde görünmeli.

---

## Örnek: Mevcut Chat ID'ler

Şu anda:
- `785750734`

Yeni eklenen:
- `100100`

Sonuç:
- `["785750734", "100100"]`

