import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { rabbitmqConfig } from 'src/common/constant/rabbitmq.config';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          ...rabbitmqConfig,
          uri: configService.get<string>('RABBITMQ_URI'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [OrderController],
  providers: [PrismaService, OrderService, OrderRepository],
})
export class OrderModule {}
