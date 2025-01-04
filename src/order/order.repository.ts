import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDTO } from './dto/create-order-dto';
import { OrderDTO } from './dto/order.dto';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new order for a customer.
   * @param customerId - The ID of the customer placing the order.
   * @param createOrderDto - The order creation data transfer object.
   * @returns The created OrderDTO.
   */
  async create(
    customerId: number,
    { cart }: CreateOrderDTO,
  ): Promise<OrderDTO> {
    return this.prisma.order.create({
      data: {
        customerId,
        items: {
          createMany: {
            data: cart,
          },
        },
      },
      include: {
        items: true,
      },
    });
  }
}
