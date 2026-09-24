/** Keep internal machine-part codes out of customer-facing page titles. */
export function getProductSearchName(
  name: string,
  categoryId: string,
  specs: Record<string, unknown>
): string {
  if (categoryId !== "machine-parts") return name
  return name
}
