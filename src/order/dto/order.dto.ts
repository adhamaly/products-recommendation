import { OrderItem } from '@prisma/client';

export class OrderDTO {
  id: number;
  customerId: number;
  createdAt: Date;
  items: OrderItem[];
}
