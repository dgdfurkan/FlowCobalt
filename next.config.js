/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // GitHub Pages için basePath gerekli değil (root domain kullanılıyorsa)
  // Eğer subdirectory kullanılacaksa: basePath: '/repository-name'
}

module.exports = nextConfig

