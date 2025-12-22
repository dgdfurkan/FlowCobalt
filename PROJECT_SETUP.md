# Proje Kurulum Adımları

## Proje Promptu: GitHub Pages Üzerinde Yayınlanan, Supabase Destekli Admin + Ziyaret Analitiği + Telegram Bildirimli Web Site

### 0) Rol ve Amaç

**Rol:** Kıdemli Full-Stack / Web Sistem Mimarı gibi davran.

**Amaç:** Örnek bir web sitesini (aşağıda linki verilecek) uçtan uca inceleyip, tasarım + sayfa yapısı + içerik kurgusu + component/resource düzeni açısından "klonlanabilir" bir temel oluşturmak. Aynı zamanda yeni sitemizde admin panel, Supabase tabanlı veri & auth, ziyaretçi takibi, sayfa/etkileşim takibi, Telegram bildirimleri ve GitHub Pages uyumu gereksinimlerini karşılamak.

**Not:** Bu projede "site statik yayınlanacak" (GitHub Pages) ama "ziyaretçi takibi ve Telegram bildirimleri" gibi işlevler için arka uç (backend) gerekecek. Bu nedenle tasarım statik site + dış servis/edge function mantığıyla kurulmalı.

---

### 1) Girdi: İncelenecek Örnek Site

Kullanıcı örnek site linkini paylaşacak: `[EXAMPLE_SITE_URL]`

#### İnceleme kapsamı:

- Tüm sayfalar, alt sayfalar, footer linkleri, blog/faq varsa hepsi
- Header / navigasyon / menü yapısı
- Tipografi, renkler, spacing sistemi, buton ve kart stilleri
- Animasyon/motion (varsa) ve component etkileşimleri
- CTA (Call-to-action) kurgusu, içerik dili, bölümler arası akış
- Kullanılan UI pattern'ları (pricing, testimonials, case studies, vb.)

---

### 2) "Resource/Clone Klasörü" Oluşturma Gereksinimi

Örnek site incelendikten sonra, bizim projede ayrı bir klasör açılacak:

```
/resources/clone_reference/
```

Bu klasörde "örnek siteden çıkarılan" veriler düzenli ve tekrar kullanılabilir biçimde saklanacak. Amaç: Ben daha sonra senden bir şey istediğimde, "bu örnek site referansına göre" tasarımsal/mantıksal analiz yapabilmen.

#### 2.1. Klasörde tutulacak veri türleri (önerilen format serbest)

Aşağıdaki başlıkların her biri için ayrı dosya/alt klasör mantığıyla düzenle:

**Sitemap & Sayfa Envanteri**
- Sayfa listesi (URL, sayfa amacı, ana bölümler)
- Sayfa sıralaması ve kullanıcı akışı

**Component Kataloğu**
- Header çeşitleri, hero blokları, kart tipleri, CTA blokları, pricing, FAQ, testimonial, feature list, footer varyasyonları
- Her component için: kullanım yeri, içerik yapısı, görsel kuralları

**Design Tokens**
- Renk paleti
- Tipografi (font aileleri, başlık/body ölçekleri)
- Spacing ölçü sistemi (padding/margin mantığı)
- Border radius, shadow, gradient stilleri

**Kopya Metin / Ton / Microcopy**
- CTA cümle kalıpları
- Başlık/alt başlık formülleri
- Buton etiketleri ve yönlendirmeler

**Etkileşim & Davranış Notları**
- Menü davranışı, scroll davranışı, sticky header vb.
- Form davranışları, hata mesajları, onay mesajları

**Not:** Bu klasör "kod deposu" değil; analiz ve referans verisi deposu.

---

### 3) Hedef Site: Genel Mimari Gereksinimler

#### 3.1. Yayınlama

- Site GitHub Pages üzerinde yayınlanacak.
- Sonradan domain taşınacak; mimari buna uygun olmalı.
- Build çıktısı statik üretilebilmeli (static hosting uyumlu).

#### 3.2. Teknoloji Seçimi (Kararı sen ver)

- Performanslı, sorunsuz, sürdürülebilir.
- Statik hosting ile uyumlu.
- Admin panel + tracking için gerekli entegrasyonlara uygun.

**Kritik not:** GitHub Pages ortamında sunucu çalışmaz. Bu yüzden:

- Admin auth / DB / Telegram bildirimleri / IP yakalama gibi şeyler client'ta gizli anahtar gerektiriyorsa, bunu client'a koymak güvenlik açığıdır.
- Bu tür gizli işler mutlaka Supabase Edge Function / Cloudflare Worker / benzeri serverless/edge tarafta yapılmalı.

---

### 4) Admin Panel Gereksinimleri

#### 4.1. Erişim Kuralları

- Sadece admin hesabı olanlar giriş yapabilsin.
- Admin olmayan, hesabı olmayan hiç kimse admin paneli kullanamasın.
- Adminleri:
  - Hem panel üzerinden yönetebilmek,
  - Hem de manuel olarak Supabase üzerinden eklemek istiyorum.

#### 4.2. Supabase Bağımlılığı "Kırılmamalı"

