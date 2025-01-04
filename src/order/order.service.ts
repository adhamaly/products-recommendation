import { Injectable } from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order-dto';
import { OrderRepository } from './order.repository';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { OrderDTO } from '../common/dtos/order.dto';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async create(customerId: number, createOrderDTO: CreateOrderDTO) {
    const createdOrderWithItems: OrderDTO = await this.orderRepository.create(
      Number(customerId),
      createOrderDTO,
    );

    // Publish Message for order creation event
    await this.amqpConnection.publish(
      'order_created',
      '',
      createdOrderWithItems,
    );

    // TODO: Send Notification to user and admin

    return createdOrderWithItems;
  }
}
