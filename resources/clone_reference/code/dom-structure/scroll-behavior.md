# Scroll Davranışları ve Animasyonlar

## Kullanılan Kütüphaneler

- **GSAP** (GreenSock Animation Platform)
- **ScrollTrigger** (GSAP plugin)
- **Split-Type** (Text splitting for animations)

## Scroll Animasyon Tipleri

## Scroll Event Listeners

### ScrollTrigger Animations

```javascript
ScrollTrigger plugin, Split-Type library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/split-type"></script>

<script>
document.addEventListener('DOMContentLoaded', function() {
// Function to check if the viewport width is 767px or less
function isMobile() {
  return window.innerWidth <= 767;
}
```

### ScrollTrigger Animations

```javascript
scrollTrigger: { 
    trigger: ".section_layout484",
    // Trigger animation when .section_layout484 reaches certain part of the viewport
    start: startValue,
    // End animation when .section_layout484 reaches certain part of the viewport
    end: endValue,
    // Smooth transition based on scroll position
    scrub: 2
  }
```

### Scroll Events

```javascript
scrollbar */
.no-scrollbar {
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none; 
}
```

### Scroll Events

```javascript
scrollbar::-webkit-scrollbar {
    display: none;
}
```

### Scroll Events

```javascript
Scrollbars on sidebar*/
.relevance-academy_content_sidebar::-webkit-scrollbar {
  width: 30px; /* Width of the scrollbar */
}
```

## Sticky/Fixed Elements

