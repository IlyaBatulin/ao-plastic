import { ProductEditClient } from "./product-edit-client"

export default function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  return <ProductEditClient params={params} />
}

