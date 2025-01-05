import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { GetAllProductsDTO } from './dto/get-all-products.dto';
import { ProductDTO } from './dto/product.dto';
import { Prisma } from '@prisma/client';
import { GetTopProductsDTO } from './dto/get-top-products';
import { ResponsePayload } from 'src/common/interfaces/custom-response.class';
import { ProductParamDto } from './dto/product-id-param.dto';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { OrderDTO } from '../common/dtos/order.dto';
import { RabbitExchanges } from 'src/common/enums/rabbitmq-exchanges.enum';
import { RabbitRoutingKeys } from 'src/common/enums/rabbitmq-routing-keys.enum';
import { RabbitQueues } from 'src/common/enums/rabbitmq-queues.enum';

@Injectable()
export class ProductService {
  constructor(
    private readonly productsRepository: ProductRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async getAllProducts(
    getAllProductsDTO: GetAllProductsDTO,
  ): Promise<ResponsePayload<ProductDTO>> {
    const { page = 1, limit = 20, categories } = getAllProductsDTO;
    const skip = (page - 1) * limit;

    const filter = categories?.length > 0 && {
      where: {
        category: { in: categories },
      },
    };

    const products = await this.productsRepository.findAll({
      ...filter,
      select: {
        id: true,
        name: true,
        category: true,
        area: true,
      },
      skip: skip,
      take: Number(limit),
    });
    const productsCount = await this.productsRepository.getCount(filter);

    return {
      data: products,
      pages: Math.ceil(productsCount / limit) || 0,
      total: productsCount,
      page: Number(page),
      limit: Number(limit),
    };
  }

  async getProductById({ productId }: ProductParamDto): Promise<ProductDTO> {
    return this.productsRepository.findById(productId);
  }

  async getTopOrderedProducts({ area }: GetTopProductsDTO) {
    const productFindManyArgs: Prisma.ProductFindManyArgs = {
      where: { area },
      orderBy: {
        orders: {
          _count: 'desc',
        },
      },
      select: {
        id: true,
        name: true,
        category: true,
        area: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
      take: 10,
    };

    const products = await this.productsRepository.findAll(productFindManyArgs);

    return products.map(
      ({ _count, ...product }: ProductDTO & { _count: { orders: number } }) => {
        return { ...product, ordersCount: _count.orders };
      },
    );
  }

  @RabbitSubscribe({
    exchange: RabbitExchanges.MESSAGE_WORKER,
    routingKey: RabbitRoutingKeys.MESSAGE_WORKER_EVENTS_STOCK_AVAILABILITY,
    queue: RabbitQueues.MESSAGE_WORKER_EVENTS_STOCK_AVAILABILITY,
    queueOptions: {
      durable: true,
    },
    errorHandler: (channel, messages, error) => {
      console.log(`: ${error}`);
      channel.nack(messages, false, false);
    },
  })
  async updateProductQuantityHandler(createdOrder: OrderDTO) {
    // Check product stock
    const isSufficientStock = await this.checkProductAvailability(createdOrder);

    if (!isSufficientStock) {
      // Publish Message for order failed
      await this.amqpConnection.publish(
        RabbitExchanges.MESSAGE_WORKER,
        RabbitRoutingKeys.MESSAGE_WORKER_EVENTS_ORDER_FAILED,
        createdOrder,
      );
    } else {
      try {
        for (const item of createdOrder.items) {
          await this.productsRepository.update(item.productId, {
            quantityInStock: {
              decrement: item.quantity,
            },
          });
        }
      } catch (err: any) {
        // Publish Message for order failed
        await this.amqpConnection.publish(
          RabbitExchanges.MESSAGE_WORKER,
          RabbitRoutingKeys.MESSAGE_WORKER_EVENTS_ORDER_FAILED,
          createdOrder,
        );
      }

      // Publish Message for notification
      await this.amqpConnection.publish(
        RabbitExchanges.MESSAGE_WORKER,
        RabbitRoutingKeys.MESSAGE_WORKER_EVENTS_ORDER_CONFIRMATION,
        createdOrder,
      );
    }
  }

  private async checkProductAvailability(
    createdOrder: OrderDTO,
  ): Promise<boolean> {
    for (const item of createdOrder.items) {
      const product = await this.productsRepository.findById(item.productId);
      if (product.quantityInStock < item.quantity) {
        console.log('Insufficient stock for product:', product.id);
        return false;
      }
    }
    return true;
  }
}
