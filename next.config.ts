import type { NextConfig } from "next";

/*
 * Cloudflare Pages, como o website-portfolio: o site é estático (out/) e o que precisa de segredo
 * roda numa Pages Function (functions/api/now-playing.ts).
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  // Pages serve /x/ como /x/index.html; com barra no fim os links batem com os arquivos gerados
  trailingSlash: true,
  // sem servidor de imagens no export estático: as imagens já são servidas otimizadas (webp)
  images: { unoptimized: true },
};

export default nextConfig;
