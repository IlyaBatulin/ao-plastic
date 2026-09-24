import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
import dotenv from 'dotenv'

// Read-only inventory and HTTP audit. Never prints credentials or cookies.
const root = process.cwd()
const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean)
const sourceFiles = files.filter(f => /\.(tsx?|jsx?|json|mjs|css)$/.test(f) && !f.endsWith('lock.json') && !f.startsWith('scripts/'))
const source = sourceFiles.filter(f => fs.existsSync(f)).map(f => fs.readFileSync(f, 'utf8')).join('\n')
const assets = files.filter(f => f.startsWith('public/') && fs.existsSync(f)).map(file => ({ file, bytes: fs.statSync(file).size }))
const sameSize = Map.groupBy(assets, a => a.bytes)
const duplicates = []
for (const candidates of sameSize.values()) {
  if (candidates.length < 2) continue
  const hashes = Map.groupBy(candidates, a => crypto.createHash('sha256').update(fs.readFileSync(a.file)).digest('hex'))
  for (const identical of hashes.values()) if (identical.length > 1) duplicates.push(identical.map(a => a.file))
}
const refs = [...new Set([...source.matchAll(/["'`](\/(?:images|videos|prevyu|docs)\/[^"'`<>\n]+\.(?:png|jpg|jpeg|webp|svg|mp4|pdf))(?:\?[^"'`]*)?["'`]/g)].map(m => m[1]))]
const missing = refs.filter(ref => !ref.includes('${') && !fs.existsSync(path.join(root, 'public', decodeURIComponent(ref))))
const report = {
  generatedAt: new Date().toISOString(),
  assets: { count: assets.length, bytes: assets.reduce((s, a) => s + a.bytes, 0),
    largest: [...assets].sort((a, b) => b.bytes - a.bytes).slice(0, 20), duplicates, unresolvedSourceReferences: missing,
    // Heuristic only: CMS values and dynamic paths may still use these files.
    unreferencedCandidates: assets.filter(a => !source.includes(a.file.slice(6)) && !source.includes(path.basename(a.file))).map(a => a.file) },
}

