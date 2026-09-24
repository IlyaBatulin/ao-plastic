import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'

async function load(file) {
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  }).outputText
  return import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'))
}
const { parseSpecNumberRange, getNumericFilterRanges, matchesSpecRange } = await load('lib/product-specs.ts')
assert.deepEqual(parseSpecNumberRange('4,5–7,5'), { min: 4.5, max: 7.5 })
assert.deepEqual(parseSpecNumberRange('1,65'), { min: 1.65, max: 1.65 })
assert.deepEqual(parseSpecNumberRange('1.6–1.0'), { min: 1, max: 1.6 })
assert.equal(parseSpecNumberRange('—'), null)
assert.deepEqual(parseSpecNumberRange('1040 кг/м3'), { min: 1040, max: 1040 })
assert.deepEqual(parseSpecNumberRange('4,5–7,5 г/10 мин'), { min: 4.5, max: 7.5 })
assert.deepEqual(parseSpecNumberRange('от 1,6 до 1,0 мм'), { min: 1, max: 1.6 })
assert.deepEqual(parseSpecNumberRange('-40–+80 °C'), { min: -40, max: 80 })
const ranges = getNumericFilterRanges({
  'Показатель текучести расплава, г/10 мин': '4,5–7,5',
  'Показатель_текучести_расплава_MFR_г_10мин': 999,
  'Предел текучести при растяжении, кгс/см², не менее': 420,
  'Относительная вязкость, не менее': '1,65',
})
assert.deepEqual(ranges.mfr, { min: 4.5, max: 7.5 })
assert.ok(Math.abs(ranges.tensileStrength.min - 41.18793) < 0.000001)
assert.deepEqual(ranges.relativeViscosity, { min: 1.65, max: 1.65 })
assert.equal(matchesSpecRange(ranges.mfr, 6, 9), true)
assert.equal(matchesSpecRange(ranges.mfr, 8, 10), false)
assert.equal(matchesSpecRange(ranges.mfr, 10, 2), false)
assert.equal(matchesSpecRange(null, 1, 2), false)
assert.equal(matchesSpecRange(null), true)
assert.equal(matchesSpecRange(ranges.mfr, NaN), false)
const largeParticles = getNumericFilterRanges({ 'Размер частиц основной фракции': 'более 2,5 мм' }).fraction
assert.equal(matchesSpecRange(largeParticles, 3, 4), true)
assert.equal(matchesSpecRange(largeParticles, 2.5, 2.5), false)
const smallParticles = getNumericFilterRanges({ 'Размер частиц основной фракции': 'менее 0,4 мм' }).fraction
assert.equal(matchesSpecRange(smallParticles, 0.1, 0.2), true)
assert.equal(matchesSpecRange(smallParticles, 0.4, 0.5), false)
const { getProductSearchName } = await load('lib/seo/product-name.ts')
assert.equal(getProductSearchName('Втулка', 'machine-parts', { 'Шифр изделия': 'КА555' }), 'Втулка')
assert.equal(getProductSearchName('Втулка КА555', 'machine-parts', { 'Шифр изделия': 'КА555' }), 'Втулка КА555')
assert.equal(getProductSearchName('Трубка', 'machine-parts', { 'Габаритные размеры': '10 × 2 мм', 'Длина изделия': '100 мм' }), 'Трубка')
assert.equal(getProductSearchName('АБС-1515-31', 'abs', {}), 'АБС-1515-31')
const { getSiteUrl, isIndexingAllowed } = await load('lib/site.ts')
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
assert.equal(getSiteUrl(), 'https://aoplastic.com')
process.env.NEXT_PUBLIC_SITE_URL = 'invalid'
assert.equal(getSiteUrl(), 'https://aoplastic.com')
process.env.NEXT_PUBLIC_SITE_URL = 'https://aoplastic.com/'
assert.equal(getSiteUrl(), 'https://aoplastic.com')
process.env.NODE_ENV = 'production'
delete process.env.SITE_PASSWORD
delete process.env.SITE_NOINDEX
delete process.env.VERCEL_ENV
assert.equal(isIndexingAllowed(), true)
process.env.SITE_PASSWORD = 'test-only'
assert.equal(isIndexingAllowed(), false)
delete process.env.SITE_PASSWORD
process.env.VERCEL_ENV = 'preview'
assert.equal(isIndexingAllowed(), false)
console.log('SEO URL, indexing policy and decimal-range checks passed')
