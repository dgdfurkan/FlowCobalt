export interface Product {
  id: string
  slug: string
  title: string
  description: string
  excerpt: string
  videos: string[] // Cloudinary video URLs (max 15 seconds each, will loop)
  category?: string
  featured?: boolean
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'panela',
    title: 'Panela - E-Ticaret Yönetim ve Araştırma Platformu',
    description: `Panela, e-ticaret girişimcileri için tasarlanmış, yapay zeka destekli bir iş yönetim ve araştırma platformudur. Sistem, ürün keşfinden pazarlama stratejilerine kadar e-ticaret süreçlerini otomatikleştirir ve yapay zeka ile destekler.

**Yapay Zeka Özellikleri:**
- **Akıllı Reklam Analiz Asistanı (Creative Lab):** Google Gemini yapay zeka modeli ile reklam metinlerinizi analiz eder, hedef kitlenizi optimize eder ve pazarlama stratejileri sunar
- **Otomatik Quiz Oluşturucu (Academy):** Eğitim içeriklerinizden otomatik olarak quiz soruları üretir (boşluk doldurma, eşleştirme, çoktan seçmeli)

**Otomasyon Özellikleri:**
- **Otomatik Meta Reklam Tarayıcı (Research):** Facebook ve Instagram'da aktif reklam veren şirketleri otomatik bulur ve ürünleri veritabanınıza ekler
- **Akıllı Ürün Puanlama Sistemi (Winner Hunter):** Bulduğunuz ürünleri 0-100 arası otomatik puanlar (sorun çözme, kar marjı, trend analizi, sosyal medya etkileşimi)
- **Otomatik Veri Düzenleme:** Veritabanınızdaki eski formatlı linkleri yeni formata otomatik taşır

**Avantajlar:**
- Manuel araştırma yerine otomatik sistemler ile zaman tasarrufu
- Yapay zeka destekli pazarlama ve ürün stratejileri
- Güvenli veri saklama (Supabase)
- Yüzlerce ürün ve reklamı tek platformda yönetme`,
    excerpt: 'E-ticaret girişimcileri için yapay zeka destekli ürün keşfi, reklam analizi ve otomatik araştırma platformu. Excel yerine modern bir çözüm.',
    videos: [
      'https://res.cloudinary.com/dppf64uyp/video/upload/v1766576155/Ekran_Kayd%C4%B1_2025-12-24_14.33.28_nw3zgk.mov',
    ],
    category: 'E-Commerce Management',
    featured: true,
  },
  {
    id: '2',
    slug: 'barcode-app',
    title: 'Barkod Uygulaması - Kurumsal Bayi Yönetim Sistemi',
    description: `Kurumsal firmaların bayileri için tasarlanmış, ürün barkodlarına kolay ve hızlı erişim sağlayan yönetim sistemidir. Bayiler, ürünlerin barkod bilgilerine anında erişebilir ve işlemlerini hızlandırabilir.

**Özellikler:**
- Hızlı barkod arama ve erişim
- Ürün bilgilerine anında erişim
- Kurumsal bayi yönetimi
- Kolay kullanıcı arayüzü

**Faydalar:**
- Barkod bilgilerine hızlı erişim
- İşlem sürelerinde azalma
- Daha verimli bayi yönetimi
- Kullanıcı dostu arayüz`,
    excerpt: 'Kurumsal firmaların bayileri için ürün barkodlarına kolay ve hızlı erişim sağlayan yönetim sistemi.',
    videos: [
      'https://res.cloudinary.com/dppf64uyp/video/upload/v1764716003/updates/wxb01kgcd2ldkxocpr6a.mov',
    ],
    category: 'Enterprise Solutions',
    featured: true,
  },
]

// Helper function to get featured products (for homepage)
export function getFeaturedProducts(limit: number = 3): Product[] {
  return products.filter(p => p.featured).slice(0, limit)
}

// Helper function to get product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(product => product.slug === slug)
}

