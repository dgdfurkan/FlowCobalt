# Chat Bubble Widget

## Genel Bakış

Relevance AI sitesinde sağ alt köşede bir chat bubble/widget bulunuyor. Bu widget, ziyaretçilerin AI agent ile sohbet etmesini sağlıyor.

---

## CSS Styling

### Container
```css
.relevanceai-chat-bubble-container {
    z-index: 99999;
}
```

**Not:** Çok yüksek z-index değeri, chat bubble'ın her zaman en üstte görünmesini sağlıyor.

---

## JavaScript Embed

### Aktif Kullanılan Script

```html
<script defer src="https://embed.relevanceai.com/script.js"></script>
<script data-config="embed.relevanceai.com" type="application/json">
  {
    "region": "f1db6c",
    "project": "171876085774-435c-a088-dfa345099d17",
    "agent": "f3213730-ff41-4878-a92c-82ef8e74aada",
    "buttonImage": "https://cdn.jsdelivr.net/gh/RelevanceAI/content-cdn@latest/agents/agent_avatars/agent_avatar_13.svg",
    "prompts": ["Request a tailored demo"],
    "features": {
      "hidePoweredBy": true,
      "attachments": true
    }
  }
</script>
```

### Konfigürasyon Parametreleri

#### Temel Ayarlar
- **region:** `"f1db6c"` - Bölge/region kodu
- **project:** `"171876085774-435c-a088-dfa345099d17"` - Proje ID'si
- **agent:** `"f3213730-ff41-4878-a92c-82ef8e74aada"` - Agent ID'si

#### Görsel Ayarlar
- **buttonImage:** Chat bubble butonunun görseli
  - URL: `https://cdn.jsdelivr.net/gh/RelevanceAI/content-cdn@latest/agents/agent_avatars/agent_avatar_13.svg`
  - SVG formatında agent avatar'ı

#### Özellikler
- **prompts:** Başlangıç mesajları
  - `["Request a tailored demo"]` - Demo talebi için hazır mesaj
- **features:**
  - `hidePoweredBy: true` - "Powered by" yazısını gizle
  - `attachments: true` - Dosya ekleme özelliği aktif

---

## Eski Script (Yorum Satırında)

```html
<!-- <script defer 
  data-relevanceai-share-id="f1db6c/171876085774-435c-a088-dfa345099d17/f3213730-ff41-4878-a92c-82ef8e74aada" 
  src="https://app.relevanceai.com/embed/chat-bubble.js" 
  data-share-styles="starting_message_prompts=Request+a+tailored+demo&hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=true&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=How+can+I+help%3F+&hide_logo=true&hide_description=true" >
</script> -->
```

### Eski Script Parametreleri (Referans)
- **data-share-styles:** URL encoded stil parametreleri
  - `starting_message_prompts=Request+a+tailored+demo`
  - `hide_tool_steps=false`
  - `hide_file_uploads=false`
  - `hide_conversation_list=true`
  - `bubble_style=agent`
  - `primary_color=%23685FFF` (mor renk: #685FFF)
  - `bubble_icon=pd%2Fchat`
  - `input_placeholder_text=How+can+I+help%3F+`
  - `hide_logo=true`
  - `hide_description=true`

---

## Davranış

### Konum
- **Pozisyon:** Sağ alt köşe (fixed)
- **Z-index:** 99999 (en üstte)

### Özellikler
- **AI Agent Chat:** Ziyaretçiler AI agent ile sohbet edebilir
- **Demo Request:** Hazır "Request a tailored demo" mesajı
- **File Attachments:** Dosya ekleme desteği
- **Custom Avatar:** Agent avatar görseli

### Stil
- **Primary Color:** Mor (#685FFF)
- **Bubble Style:** Agent stili
- **Logo:** Gizli (`hidePoweredBy: true`)

---

## Kullanım Senaryosu

1. Ziyaretçi chat bubble'a tıklar
2. Chat penceresi açılır
3. Hazır "Request a tailored demo" mesajı gösterilir
4. Ziyaretçi AI agent ile sohbet edebilir
5. Dosya ekleyebilir (attachments: true)

---

## Notlar

- **Embed Script:** Relevance AI'nin kendi embed sistemi kullanılıyor
- **Defer Loading:** Script defer ile yükleniyor (sayfa yüklemesini engellemez)
- **JSON Config:** Konfigürasyon JSON formatında script tag içinde
- **Custom Domain:** `embed.relevanceai.com` subdomain'i kullanılıyor

