/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/FlowCobalt', // GitHub Pages için repository adı subdirectory olarak kullanılıyor
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: '/FlowCobalt',
  },
}

module.exports = nextConfig
