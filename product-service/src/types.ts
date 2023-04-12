export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
}

export type Products = Product[];

export interface GetProductsByIdResponse {
  product: Product;
}

export interface GetProductsListResponse {
  products: Products;
}

export interface ErrorResponse {
  message: string;
}

export interface Stock {
  product_id: string;
  count: number;
}
