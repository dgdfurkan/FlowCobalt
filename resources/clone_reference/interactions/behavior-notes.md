# Relevance AI - Etkileşim ve Davranış Notları

## Menü Davranışı

### Navigation
- **Sticky Header:** Scroll'da üstte sabit kalıyor
- **Dropdown Menüler:** Hover'da açılıyor
- **Mobil:** Hamburger menu ile açılıyor
- **Smooth Transitions:** Menü geçişleri yumuşak

## Scroll Davranışı

**Detaylı dokümantasyon:** `/interactions/scroll-animations.md`

### Genel
- **Smooth Scroll:** Sayfa içi linklerde smooth scroll
- **Section Geçişleri:** Yumuşak geçişler
- **GSAP ScrollTrigger:** Scroll-based animasyonlar
- **Text Reveal:** Kelime kelime görünme animasyonları
- **Sticky Navigation:** Scroll'da üstte sabit header

### Scroll Animasyonları
- **Kütüphaneler:** GSAP 3.12.2 + ScrollTrigger + Split-Type
- **Trigger:** `.section_layout484` elementi
- **Scrub:** Scroll ile senkronize animasyon (2 saniye)
- **Responsive:** Mobil ve desktop için farklı trigger noktaları

### Scroll Event Listeners
- **Menu Close:** Scroll'da açık menü kapanıyor
- **Passive Listeners:** Performans için passive event listener'lar

## Form Davranışları

### CTA Butonları
- **Hover Efekti:** Renk değişimi, hafif scale
- **Click Feedback:** Anında görsel geri bildirim
- **Loading State:** (İncelenecek - form submit durumları)

## Hata Mesajları
(Form sayfalarında incelenecek)

## Onay Mesajları
(Form submit sonrası incelenecek)

## Animasyonlar

### Page Load
- **Fade In:** İçerik yumuşak şekilde görünüyor
- **Stagger:** Elementler sırayla görünüyor (varsa)

### Hover Effects
- **Butonlar:** Renk değişimi, hafif scale
- **Kartlar:** Hafif yükselme (shadow artışı)
- **Linkler:** Renk değişimi, underline (varsa)

---

## Responsive Davranış

### Mobile
- **Navigation:** Hamburger menu
- **Grid:** Tek kolon
- **Spacing:** Azalıyor ama oran korunuyor

### Tablet
- **Navigation:** Hamburger veya compact menu
- **Grid:** 2 kolon (bazı section'larda)

### Desktop
- **Full Navigation:** Tüm menü öğeleri görünür
- **Grid:** 3-4 kolon (içeriğe göre)

---

## Notlar
- **Modern, smooth interactions**
- **Kullanıcı dostu feedback**
- **Performance odaklı (hafif animasyonlar)**

