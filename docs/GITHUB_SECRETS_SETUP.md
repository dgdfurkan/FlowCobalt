# GitHub Secrets Kurulumu

## Hangi Secret Türünü Kullanmalısınız?

**Repository Secrets** kullanın.

### Neden Repository Secrets?
- GitHub Actions workflow'u repository secrets'ı kullanır
- Build sırasında environment variables gerekiyor
- Tüm repository için geçerli olmalı

### Environment Secrets Ne Zaman Kullanılır?
- Sadece belirli environment'lar için (staging, production vb.)
- Bizim durumumuzda gerekli değil

---

## Eklenmesi Gereken Secrets

### 1. NEXT_PUBLIC_SUPABASE_URL
**Değer:** `https://vwhnqvynjyawjtkflvot.supabase.co`

**Nasıl Eklenir:**
1. GitHub repo'ya gidin
2. Settings → Secrets and variables → Actions
3. "New repository secret" butonuna tıklayın
4. Name: `NEXT_PUBLIC_SUPABASE_URL`
5. Secret: `https://vwhnqvynjyawjtkflvot.supabase.co`
6. "Add secret" butonuna tıklayın

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
**Değer:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3aG5xdnluanlhd2p0a2Zsdm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzOTY3MTgsImV4cCI6MjA4MTk3MjcxOH0.LieICFkgyASJva9kvSyCPZjWrwLuquuBLvri7WU-aYo`

**Nasıl Eklenir:**
1. Aynı sayfada (Secrets and variables → Actions)
2. "New repository secret" butonuna tıklayın
3. Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Secret: (yukarıdaki anon key'i yapıştırın)
5. "Add secret" butonuna tıklayın

---

## Adım Adım Kurulum

1. **GitHub Repository'ye gidin:**
   - https://github.com/dgdfurkan/FlowCobalt

2. **Settings'e gidin:**
   - Repo sayfasında "Settings" sekmesine tıklayın

3. **Secrets and variables → Actions:**
   - Sol menüden "Secrets and variables" → "Actions" seçin

4. **İlk Secret'ı ekleyin:**
   - "New repository secret" butonuna tıklayın
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Secret: `https://vwhnqvynjyawjtkflvot.supabase.co`
   - "Add secret"

5. **İkinci Secret'ı ekleyin:**
   - Tekrar "New repository secret" butonuna tıklayın
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Secret: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3aG5xdnluanlhd2p0a2Zsdm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzOTY3MTgsImV4cCI6MjA4MTk3MjcxOH0.LieICFkgyASJva9kvSyCPZjWrwLuquuBLvri7WU-aYo`
   - "Add secret"

---

## Doğrulama

Secret'ları ekledikten sonra:
1. GitHub Actions workflow'u otomatik çalışacak (push sonrası)
2. Veya manuel olarak "Actions" sekmesinden workflow'u çalıştırabilirsiniz
3. Build loglarında environment variables görünecek

---

## Notlar

- **Repository Secrets** kullanın (Environment Secrets değil)
- Secret'lar build sırasında environment variables olarak kullanılacak
- Secret'lar güvenli şekilde saklanır ve loglarda görünmez
- Anon key public olduğu için güvenlik riski düşük, ama yine de secret olarak saklanmalı