Supabase entegrasyonu yoksa / erişilemiyorsa site patlamamalı.

Yani:

- Public site içerikleri çalışmalı (veya makul "servis geçici olarak devre dışı" davranışı).
- Admin panel ve tracking gibi özellikler Supabase yokken "graceful degrade" etmeli:
  - Admin sayfası açılmasın / erişim engellensin / "yetkilendirme servisi yok" gibi kontrollü mesaj versin.
  - Ziyaret takibi çalışmıyorsa sessizce devre dışı kalabilsin.

#### 4.3. Admin Panelin Siteye Etkisi

- Admin panelde yapılan değişiklikler public site içeriğine yansımalı.
- Sayfa yenilendiğinde güncel içerik görünmeli (yakın gerçek zamanlı mantık).
- İçerik yönetimi (CMS benzeri) ihtiyacı:
  - Hangi sayfada hangi metin/görsel/CTA var → admin panelden değiştirilebilir olmalı (kapsamı sonra netleşebilir).

---

### 5) Ziyaretçi Takibi (IP + Ziyaret + Etkileşim)

Bu projenin en kritik parçası.

#### 5.1. IP Kaydı: Temel İstek

Siteye herhangi bir yeni kullanıcı girdiğinde:

- Kullanıcının IP adresi kaydedilecek.
- Eğer bu IP daha önce hiç görülmediyse → "yeni ziyaretçi" olarak işaretlenecek.
- Eğer daha önce görülmüşse → bu kez "tekrar ziyaret" olarak kaydedilecek ve tarih/saat güncellenecek.

#### 5.2. Ziyaret Tanımı (Net Davranış Kuralları)

Aşağıdaki kurallar aynı anda sağlanmalı:

**Sayfa yenileme (refresh) = yeni ziyaret olarak sayılabilir**
- Kullanıcı sayfayı yenilediğinde yeni bir "ziyaret kaydı" oluşsun.

**Sekme değiştirip geri gelmek = yeni ziyaret sayılmamalı**
- Aynı sekme içinde kullanıcı başka sekmeye gidip geri döndüğünde bildirim gelmesin.
- Bu durum "hala aktif oturum" gibi kabul edilecek.

**Site içinde route/section geçişi = ziyaret değil, "sayfa görüntüleme/etkileşim" olmalı**
- Örn. "Hakkımızda" bölümüne gitti → bu bir "event/pageview" kaydıdır.
- "Yeni ziyaret" tetiklemesin (aksi halde spam olur).

#### 5.3. Konum Bilgisi (IP Geo)

Mümkünse IP'den şu bilgiler çıkarılsın:

- Ülke, şehir (ve varsa yaklaşık bölge)
- Bu veri, "IP nedir" sitelerinin verdiği gibi yaklaşık konum seviyesinde olabilir.

**Not:** Bu bilgi için ya güvenilir bir servis kullanılmalı (ör. IP geolocation sağlayıcısı) ya da edge platformunun sağladığı geo header'ları değerlendirilmeli. Güvenlik ve doğruluk önemli.

#### 5.4. Hangi Sayfalara/Bölümlere Girdi (Event Tracking)

Ziyaretçinin sitede gezindiği yerler kaydedilsin:

- Örn: "About'a tıkladı", "Pricing'e girdi", "Case Studies'e geçti", vb.
- Ayrıca buton tıklamaları da loglanabilsin:
  - "CTA butonuna bastı"
  - "Contact form açtı" vb.

**Not:** Süre tutma (time on page) şimdilik opsiyon dışı. İleride eklenebilir.

---

### 6) Telegram Bildirim Sistemi

#### 6.1. Bildirim İçeriği

Ziyaret olduğunda Telegram'a tatlı, emojili bir mesaj atılsın.

**Örnek davranış:**

**İlk kez gelen IP:**
```
🆕 Yeni ziyaretçi: [IP] — [Country/City] — [Date/Time]
```

**Daha önce gelen IP tekrar gelirse:**
```
🔁 Tekrar ziyaret: [IP] — [Country/City] — [Visit count / N. ziyaret] — [Date/Time]
```

#### 6.2. Bildirim Hedefleri

Bildirimler:

- Kullanıcının belirlediği bot token ile,
- Kullanıcının belirlediği chat id listesine gönderilecek.

#### 6.3. Admin Panel Üzerinden Ayarlar

Admin panelde bir "Settings" bölümü olacak:

- Telegram bildirimleri açık/kapalı
- Bot token yönetimi (güvenli şekilde)
- Chat ID listesi yönetimi

**Kritik güvenlik:** Bot token client'a gömülmemeli. Aksi halde herkes token'ı ele geçirir.

#### 6.4. Sessize Alma (Mute / Ignore IP List)

Admin panelde bir "Muted IPs" listesi olacak.

Bu listedeki IP'ler siteye girse bile:

- Ziyaret kaydı tutulabilir (opsiyon),
- Telegram bildirimi gönderilmemeli (zorunlu).

---

### 7) Veri Modeli (Supabase'de Tutulacak Yapıların Mantığı)

