# Supabase Edge Functions Deploy Rehberi

## Edge Function'lar

Projede 2 adet edge function var:

1. **track-visit** - Ziyaretçi takibi (IP, geolocation, visit kaydı)
2. **send-telegram** - Telegram bildirimleri gönderme

---

## Deploy Yöntemleri

### Yöntem 1: Supabase CLI (Önerilen)

#### 1. Supabase CLI Kurulumu

```bash
# macOS
brew install supabase/tap/supabase

# veya npm ile
npm install -g supabase
```

#### 2. Supabase'e Login

```bash
supabase login
```

#### 3. Projeyi Link Et

```bash
cd /Users/furkangunduz/CursorProjects/FlowCobalt
supabase link --project-ref vwhnqvynjyawjtkflvot
```

#### 4. Edge Function'ları Deploy Et

```bash
# track-visit function'ı deploy et
supabase functions deploy track-visit --project-ref vwhnqvynjyawjtkflvot

# send-telegram function'ı deploy et
supabase functions deploy send-telegram --project-ref vwhnqvynjyawjtkflvot
```

---

### Yöntem 2: Supabase Dashboard (Manuel)

#### 1. Supabase Dashboard'a Gidin

- https://supabase.com/dashboard
- Projenizi seçin: `vwhnqvynjyawjtkflvot`

#### 2. Edge Functions Sayfasına Gidin

- Sol menüden "Edge Functions" seçin
- "Create a new function" butonuna tıklayın

#### 3. track-visit Function'ı Oluşturun

**Function Name:** `track-visit`

**Code:** `infra/supabase/edge-functions/track-visit/index.ts` dosyasının içeriğini kopyalayın

**Environment Variables:**
- `SUPABASE_URL` → Otomatik eklenir
- `SUPABASE_SERVICE_ROLE_KEY` → Otomatik eklenir (Settings → API → service_role key)

**Deploy** butonuna tıklayın

#### 4. send-telegram Function'ı Oluşturun

**Function Name:** `send-telegram`

**Code:** `infra/supabase/edge-functions/send-telegram/index.ts` dosyasının içeriğini kopyalayın

**Environment Variables:**
- `SUPABASE_URL` → Otomatik eklenir
- `SUPABASE_SERVICE_ROLE_KEY` → Otomatik eklenir

**Deploy** butonuna tıklayın

---

## Edge Function Detayları

### track-visit Function

**Endpoint:** `https://vwhnqvynjyawjtkflvot.supabase.co/functions/v1/track-visit`

**Method:** POST

**Request Body:**
```json
{
  "pagePath": "/",
  "userAgent": "Mozilla/5.0...",
  "referer": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "visitorId": "uuid",
  "visitId": "uuid",
  "isNewVisit": true
}
```

**Ne Yapar:**
- IP adresini alır (request headers'dan)
- Geolocation bilgisi çıkarır
- Yeni/tekrar ziyaretçi kontrolü yapar
- Visit kaydı oluşturur
- Telegram bildirimi tetikler (muted değilse)

---

### send-telegram Function

**Endpoint:** `https://vwhnqvynjyawjtkflvot.supabase.co/functions/v1/send-telegram`

**Method:** POST

**Request Body:**
```json
{
  "visitorId": "uuid",
  "visitId": "uuid",
  "isNewVisit": true,
  "ipAddress": "123.45.67.89",
  "country": "Turkey",
  "city": "Istanbul"
}
```

**Ne Yapar:**
- Settings tablosundan Telegram ayarlarını okur
- Bot token ve chat ID'leri alır
- Telegram API'ye mesaj gönderir
- Yeni ziyaretçi veya tekrar ziyaret mesajı formatlar

---

## Environment Variables

Edge function'lar otomatik olarak şu environment variables'ı alır:

- `SUPABASE_URL` - Proje URL'i
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (admin yetkileri)

**Not:** Service role key'i Settings → API → service_role (secret) kısmından alabilirsiniz.

---

## Test Etme

### track-visit Function Test

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

### send-telegram Function Test

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

---

## Troubleshooting

### Function Bulunamadı Hatası

- Function'ın deploy edildiğinden emin olun
- Function adının doğru olduğundan emin olun (`track-visit`, `send-telegram`)

### CORS Hatası

- Edge function'larda CORS headers zaten var
- Eğer hala sorun varsa, function kodunu kontrol edin

### Environment Variables Eksik

- Service role key'in doğru olduğundan emin olun
- Supabase dashboard'dan kontrol edin

---

## Sonraki Adımlar

1. ✅ Edge function'ları deploy edin
2. ✅ Database schema'yı çalıştırın (`infra/supabase/schema.sql`)
3. ✅ Admin kullanıcı oluşturun
4. ✅ Telegram bot token'ı settings'e ekleyin
5. ✅ Test edin

