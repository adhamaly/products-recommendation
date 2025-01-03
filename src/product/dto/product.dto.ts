export class ProductDTO {
  id: number;
  name: string;
  category: string;
  area: string;
  _count?: {
    orders: number;
  };
}
