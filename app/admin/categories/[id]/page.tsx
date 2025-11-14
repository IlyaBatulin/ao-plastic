import { CategoryEditClient } from "./category-edit-client"

export default function CategoryEditPage({ params }: { params: Promise<{ id: string }> }) {
  return <CategoryEditClient params={params} />
}

