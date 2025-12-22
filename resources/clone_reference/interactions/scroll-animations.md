# Scroll Animasyonları ve Davranışları

## Kullanılan Kütüphaneler

### GSAP (GreenSock Animation Platform)
- **CDN:** `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- **Versiyon:** 3.12.2
- **Kullanım:** Animasyon motoru

### ScrollTrigger Plugin
- **CDN:** `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`
- **Versiyon:** 3.12.2
- **Kullanım:** Scroll-triggered animasyonlar

### Split-Type
- **CDN:** `https://unpkg.com/split-type`
- **Kullanım:** Text splitting (kelimelere ayırma)

---

## Scroll Animasyon Örnekleri

### 1. Text Reveal Animation (Layout484 Section)

**Trigger Element:** `.section_layout484`

**Animasyon Detayları:**
```javascript
// Text'i kelimelere ayır
const layoutText = new SplitType(".layout484_text", { types: "words" });
const layoutTL = gsap.timeline();

// Mobil kontrolü
function isMobile() {
  return window.innerWidth <= 767;
}

// Mobil ve desktop için farklı değerler
let startValue = isMobile() ? "top 50%" : "top center";
let endValue = isMobile() ? "bottom 90%" : "bottom center";

// Animasyon
layoutTL.from(layoutText.words, {
  opacity: 0.25,                    // Başlangıç opacity
  stagger: 0.1,                      // Her kelime arası 0.1s gecikme
  scrollTrigger: { 
    trigger: ".section_layout484",    // Trigger elementi
    start: startValue,                // Animasyon başlangıcı
    end: endValue,                    // Animasyon bitişi
    scrub: 2                          // Scroll ile senkronize (2 saniye)
  }
});
```

**Davranış:**
- Scroll yaparken kelimeler yavaşça görünür
- Mobilde farklı trigger noktaları
- Smooth scroll-based animation

---

## Scroll Event Listeners

### Mobile Menu Close on Scroll

**Kod:**
```javascript
// Scroll dışında menüyü kapat
const closeOnScroll = (e) => {
  if (!anyOpen()) return;
  const t = e.target || e.srcElement;
  if (insideMenu(t)) return;     // Menü içinde scroll → izin ver
  // Overlay veya sayfa → kapat
  closeAll();
};

// Event listener'lar
document.addEventListener('scroll', closeOnScroll, { capture: true, passive: true });
window.addEventListener('scroll', closeOnScroll, { passive: true });
window.addEventListener('wheel', closeOnScroll, { passive: true });
```

**Davranış:**
- Menü açıkken sayfa scroll edilirse menü kapanır
- Menü içinde scroll edilirse kapanmaz
- Passive listener kullanılıyor (performans)

---

## Sticky/Fixed Elements

### Navigation Bar
- **Class:** `.rel-navbar_component`
- **Davranış:** Fixed positioning (sticky header)
- **Not:** Webflow'da `delete-this-class` kaldırılarak fixed yapılıyor

### Footer CTA
- **Class:** `.section_footer-cta`
- **Davranış:** Muhtemelen sticky/fixed (sayfa sonunda sabit)

---

## Scrollbar Styling

### Custom Scrollbar (Sidebar)
```css
.relevance-academy_content_sidebar::-webkit-scrollbar {
  width: 30px;
}

.relevance-academy_content_sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.relevance-academy_content_sidebar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border: 12px solid #0d162f;
  border-radius: 20px;
}

.relevance-academy_content_sidebar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
```

### Hidden Scrollbar
```css
.no-scrollbar {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none; 
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
```

---

## Scroll Trigger Parametreleri

### Start/End Değerleri
- `"top center"` - Element viewport'un üst ortasına geldiğinde
- `"top 50%"` - Element viewport'un %50'sine geldiğinde
- `"bottom 90%"` - Element viewport'un %90'ına geldiğinde
- `"bottom center"` - Element viewport'un alt ortasına geldiğinde

### Scrub Değeri
- `scrub: 2` - Scroll ile 2 saniyede senkronize animasyon
- `scrub: true` - Anında senkronize
- `scrub: false` - Scroll durduğunda animasyon

---

## Responsive Scroll Behavior

### Mobile vs Desktop
- **Mobile (≤767px):** Farklı trigger noktaları
- **Desktop:** Daha geniş trigger aralığı
- **Adaptive:** `isMobile()` fonksiyonu ile kontrol

---

## Performans Notları

- **Passive Listeners:** Scroll event'lerinde `passive: true` kullanılıyor
- **Capture Phase:** Bazı event'ler capture phase'de dinleniyor
- **Throttling:** Scroll event'leri throttle edilmeli (kodda görünmüyor ama önerilir)

---

## Özet

1. **GSAP ScrollTrigger** ile scroll-based animasyonlar
2. **Text reveal** animasyonları (kelime kelime)
3. **Sticky navigation** (fixed header)
4. **Mobile menu** scroll ile kapanma
5. **Custom scrollbar** styling
6. **Responsive** scroll davranışları

