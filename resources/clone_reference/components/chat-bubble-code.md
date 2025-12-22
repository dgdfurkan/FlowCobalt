# Chat Bubble Widget - Kod Örnekleri

## HTML Implementation

### Minimal Implementation
```html
<!-- CSS -->
<style>
.relevanceai-chat-bubble-container {
    z-index: 99999;
}
</style>

<!-- JavaScript -->
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

---

## Konfigürasyon Seçenekleri

### Temel Konfigürasyon
```json
{
  "region": "YOUR_REGION",
  "project": "YOUR_PROJECT_ID",
  "agent": "YOUR_AGENT_ID"
}
```

### Gelişmiş Konfigürasyon
```json
{
  "region": "YOUR_REGION",
  "project": "YOUR_PROJECT_ID",
  "agent": "YOUR_AGENT_ID",
  "buttonImage": "https://example.com/avatar.svg",
  "prompts": [
    "Request a tailored demo",
    "Ask a question",
    "Get started"
  ],
  "features": {
    "hidePoweredBy": true,
    "attachments": true,
    "hideLogo": true,
    "hideDescription": true
  },
  "styling": {
    "primaryColor": "#685FFF",
    "bubbleStyle": "agent",
    "inputPlaceholder": "How can I help?"
  }
}
```

---

## CSS Customization

### Container Positioning
```css
.relevanceai-chat-bubble-container {
    z-index: 99999;
    position: fixed;
    bottom: 20px;
    right: 20px;
}
```

### Custom Styling (Eğer mümkünse)
```css
.relevanceai-chat-bubble-container .chat-button {
    background-color: #685FFF;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    box-shadow: 0 4px 12px rgba(104, 95, 255, 0.3);
}

.relevanceai-chat-bubble-container .chat-button:hover {
    transform: scale(1.1);
    transition: transform 0.2s;
}
```

---

## Eski Script Formatı (Referans)

### URL Parameter Format
```html
<script defer 
  data-relevanceai-share-id="REGION/PROJECT_ID/AGENT_ID" 
  src="https://app.relevanceai.com/embed/chat-bubble.js" 
  data-share-styles="starting_message_prompts=Request+a+tailored+demo&hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=true&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=How+can+I+help%3F+&hide_logo=true&hide_description=true">
</script>
```

### Parameter Listesi
- `starting_message_prompts` - Başlangıç mesajları
- `hide_tool_steps` - Tool adımlarını gizle
- `hide_file_uploads` - Dosya yükleme gizle
- `hide_conversation_list` - Konuşma listesini gizle
- `bubble_style` - Bubble stili (agent, default, vb.)
- `primary_color` - Ana renk (hex, URL encoded)
- `bubble_icon` - Bubble icon
- `input_placeholder_text` - Input placeholder metni
- `hide_logo` - Logo gizle
- `hide_description` - Açıklama gizle

---

## Integration Notes

### Script Loading
- **Defer:** Script defer ile yükleniyor (non-blocking)
- **Async:** Alternatif olarak async kullanılabilir
- **Position:** `</body>` tag'inden önce eklenmeli

### JSON Config
- **Type:** `application/json`
- **Data Attribute:** `data-config="embed.relevanceai.com"`
- **Format:** Valid JSON (no comments)

### Error Handling
- Script yüklenemezse chat bubble görünmez
- Graceful degradation önerilir

---

## Responsive Considerations

### Mobile
- Chat bubble mobilde de görünür olmalı
- Touch-friendly boyutlar (min 44x44px)
- Bottom positioning mobilde uygun

### Desktop
- Sağ alt köşe standart konum
- Hover efektleri eklenebilir

---

## Security Notes

- **External Script:** Dış kaynaklı script kullanılıyor
- **CSP:** Content Security Policy ayarları gerekebilir
- **Privacy:** Chat verileri Relevance AI sunucularına gidiyor

