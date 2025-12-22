# Send-Telegram Function'ı JWT Doğrulaması Olmadan Deploy Etme

`send-telegram` function'ı edge function'lar arası çağrılar için JWT doğrulaması olmadan deploy edilmelidir.

## Supabase CLI ile Deploy

```bash
supabase functions deploy send-telegram --project-ref vwhnqvynjyawjtkflvot --no-verify-jwt
```

## Supabase Dashboard ile Deploy

1. Supabase Dashboard > Edge Functions > `send-telegram`
2. Settings sekmesine git
3. "Verify JWT" seçeneğini **kapat**
4. Deploy et

Bu şekilde `track-visit` function'ı `send-telegram`'ı `apikey` header'ı ile çağırabilir.