Aşağıdaki veri yapıları konsept olarak tasarlanmalı (isimler değişebilir):

**Admins / Users**
- Admin kullanıcılar ve roller

**Visitors**
- IP (tercihen güvenli formatta), ilk görüldü zamanı, son görüldü zamanı
- Geo info (ülke/şehir)
- Toplam ziyaret sayısı

**Visits**
- Her "ziyaret olayı" için kayıt:
  - visitor_id
  - timestamp
  - visit_number (ör. 1,2,3)
  - tetik tipi: page_load / refresh gibi

**Events / PageViews**
- Ziyaretçi site içinde nereye gitti?
  - route/section adı (About, Pricing…)
  - event type (pageview, click, vb.)
  - timestamp
  - opsiyonel metadata (hangi buton, hangi CTA)

**Settings**
- Telegram ayarları (enabled, chat ids…)
- Muted IP listesi
- Diğer sistem ayarları

---

### 8) "IP'yi Nereden Alacağız?" ve Doğru Yöntem Prensibi

Bu projede en kritik teknik gerçek:

**IP adresi tarayıcıdan güvenilir şekilde alınamaz.**

IP'yi doğru almak için istek sunucu/edge tarafında görülmeli.

Bu yüzden önerilen mantık:

1. Site, bir "tracking endpoint"e istek atar.
2. Endpoint:
   - IP'yi request üzerinden yakalar,
   - Geo'yu üretir,
   - Supabase'e yazar,
   - Gerekirse Telegram bildirimi atar.

**GitHub Pages statik olduğu için bu endpoint şunlardan biri olmalı:**

- Supabase Edge Functions
- Cloudflare Workers
- Başka güvenli serverless çözüm

---

### 9) "Ziyaret" Algoritması: Spam'i Engelleyen Mantık

Aşağıdaki davranış hedeflenmeli:

- Yeni ziyaret kaydı sadece "ilk yükleme / refresh" anında oluşsun.
- Aynı sekmede route/section değişimi "event" olarak kaydolmalı; ziyaret sayılmamalı.
- Sekme arkaplana gidip geri gelince yeni ziyaret sayılmamalı.
- Mute listesi bildirim spamini engellemeli.

**Not:** Kullanıcı davranışları dünyası kaotik: aynı IP'yi birden çok kişi kullanabilir (CGNAT), IP değişebilir (mobil), VPN olabilir. Bu nedenle "IP = kişi" değildir; ama istenen çözüm IP bazlı olduğundan sistem IP'yi "visitor key" olarak kullanacaktır.

---

### 10) Güvenlik ve Operasyon Notları (Kısa ama Hayati)

- Telegram bot token gibi gizli değerler frontend'de bulunmamalı.
- Admin panel erişimi kesin kilitli olmalı.
- Tracking endpoint suistimal edilmemeli (rate limit / basic validation).
- Yurt dışı hedefleniyorsa, IP ve geo verisi "kişisel veri" sayılabilir; minimum veri ve şeffaflık prensibi düşünülmeli (en azından ileride bir "Privacy" sayfası opsiyonu).

---

### 11) Çıktı Beklentileri

Bu prompt uygulandığında şu çıktılar üretilecek:

1. Örnek sitenin ayrıntılı analizi (tüm sayfalar, component'ler, design tokens, içerik dili)
2. `/resources/clone_reference/` altında düzenli referans dokümantasyonu
3. GitHub Pages uyumlu public site iskeleti + admin panel yaklaşımı
4. Supabase entegre olduğunda çalışan; entegre değilken bozulmayan yapı
5. IP tabanlı visitor/visit/event tracking tasarımı
6. Telegram bildirim + mute list + admin ayar yönetimi tasarımı

---

### 12) Kabul Kriterleri (Başarı Tanımı)

- [ ] Örnek site incelenmiş ve referans klasörde ayrıntılı veri olarak saklanmış
- [ ] Public site Supabase yokken de "kırılmadan" çalışıyor
- [ ] Admin panel yalnızca admin kullanıcılarla erişilebilir
- [ ] Yeni IP ilk kez gelince "yeni ziyaretçi" olarak kaydediliyor
- [ ] Aynı IP tekrar gelince "tekrar ziyaret" olarak sayılıyor ve numaralandırılıyor
- [ ] Refresh yeni visit üretebiliyor
- [ ] Sekme değiştirip geri gelme yeni visit üretebiliyor
- [ ] Site içi gezinti (About'a gitme vb.) event olarak kaydoluyor
- [ ] Telegram bildirimleri ayarlara göre gidiyor
- [ ] Muted IP'ler bildirim üretmiyor
- [ ] Bot token gibi gizli bilgiler frontend'de açık edilmiyor
- [ ] GitHub Pages üzerinde yayın akışı sorunsuz

---

## Kullanım Notu

Bu doküman bundan sonra "ana referans prompt" gibi kullanılabilir. Örnek site linkini gönderdiğin an, bu promptun 1. ve 2. bölümünü (tam analiz + resource klasörü envanteri) eksiksiz çalıştıracak şekilde ilerlenir.

