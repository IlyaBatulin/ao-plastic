/**
 * Английские названия и краткие описания товаров ТНП (категория hoztovary).
 * Источник текстов — миграции БД; в интерфейсе при lang=en подменяют поля из Supabase.
 */
const HOUSEHOLD_PRODUCT_EN: Record<string, { name: string; description: string }> = {
  "vedro-base-95l": {
    name: "BASE Bucket 9.5 L",
    description:
      "Rectangular BASE 9.5 L bucket for modern flat mops with a wringer. The shape makes washing floors fast and convenient.",
  },
  "vedro-25l": {
    name: "Bucket 2.5 L",
    description:
      "Attractive, ergonomic and extremely durable bucket. Made of high-quality plastic to GOST R 50962-96 and inspected by QC.",
  },
  "vedro-5l": {
    name: "Bucket 5 L",
    description:
      "Attractive, ergonomic and extremely durable bucket. Made of high-quality plastic to GOST R 50962-96 and inspected by QC.",
  },
  "vedro-7l": {
    name: "Bucket 7 L",
    description:
      "Attractive, ergonomic and extremely durable bucket. Made of high-quality plastic to GOST R 50962-96 and inspected by QC.",
  },
  "vedro-10l": {
    name: "Bucket 10 L",
    description:
      "Attractive, ergonomic and extremely durable bucket. Made of high-quality plastic to GOST R 50962-96 and inspected by QC. Combines proven quality with a modern look.",
  },
  "taz-10l": {
    name: "Basin 10 L",
    description:
      "10 L plastic basin — practical volume, strong and load-resistant. Handy for laundry, cleaning, kitchen or garden.",
  },
  "taz-15l": {
    name: "Basin 15 L",
    description:
      "Plastic basin that supports heavy loads. Time-tested shape for everyday household use.",
  },
  "sovok-base": {
    name: "BASE Dustpan",
    description:
      "Quality and convenience in one. BASE is more compact and affordable than the ERGO line.",
  },
  "sovok-s-rezinkoy-base": {
    name: "BASE Dustpan with Rubber Edge",
    description:
      "More compact than ERGO for easier storage. Same performance: flexibility and a rubber lip.",
  },
  sovok: {
    name: "Dustpan",
    description:
      "High-quality plastic for flexibility and quick cleanup of debris.",
  },
  "sovok-s-rezinkoy": {
    name: "Dustpan with Rubber Edge",
    description:
      "Large, ergonomic dustpan with a rubber edge that seals to the floor and catches fine dust.",
  },
  "sovok-ergo": {
    name: "ERGO Dustpan",
    description:
      "Durable plastic, comfortable to use for fast debris pickup.",
  },
  "sovok-s-rezinkoy-ergo": {
    name: "ERGO Dustpan with Rubber Edge",
    description:
      "High-quality material, easy to use and store; flexible with a rubber edge.",
  },
  "sovok-dlya-musora": {
    name: "Oval Dustpan",
    description:
      "Oval shape with a side handle for quick collection of fine dust and debris.",
  },
  "shchetka-smetka": {
    name: "Hand Brush",
    description:
      "Ideal for dust and small debris on windowsills, shelves, cabinets and floors. Plastic bristles.",
  },
  "nabor-sovok-shchetka": {
    name: "Dustpan and Brush Set",
    description:
      "Classic set for small debris: straight dustpan edge, ergonomic handles with hanging holes.",
  },
  "nabor-sovok-s-rezinkoy-shchetka": {
    name: "Dustpan with Rubber Edge and Brush Set",
    description:
      "All benefits of the standard set plus a rubber lip for smooth floors and better dust pickup.",
  },
  pylevybivalka: {
    name: "Carpet Beater",
    description:
      "Strong yet flexible plastic. A simple, proven way to beat dust out of rugs and carpets.",
  },
  "stekloochistitel-s-abrazivom": {
    name: "Window Squeegee with Scrubber",
    description:
      "Light, handy tool for windows; durable, practical plastic.",
  },
  "stekloochistitel-ergo": {
    name: "ERGO Window Squeegee",
    description:
      "Light and sturdy for home or car glass. Sponge absorbs water; rubber blade removes streaks.",
  },
  "stekloochistitel-ergo-s-cherenkom": {
    name: "ERGO Window Squeegee with 60 cm Handle",
    description:
      "Long handle and absorbent sponge save time; straight rubber blade leaves glass clear.",
  },
  "komplekt-dlya-tualeta-kompakt": {
    name: "Compact Toilet Brush Set",
    description:
      "Round compact set, easy to store. Plastic stand; stiff synthetic brush for thorough cleaning.",
  },
  "komplekt-dlya-tualeta": {
    name: "Toilet Brush Set",
    description:
      "Compact shape for easy storage. Affordable plastic set with a stiff brush for hygiene.",
  },
  "komplekt-dlya-tualeta-ergo": {
    name: "ERGO Toilet Brush Set",
    description:
      "Stable non-slip stand; stiff brush for tough stains. Economical for regular replacement.",
  },
  mylnitsa: {
    name: "Soap Dish",
    description:
      "Practical plastic soap dish for bathroom or sink.",
  },
  "voronka-120mm": {
    name: "Funnel d=120 mm",
    description:
      "Food-contact plastic funnel; fits many containers and reduces spills. Bright colours.",
  },
  "kruzhka-02l": {
    name: "Mug 0.2 L",
    description:
      "Very light, strong food-contact mug for hot drinks. Safe for children; handy for travel or picnics.",
  },
  "filtr-setochka": {
    name: "Sink Strainer",
    description:
      "Protects the drain from clogs; inexpensive and easy to replace.",
  },
  "veshalka-plechiki-36-38": {
    name: "Hanger Size 36–38",
    description:
      "Strong modern hanger in high-quality plastic to GOST R 50962-96, QC-checked for safety and durability.",
  },
  "veshalka-plechiki-povorotnyy-44-46": {
    name: "Hanger with Swivel Hook, Size 44–46",
    description:
      "Strong hanger with swivel hook in high-quality plastic to GOST R 50962-96.",
  },
  "veshalka-plechiki-48-50": {
    name: "Hanger Size 48–50",
    description:
      "Strong modern hanger in high-quality plastic to GOST R 50962-96, QC-checked for safety and durability.",
  },
  "veshalka-plechiki-povorotnyy-48-50": {
    name: "Hanger with Swivel Hook, Size 48–50",
    description:
      "Strong hanger with swivel hook in high-quality plastic to GOST R 50962-96.",
  },
  "veshalka-plechiki-52-54": {
    name: "Hanger Size 52–54",
    description:
      "Strong modern hanger in high-quality plastic to GOST R 50962-96, QC-checked for safety and durability.",
  },
  "veer-dlya-razduva-ognya": {
    name: "BBQ Fan",
    description:
      "Gets any fire going; comfortable in the hand — great for charcoal and barbecue.",
  },
  "canister-21-5l": {
    name: "Polymer Canisters with Caps",
    description:
      "Polymer canisters with caps, capacity 21.5 dm3, for packaging, transportation and storage of food, chemical and other products.",
  },
  "box-polymer": {
    name: "Polymer Crate (black, blue)",
    description:
      "Polymer crate for packaging, storage and transportation of fresh mushrooms, vegetables, berries, herbs and other food products.",
  },
}

export function getHouseholdProductEn(
  productId: string
): { name: string; description: string } | null {
  return HOUSEHOLD_PRODUCT_EN[productId] ?? null
}

export { HOUSEHOLD_PRODUCT_EN }
