/** @type {import('next').NextConfig} */
const nextConfig = {
  // standalone нужен только для Dockerfile (COPY .next/standalone).
  // Реальный прод-деплой — PM2 + `next start`, который с output:"standalone"
  // не работает ("next start does not work with output: standalone").
  // Включаем standalone только когда собираем именно докер-образ.
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" } : {}),
  images: {
    // Оптимизация включена: AVIF/WebP + ресайз под устройство.
    // Требует пакет sharp в production (добавлен в dependencies).
    formats: ["image/avif", "image/webp"],
    qualities: [75, 95, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      // Resolve legacy section URLs before React starts streaming the page.
      {
        source: "/products/polystyrene/ps-:section/:path*",
        destination: "/products/polystyrene/:section/:path*",
        permanent: true,
      },
      ...["injection", "extrusion"].flatMap((method) =>
        [method, `${method}-parts`].map((alias) => ({
          source: `/products/machine-parts/${alias}/:path*`,
          destination: `/products/machine-parts/parts-${method}/:path*`,
          permanent: true,
        }))
      ),
      {
        source: "/news/:path*",
        destination: "/about/news/:path*",
        permanent: true,
      },
    ]
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      // Next.js использует inline-скрипты для гидрации; eval нужен в dev-режиме.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.hh.ru https://etpgpb.ru https://new.etpgpb.ru https://va.vercel-scripts.com",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://yandex.ru https://*.yandex.ru https://yandex.com",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'self'",
      "form-action 'self'",
    ].join("; ")

    const security = [
      { key: "X-DNS-Prefetch-Control", value: "on" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      { key: "Content-Security-Policy", value: csp },
    ]
    if (process.env.NODE_ENV === "production") {
      security.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      })
    }
    // Эти имена файлов не содержат хеш: заменённое фото должно обновляться.
    // Хешированные ресурсы /_next/static по-прежнему кэширует Next.js.
    const mediaCache = [
      { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" },
    ]

    return [
      {
        source: "/:path*",
        headers: security,
      },
      { source: "/videos/:path*", headers: mediaCache },
      { source: "/images/:path*", headers: mediaCache },
      { source: "/prevyu/:path*", headers: mediaCache },
      {
        source: "/locales/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
        ],
      },
    ]
  },
}

export default nextConfig
