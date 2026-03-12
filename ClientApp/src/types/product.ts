export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
}

export interface ProductComment {
  id: number;
  author: string;
  text: string;
}

export interface Seller {
  name: string;
  location: string;
  sales: number;
  rating: number;
}
