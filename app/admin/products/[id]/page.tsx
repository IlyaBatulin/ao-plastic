import { ProductEditClient } from "./product-edit-client"

export default async function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <ProductEditClient params={resolvedParams} />
}

