#!/usr/bin/env node
/*
 * Depois do `next build`: fecha o Content-Security-Policy do out/_headers.
 *
 * O export estático do Next escreve scripts inline em cada página (o boot do tema/idioma do
 * app/layout.tsx e o payload do React), e eles mudam a cada build. Este script lê todo HTML de out/,
 * calcula o sha256 de cada <script> inline e troca o marcador __SCRIPT_HASHES__ do _headers pela
 * lista. Um script inline que não estiver nessa lista o navegador bloqueia.
 *
 * Falha (e o deploy não sai) se o marcador sumir ou se a linha passar do limite do Cloudflare Pages
 * (2.000 caracteres por linha do _headers).
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../out", import.meta.url));
const MARKER = "__SCRIPT_HASHES__";
const LINE_LIMIT = 2000;

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

const hashes = new Set();
for (const file of htmlFiles(OUT)) {
  const html = readFileSync(file, "utf8");
  for (const [, attrs, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=/.test(attrs) || body.length === 0) continue;
    hashes.add(`'sha256-${createHash("sha256").update(body).digest("base64")}'`);
  }
}

const headersPath = join(OUT, "_headers");
const headers = readFileSync(headersPath, "utf8");
const markers = headers.split(MARKER).length - 1;
if (markers !== 1) {
  console.error(`csp: ${MARKER} precisa aparecer uma vez em out/_headers (achei ${markers}); public/_headers mudou?`);
  process.exit(1);
}
const result = headers.replace(MARKER, [...hashes].sort().join(" "));
const longest = Math.max(...result.split("\n").map((l) => l.length));
if (longest > LINE_LIMIT) {
  console.error(`csp: a linha do CSP ficou com ${longest} caracteres (limite do Cloudflare: ${LINE_LIMIT})`);
  process.exit(1);
}
writeFileSync(headersPath, result);
console.log(`csp: ${hashes.size} scripts inline liberados por hash (linha mais longa: ${longest} caracteres)`);
