import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsObject, ValidateNested } from 'class-validator';

export class CartDTO {
  @IsNumber()
  @ApiProperty({ type: Number })
  productId: number;

  @IsNumber()
  @ApiProperty({ type: Number })
  quantity: number;
}
export class CreateOrderDTO {
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CartDTO)
  @ApiProperty({ type: [CartDTO] })
  cart: CartDTO[];
}
