import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order-dto';
import { OrderRepository } from './order.repository';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { OrderDTO } from '../common/dtos/order.dto';
import { RabbitExchanges } from 'src/common/enums/rabbitmq-exchanges.enum';
import { RabbitRoutingKeys } from 'src/common/enums/rabbitmq-routing-keys.enum';
import { RabbitQueues } from 'src/common/enums/rabbitmq-queues.enum';

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

    // Publish Message for order confirmation event
    await this.amqpConnection.publish(
      RabbitExchanges.MESSAGE_WORKER,
      RabbitRoutingKeys.MESSAGE_WORKER_EVENTS_STOCK_AVAILABILITY,
      createdOrderWithItems,
    );
  }

  @RabbitSubscribe({
    exchange: RabbitExchanges.MESSAGE_WORKER,
    routingKey: RabbitRoutingKeys.MESSAGE_WORKER_EVENTS_ORDER_FAILED,
    queue: RabbitQueues.MESSAGE_WORKER_EVENTS_ORDER_FAILED,
    queueOptions: {
      durable: true,
    },
    errorHandler: (channel, messages, error) => {
      console.log(`: ${error}`);
      channel.nack(messages, false, false);
    },
  })
  async updateProductQuantityHandler(createdOrder: OrderDTO) {
    try {
      await this.orderRepository.delete(createdOrder.id);
    } catch (err: any) {
      throw new InternalServerErrorException(
        'Internal Server Error, Try again',
      );
    }
  }
}
