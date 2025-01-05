import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { OrderDTO } from '../common/dtos/order.dto';
import { RabbitExchanges } from 'src/common/enums/rabbitmq-exchanges.enum';
import { RabbitRoutingKeys } from 'src/common/enums/rabbitmq-routing-keys.enum';
import { RabbitQueues } from 'src/common/enums/rabbitmq-queues.enum';
import { FCMService } from 'src/common/modules/firebase/fcm.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(
    private readonly fcmService: FCMService,
    private readonly prismaService: PrismaService,
  ) {}

  @RabbitSubscribe({
    exchange: RabbitExchanges.MESSAGE_WORKER,
    routingKey: RabbitRoutingKeys.MESSAGE_WORKER_EVENTS_ORDER_CONFIRMATION,
    queue: RabbitQueues.MESSAGE_WORKER_EVENTS_ORDER_CONFIRMATION,
    queueOptions: {
      durable: true,
    },
    errorHandler: (channel, messages, error) => {
      console.log(`: ${error}`);
      channel.nack(messages, false, false);
    },
  })
  async orderConfirmationHandler(createdOrder: OrderDTO) {
    const [user, admins] = await Promise.all([
      this.prismaService.user.findUnique({
        where: {
          id: createdOrder.customerId,
        },
      }),
      this.prismaService.user.findMany({
        where: {
          role: UserRole.ADMIN,
        },
      }),
    ]);

    for (const admin of admins) {
      // Sent Notification to admins
      await this.fcmService.sendToSingleToken(
        'New Order Created',
        'A new order has been placed',
        admin.fcmToken,
      );
    }

    await this.fcmService.sendToSingleToken(
      'Order Confirmation.',
      'Your order has been successfully placed.',
      user.fcmToken,
    );
  }
}
