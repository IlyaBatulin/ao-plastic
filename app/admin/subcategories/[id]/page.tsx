import { SubcategoryEditClient } from "./subcategory-edit-client"

export default function SubcategoryEditPage({ params }: { params: Promise<{ id: string }> }) {
  return <SubcategoryEditClient params={params} />
}

