interface Product {
  readonly code?: string,
  name: string,
  price: number,
  trend: Trend,
  category: Category,
  skus: string[]
}