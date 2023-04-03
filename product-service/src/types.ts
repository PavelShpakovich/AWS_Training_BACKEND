export interface Product {
  id?: string;
  title: string;
  description: string;
  price: number;
}

export type Products = Product[];

export interface ErrorResponse {
  message: string;
}
