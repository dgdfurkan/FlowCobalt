# Supabase Edge Functions

Bu klasörde Supabase Edge Function'ları bulunur.

## Function'lar

### track-visit
Ziyaretçi takibi için edge function.

**Dosya:** `track-visit/index.ts`

**Deploy:**
```bash
supabase functions deploy track-visit --project-ref vwhnqvynjyawjtkflvot
```

### send-telegram
Telegram bildirimleri için edge function.

**Dosya:** `send-telegram/index.ts`

**Deploy:**
```bash
supabase functions deploy send-telegram --project-ref vwhnqvynjyawjtkflvot
```

## Deploy Adımları

Detaylı deploy rehberi için: `/docs/SUPABASE_EDGE_FUNCTIONS_DEPLOY.md`

## Notlar

- Edge function'lar Deno runtime kullanır
- TypeScript ile yazılmıştır
- Environment variables otomatik olarak Supabase tarafından sağlanır

