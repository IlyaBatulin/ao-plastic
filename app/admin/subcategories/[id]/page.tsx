import { SubcategoryEditClient } from "./subcategory-edit-client"

export default async function SubcategoryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <SubcategoryEditClient params={resolvedParams} />
}

