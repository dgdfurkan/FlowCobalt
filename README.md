# FlowCobalt - AI Otomasyon Hizmeti

## Proje Genel Bakış

FlowCobalt, küçük ve orta ölçekli ekiplerin operasyonel süreçlerindeki manuel işleri AI ve n8n teknolojileri ile otomatikleştiren bir hizmet sağlayıcısıdır.

## İçindekiler

- [Konumlandırma](#konumlandırma)
- [Hizmet Paketleri](#hizmet-paketleri)
- [Lead Bulma Stratejisi](#lead-bulma-stratejisi)
- [Cold Email Sistemi](#cold-email-sistemi)
- [Sorunu Anlama Kiti](#sorunu-anlama-kiti)
- [Teslimat Standardı](#teslimat-standardı)
- [Web Sitesi Yapısı](#web-sitesi-yapısı)
- [Teklif Şablonu](#teklif-şablonu)
- [Portföy Oluşturma](#portföy-oluşturma)
- [14 Günlük Yol Haritası](#14-günlük-yol-haritası)

---

## Konumlandırma

### Ana Konumlandırma Cümlesi

**"Biz, depo & operasyon ekipleri için sipariş/stock/iade süreçlerindeki manuel işleri n8n + AI ile otomatikleştirip hata oranını düşüren, süreyi kısaltan küçük otomasyonlar geliştiriyoruz."**

### Konumlandırma Formülü

```
Biz, [hedef sektör] için [süreç] kısmındaki [acı] problemini, 
[teknoloji yaklaşımı] ile [ölçülebilir sonuç] üretecek şekilde çözüyoruz.
```

### Başlangıç Nişleri

1. **E-commerce operasyonları** (depo, iade, stok, tedarik)
2. **Lojistik/dispatch** (rota, teslimat bildirimleri)
3. **B2B satış ekipleri** (lead toplama, CRM güncelleme, teklif maili)
4. **Muhasebe/evrak** (fatura, ödeme hatırlatma, rapor)

---

## Hizmet Paketleri

### Paket 1: Automation Audit (7 gün)

**Kapsam:**
- 30–45 dk görüşme + mevcut akışları çıkarma
- 10–15 maddelik "otomasyon fırsat listesi"
- 1 adet hızlı kazanım (mini otomasyon) / demo

**Çıktı:**
- PDF/Notion rapor
- Kısa Loom video

### Paket 2: 1 Sprint Automation (14 gün)

**Kapsam:**
- 1 kritik iş akışı otomasyonu (ör. sipariş → Slack bildirim → Google Sheet/CRM → mail)
- Loglama + hata yönetimi + dokümantasyon
- 2 hafta destek / bugfix

### Paket 3: Ops Automation Retainer (aylık)

**Kapsam:**
- Ayda X otomasyon + bakım + iyileştirme
- Sürekli izleme, kırılan entegrasyonları düzeltme
- Yeni ihtiyaçlara hızlı yanıt

---

## Lead Bulma Stratejisi

### Problem Sinyalleri (Lead Filtreleri)

1. **"Hiring: Operations Coordinator / Inventory Specialist / Dispatch"** ilanı → manuel iş yükü sinyali
2. **Shopify/WooCommerce mağazası büyümüş** (çok ürün / çok sipariş) → süreç tıkanır
3. **"We use Zapier/Make"** diyor ama ekip küçük → maliyet/karmaşa sinyali
4. **Sürekli "support backlog / late deliveries"** şikâyeti → süreç problemi sinyali

### En İyi Kaynaklar

- **LinkedIn** (Operations Manager, Head of Ops, Logistics Manager, Warehouse Manager)
- **Şirket web siteleri** → "team / careers / stack"
- **App/tech stack dizinleri** (Shopify store listeleri gibi)

### Hedef

Haftada 30 çok hedefli firma (rastgele 50 firma değil)

---

## Cold Email Sistemi

Detaylı şablonlar için `templates/cold-email/` klasörüne bakın.

### Mail #1: İlk Temas

**Subject Seçenekleri:**
- "Quick question about your ops workflow"
- "Reducing manual work in [warehouse/order] ops"
- "Idea to remove a daily 1–2h task (no pitch)"

### Follow-up #1: 2–3 Gün Sonra

**Subject:** "Re: quick question"

### Follow-up #2: 7 Gün Sonra (Kapanış)

**Subject:** "Closing the loop"

---

## Sorunu Anlama Kiti

### Asenkron İletişim Yaklaşımı

1. **8 soruluk mini form** (Typeform/Google Form)
2. **5 dk Loom videosu** ile "böyle anladım" de
3. **1 sayfa Scope + Timeline** gönder

### 8 Soru

1. Bu süreçte hedefiniz ne? (hız, hata azaltma, maliyet)
2. Şu an adım adım nasıl işliyor? (kısaca)
3. En çok zaman yiyen 1 adım hangisi?
4. En sık hata nerede oluyor?
5. Kullanılan araçlar: (Shopify/ERP/Sheets/Slack/Email/CRM vb.)
6. Günlük/haftalık hacim: (sipariş sayısı, ticket sayısı vb.)
7. Kimler kullanacak? (rol sayısı)
8. Başarı metriği: "X % daha hızlı / Y hata daha az" gibi ne istersiniz?

---

## Teslimat Standardı

Her proje otomatik olarak "case study"ye çevrilir.

### Case Study Formatı (Tek Sayfa)

1. **Problem** (1 paragraf)
2. **Eski süreç** (3 madde)
3. **Çözüm** (mimari şema + akış)
4. **Sonuçlar** (metrikler: süre, hata, maliyet)
5. **Stack** (n8n, API'ler, DB vs.)
6. **Ekran görüntüsü / kısa demo videosu**

**Not:** Metrik yoksa bile "Günde 2 saat manuel iş → 10 dk kontrol" gibi kaba ama dürüst ölçüm koy.

---

## Web Sitesi Yapısı

### Site Haritası

1. **Home**
2. **Services** (Paketler)
3. **Case Studies**
4. **Process** (Nasıl çalışıyoruz?)
5. **About** (kimsiniz, neden güven?)
6. **Contact** (form + takvim linki)

### Home Sayfası Metin İskeleti

**Hero:**
- **Başlık:** "Manual ops work → automated workflows in days, not months."
- **Alt başlık:** "We build practical AI + n8n automations that reduce errors and free up your team's time."
- **CTA:** "Get a 7-day Automation Audit"

**Güven Blokları:**
- "Fast delivery (1–2 weeks)"
- "Async-first communication (works across time zones)"
- "Documentation + monitoring included"

**Case Study Teaser Kartları:** 3 adet

**Process:** Discover → Build → Deploy → Support

**Footer:** "Data privacy / NDA available"

---

## Teklif Şablonu

Detaylı şablon için `templates/proposal-template.md` dosyasına bakın.

### Teklif İçeriği (1 Sayfa)

1. **Goal:** (1 cümle)
2. **Scope:** (şunlar var / şunlar yok)
3. **Deliverables:** (otomasyon, dashboard, dokümantasyon, video)
4. **Timeline:** (gün gün)
5. **Price:** (tek sefer / aylık)
6. **Assumptions:** (API erişimi, kullanıcı yetkisi vs.)
7. **Support:** (X gün)

---

## Portföy Oluşturma

### İlk 3 Case Study İçin Strateji

1. **Kendi Getir/depo deneyiminizden** anonimleştirilmiş vaka
2. **"Demo company" değil:** gerçekçi ama isim vermeden ("Mid-size ecommerce in EU")
3. **Açık veriyle mini otomasyon:** "support mail → etiketle → sheet → Slack" demosu

**Önemli:** "Biz bunu yapabiliyoruz"u göstermek.

---

## 14 Günlük Yol Haritası

### Gün 1–2
- Konumlandırma + paketler + teklif şablonu

### Gün 3–4
- Web site (Home + Services + 1 case study)

### Gün 5
- Lead list (30 firma) + rol bazlı kişi bulma

### Gün 6–12
- Günlük 10 hedefli mail + follow-up sistemi

### Gün 8–14
- Gelen cevaplara audit satışı + 1 demo üretimi

### Sürekli
- Her proje bitince: Case study yaz → siteye ekle → sosyal kanıt birikir

---

## Felsefe

**"AI otomasyon" satmıyoruz; zaman ve hata satıyoruz.**

Müşterinin zihninde para harcamak değil, kayıp kaçak kapatmak oluyor.

