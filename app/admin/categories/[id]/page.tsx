import { CategoryEditClient } from "./category-edit-client"

export default async function CategoryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <CategoryEditClient params={resolvedParams} />
}