if (process.argv.includes('--http')) {
  const base = process.env.AUDIT_BASE_URL || 'http://localhost:3000'
  const local = ['localhost', '127.0.0.1'].includes(new URL(base).hostname)
  let cookie = ''
  if (local) {
    dotenv.config({ path: '.env.local', quiet: true })
    if (process.env.SITE_PASSWORD) {
      const auth = await fetch(`${base}/api/site-auth`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password: process.env.SITE_PASSWORD }), signal: AbortSignal.timeout(15000),
      })
      if (!auth.ok) throw new Error(`Local auth failed: ${auth.status}`)
      cookie = auth.headers.getSetCookie().map(v => v.split(';')[0]).join('; ')
    }
  }
  const headers = cookie ? { cookie } : {}
  const mediaUrls = new Set()
  const robots = await fetch(`${base}/robots.txt`, { signal: AbortSignal.timeout(15000) })
  const sitemap = await fetch(`${base}/sitemap.xml`, { signal: AbortSignal.timeout(120000) })
  const xml = await sitemap.text()
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].replaceAll('&amp;', '&'))
  report.http = { base, robots: { status: robots.status, text: await robots.text() },
    sitemap: { status: sitemap.status, count: urls.length, duplicateCount: urls.length - new Set(urls).size,
      wrongHosts: urls.filter(u => new URL(u).origin !== 'https://aoplastic.com') }, pages: [] }
  const routes = process.argv.includes('--all') ? urls.map(u => new URL(u).pathname) : [
    '/', '/about', '/contacts', '/products', '/products/abs/abs-injection', '/products/abs/abs-extrusion',
    '/products/abs/abs-injection/abs-1515-31', '/products/abs/abs-extrusion/abs-2806-31',
    '/products/polystyrene/psv-s', '/products/polystyrene/psv-l',
    '/products/dispersion/coatings/finndisp-ac-401', '/products/machine-parts/parts-injection',
    '/products/hoztovary/canisters/canister-21-5l',
  ]
  for (const route of routes) {
    try {
      const started = Date.now()
      const response = await fetch(`${base}${route}`, { headers, redirect: 'manual', signal: AbortSignal.timeout(45000) })
      const html = await response.text()
      if (process.argv.includes('--media')) {
        for (const [, src] of html.matchAll(/<(?:img|video|source)\b[^>]*\bsrc=["']([^"']+)["']/gi)) {
          try {
            let url = new URL(src.replaceAll('&amp;', '&'), base)
            if (url.pathname === '/_next/image') url = new URL(url.searchParams.get('url') || '', base)
            if (url.origin === new URL(base).origin && /^\/(?:images|videos|prevyu|docs)\//.test(url.pathname)) mediaUrls.add(url.href)
          } catch { /* Non-URL data sources are outside the local-asset audit. */ }
        }
      }
      const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
      let invalidJsonLd = 0
      for (const [, json] of schemas) { try { JSON.parse(json) } catch { invalidJsonLd++ } }
      const row = { route, status: response.status, ms: Date.now() - started,
        title: html.match(/<title>([\s\S]*?)<\/title>/)?.[1],
        canonical: html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1],
        h1Count: [...html.matchAll(/<h1(?:\s|>)/g)].length,
        schemas: schemas.length, invalidJsonLd, redirect: response.headers.get('location') }
      report.http.pages.push(row)
      if (!process.argv.includes('--quiet')) console.log(JSON.stringify(row))
    } catch (e) { report.http.pages.push({ route, error: e.message }) }
  }
  if (process.argv.includes('--media')) {
    const media = [...mediaUrls]
    const results = []
    for (let offset = 0; offset < media.length; offset += 6) {
      results.push(...await Promise.all(media.slice(offset, offset + 6).map(async url => {
        try {
          const res = await fetch(url, { method: 'HEAD', headers, redirect: 'manual', signal: AbortSignal.timeout(15000) })
          return { path: new URL(url).pathname, status: res.status, contentType: res.headers.get('content-type') }
        } catch (error) { return { path: new URL(url).pathname, error: error.message } }
      })))
    }
    report.http.media = { checked: results.length, errors: results.filter(r => r.error || r.status !== 200 || !/^(?:image|video)\//.test(r.contentType || '')), results }
  }
}

if (report.http) {
  const titles = new Map()
  for (const page of report.http.pages) {
    if (page.title) titles.set(page.title, [...(titles.get(page.title) || []), page.route])
  }
  report.http.summary = {
    checked: report.http.pages.length,
    errors: report.http.pages.filter(p => p.error || p.status >= 400 || p.invalidJsonLd),
    missingMetadata: report.http.pages.filter(p => p.status === 200 && (!p.title || !p.canonical)).map(p => p.route),
    headingWarnings: report.http.pages.filter(p => p.status === 200 && p.h1Count !== 1).map(p => p.route),
    duplicateTitles: [...titles].filter(([, routes]) => routes.length > 1).map(([title, routes]) => ({ title, routes })),
  }
}

fs.mkdirSync('tmp/seo-audit', { recursive: true })
fs.writeFileSync('tmp/seo-audit/report.json', JSON.stringify(report, null, 2))
console.log(JSON.stringify({ report: 'tmp/seo-audit/report.json', assets: assets.length, duplicateGroups: duplicates.length, unresolvedSourceReferences: missing.length,
  http: report.http ? { robots: report.http.robots.status, sitemap: report.http.sitemap, summary: report.http.summary,
    media: report.http.media && { checked: report.http.media.checked, errors: report.http.media.errors } } : undefined }))
if (report.http?.pages.some(p => p.error || p.status >= 400 || p.invalidJsonLd) || report.http?.media?.errors.length) process.exitCode = 1
