import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
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
  controllers: [ProductController],
  providers: [PrismaService, ProductService, ProductRepository],
})
export class ProductModule {}
