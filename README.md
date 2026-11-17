# faleir0x.com

Portfólio de Cauê Faleiros. Next.js com export estático no Cloudflare Pages, mais uma Pages Function (`functions/api/now-playing.ts`) para o quadro do Spotify.

## Rodar

Node 26 e pnpm 11.26.0.

```bash
pnpm install
pnpm dev        # http://localhost:3000 (sem a Function: o Spotify mostra um exemplo)
pnpm build      # gera out/ e fecha o CSP do out/_headers
pnpm preview    # build + Cloudflare local em http://127.0.0.1:8788, com a Function (precisa do .dev.vars)
```

O conteúdo (perfil, projetos, livros, experiência, ferramentas, textos) fica em `content/`.

## Deploy

O Cloudflare Pages (projeto `website`) publica a cada push na `main`. No painel:

- **Build command:** `pnpm build` (a pasta de saída `out` vem do `wrangler.toml`)
- **Variável de build:** `PNPM_VERSION` = `11.26.0`
- **Secrets:** `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`
