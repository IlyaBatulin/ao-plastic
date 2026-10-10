const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const cache = new Map();
function load(relative) {
  const file = path.resolve(root, relative);
  if (cache.has(file)) return cache.get(file).exports;
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const mod = {exports: {}}; cache.set(file, mod);
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true}}).outputText;
  new Function('require', 'module', 'exports', source)((id) => {
    if (id.startsWith('@/') || id.startsWith('.')) {
      const resolved = id.startsWith('@/') ? path.join(root, id.slice(2)) : path.resolve(path.dirname(file), id);
      return load(path.extname(resolved) ? resolved : resolved + '.ts');
    }
    return require(id);
  }, mod, mod.exports);
  return mod.exports;
}
const {formatSpecKey, formatSpecValue} = load('lib/formatters.ts');
const {resolveProductDisplay} = load('lib/product-en.ts');
const {getRalColourName} = load('lib/ral-names-en.ts');
const {documentCaption} = load('lib/document-captions-en.ts');
assert.equal(resolveProductDisplay({id:'pse-1', name:'Полистирол ПСЭ-1'},'en').name,'Polystyrene PSE-1');
assert.equal(resolveProductDisplay({id:'abs-2020-31m', name:'АБС-2020-31М'},'en').name,'ABS-2020-31M');
assert.match(resolveProductDisplay({id:'psv-l-unsieved', name:'Полистирол ПСВ-Л, нерассеянная фракция'},'en').name,/Polystyrene.*Unscreened/);
for (const op of ['>','<','≥','≤']) assert.equal(formatSpecValue('Размер',`${op} 2,5 мм`,'en'),`${op} 2.5 mm`);
for (const [ru,en] of [['не менее 5','≥ 5'],['не более 5','≤ 5'],['менее 5','< 5'],['более 5','> 5'],['215,8 г','215.8 g'],['9,5 л','9.5 L'],['820, 840 или 880 кг','820, 840 or 880 kg'],['ПЭНД','High-density polyethylene (HDPE)']]) assert.equal(formatSpecValue('test',ru,'en'),en);
assert.equal(formatSpecKey('PH','en'),'pH');
const sieveKey='Остаток на сите после просева с сеткой № 0,2 К, %, не более';
assert.equal(formatSpecKey(sieveKey,'ru'),sieveKey);
assert.equal(formatSpecKey(sieveKey,'en'),'Residue on No. 0.2 K sieve after screening, % max.');
assert.equal(formatSpecKey('Усиленная светостабилизация, атмосферостойкость','en'),'Enhanced light stabilisation and weather resistance');
assert.equal(formatSpecValue('Размер','≥ 2,5 мм','ru'),'≥ 2,5 мм');
assert.equal(getRalColourName('RAL 9010','Чисто белый','en'),'Pure white');
assert.equal(getRalColourName('RAL 9010','Чисто белый','ru'),'Чисто белый');
for (const file of ['data/about-pages/safety.ts','data/about-pages/disclosure.ts']) {
  const data=load(file); const sections=data.safetyDocumentSections||data.disclosureSections;
  function check(v) {if(Array.isArray(v))return v.forEach(check);if(v&&typeof v==='object')for(const[k,x]of Object.entries(v)){if(['title','intro'].includes(k)&&typeof x==='string')assert.ok(!/[а-яё]/i.test(documentCaption(x,'en')),x);else if(typeof x==='object')check(x)}}check(sections);
}
console.log('English regression checks passed: product names, bounds, units, RAL and document captions.');

if(process.argv.includes('--inventory')) {
 const data=load('data/products.json');const untranslated=new Map();
 for(const cat of data.categories)for(const p of cat.products||[])for(const[k,v]of Object.entries(p.specifications||{}))for(const text of [formatSpecKey(k,'en',v),formatSpecValue(k,v,'en')])if(/[а-яё]/i.test(text))untranslated.set(text,p.id);
 console.log(JSON.stringify([...untranslated],null,2));
}
