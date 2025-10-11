interface IProduct {
  id: string;
  name: string;
  category: string;
  description?: string;
  image: string;
  oldPrice: number;
  newPrice: number;
  discount: number;
  rating: number;
  inStock: boolean;
}

interface IBlogPost {
  id: number;
  title: string;
  author: string;
  category: string;
  date: string;
  comments: number;
  hits: number;
  image: string;
  excerpt: string;
}
