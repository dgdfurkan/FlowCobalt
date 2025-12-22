/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/FlowCobalt', // GitHub Pages için repository adı subdirectory olarak kullanılıyor
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig

