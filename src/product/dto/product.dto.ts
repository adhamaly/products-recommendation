export class ProductDTO {
  id: number;
  name: string;
  category: string;
  area: string;
  quantityInStock: number;
  _count?: {
    orders: number;
  };
}
