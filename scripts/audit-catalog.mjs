import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
dotenv.config({ path: path.join(projectRoot, ".env.local"), quiet: true })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error("Catalog audit cannot start: Supabase URL or API key is missing in .env.local.")
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
})

async function fetchAll(table, select = "*") {
  const pageSize = 500
  const rows = []

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .range(from, from + pageSize - 1)

    if (error) throw new Error(`${table}: ${error.message}`)
    rows.push(...(data ?? []))
    if (!data || data.length < pageSize) break
  }

  return rows
}

function normalized(value) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ")
}

function duplicates(rows, keyOf) {
  const groups = new Map()
  for (const row of rows) {
    const key = normalized(keyOf(row))
    if (!key) continue
    const group = groups.get(key) ?? []
    group.push(row)
    groups.set(key, group)
  }
  return [...groups.entries()].filter(([, group]) => group.length > 1)
}

function productCode(product) {
  const specs = product?.specifications
  if (!specs || typeof specs !== "object") return ""
  return specs["Артикул"] ?? specs["Шифр изделия"] ?? specs.code ?? ""
}

function productSummary(product) {
  const code = productCode(product)
  return `${product.id}: ${product.name || "(no name)"}${code ? ` [${code}]` : ""}`
}

function printList(title, rows, formatter = (row) => String(row)) {
  console.log(`\n${title}: ${rows.length}`)
  for (const row of rows.slice(0, 50)) console.log(`  - ${formatter(row)}`)
  if (rows.length > 50) console.log(`  …and ${rows.length - 50} more`)
}

function transliterateLegacyFilename(filename) {
  const map = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e",
    ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
    н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
    ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  }
  const dot = filename.lastIndexOf(".")
  const stem = dot >= 0 ? filename.slice(0, dot) : filename
  const extension = dot >= 0 ? filename.slice(dot).toLowerCase() : ""
  return `${stem
    .toLowerCase()
    .split("")
    .map((char) => map[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}${extension}`
}

function resolvedLocalImagePath(image) {
  if (!image || typeof image !== "string") return image
  const normalized = image.replace(/\\/g, "/")
  const match = normalized.match(/^\/images\/(litev|extrusion)\/([^/]+)$/i)
  if (!match || !/[\u0400-\u04ff]/i.test(match[2])) return normalized
  return `/images/${match[1].toLowerCase()}/${transliterateLegacyFilename(match[2])}`
}

function localImageExists(image) {
  if (!image || typeof image !== "string" || !image.startsWith("/")) return true
  const resolved = resolvedLocalImagePath(image)
  return fs.existsSync(path.join(projectRoot, "public", resolved.replace(/^\/+/, "")))
}

async function main() {
  const [categories, subcategories, products, extrusionProducts] = await Promise.all([
    fetchAll("categories"),
    fetchAll("subcategories"),
    fetchAll("products"),
    fetchAll("extrusion_products"),
  ])

  const activeProducts = products.filter((product) => product.is_active !== false)
  const inactiveProducts = products.filter((product) => product.is_active === false)
  const categoryIds = new Set(categories.map((category) => String(category.id)))
  const subcategoryIds = new Set(
    subcategories.flatMap((subcategory) =>
      [subcategory.id, subcategory.slug].filter(Boolean).map(String)
    )
  )

  const orphanSubcategories = subcategories.filter(
    (subcategory) => subcategory.category_id && !categoryIds.has(String(subcategory.category_id))
  )
  const orphanProducts = products.filter(
    (product) => product.subcategory_id && !subcategoryIds.has(String(product.subcategory_id))
  )
  const incompleteProducts = activeProducts.filter(
    (product) => !product.name || !product.subcategory_id || !product.image
  )
  const duplicateNames = duplicates(
    activeProducts,
    (product) => `${product.subcategory_id}::${product.name}`
  )
  const duplicateCodes = duplicates(activeProducts, productCode)
  const activeProductSubcategories = new Set(activeProducts.map((product) => String(product.subcategory_id)))
  const unusedSubcategories = subcategories.filter(
    (subcategory) =>
      !activeProductSubcategories.has(String(subcategory.id)) &&
      !activeProductSubcategories.has(String(subcategory.slug))
  )

  const exportPath = path.join(projectRoot, "data", "dms-products-export.json")
  const localDms = JSON.parse(fs.readFileSync(exportPath, "utf8"))
  const localInjection = localDms.products ?? []
  const dbInjection = products.filter((product) =>
    ["injection", "injection-parts", "parts-injection"].includes(String(product.subcategory_id))
  )
  const localById = new Map(localInjection.map((product) => [String(product.id), product]))
  const dbById = new Map(dbInjection.map((product) => [String(product.id), product]))
  const onlyLocal = [...localById.keys()].filter((id) => !dbById.has(id))
  const onlyDatabase = [...dbById.keys()].filter((id) => !localById.has(id))
  const changedDms = [...localById.entries()].filter(([id, local]) => {
    const db = dbById.get(id)
    if (!db) return false
    return (
      normalized(local.name) !== normalized(db.name) ||
      normalized(local.image) !== normalized(db.image) ||
      normalized(productCode(local)) !== normalized(productCode(db))
    )
  })
  const missingLocalImages = [...localInjection, ...(localDms.extrusion_products ?? [])]
    .filter((product) => !localImageExists(product.image))

  console.log("Catalog audit: read-only Supabase check")
  console.log(`Connection: OK (${key === process.env.SUPABASE_SERVICE_ROLE_KEY ? "service role" : "anon role"})`)
  console.log(`Categories: ${categories.length}`)
  console.log(`Subcategories: ${subcategories.length}`)
  console.log(`Products: ${products.length} (${activeProducts.length} active, ${inactiveProducts.length} inactive)`)
  console.log(`Extrusion products: ${extrusionProducts.length}`)

  printList("Orphan subcategories", orphanSubcategories, (row) => `${row.id} -> ${row.category_id}`)
  printList("Orphan products", orphanProducts, productSummary)
  printList("Active products with missing name, section or image", incompleteProducts, productSummary)
  printList("Unused subcategories", unusedSubcategories, (row) => `${row.id}: ${row.name}`)
  printList("Repeated names within one subcategory (informational)", duplicateNames, ([key, group]) =>
    `${key.split("::")[1]} -> ${group.map((row) => productCode(row) || row.id).join(", ")}`
  )
  printList("Duplicate product codes", duplicateCodes, ([code, group]) =>
    `${code} -> ${group.map((row) => row.id).join(", ")}`
  )
  printList("DMS products present only in local fallback", onlyLocal)
  printList("DMS products present only in Supabase", onlyDatabase)
  printList("DMS rows different between fallback and Supabase", changedDms, ([id, local]) =>
    `${id}: ${local.name}`
  )
  printList("Missing local DMS image files", missingLocalImages, productSummary)

  const blockingIssues =
    orphanSubcategories.length +
    orphanProducts.length +
    incompleteProducts.length +
    duplicateCodes.length +
    onlyDatabase.length +
    missingLocalImages.length

  console.log(`\nResult: ${blockingIssues === 0 ? "no blocking catalogue tails found" : `${blockingIssues} blocking issue(s) found`}.`)
  process.exitCode = blockingIssues === 0 ? 0 : 2
}

main().catch((error) => {
  console.error(`Catalog audit failed: ${error.message}`)
  process.exitCode = 1
})
