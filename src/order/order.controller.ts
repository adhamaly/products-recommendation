import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/create-order-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserJwtPersona } from 'src/common/interfaces/user-jwt-persona.interface';
import { CustomResponse } from 'src/common/interfaces/custom-response.class';
import { Persona } from 'src/common/decorators/persona.decorator';

@Controller('orders')
@ApiTags('Orders')
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(
    @Persona() userPersona: UserJwtPersona,
    @Body() createOrderDTO: CreateOrderDTO,
  ) {
    const createdOrder = await this.orderService.create(
      userPersona.id,
      createOrderDTO,
    );
    return new CustomResponse().success({
      payload: {
        data: createdOrder,
      },
    });
  }
}
