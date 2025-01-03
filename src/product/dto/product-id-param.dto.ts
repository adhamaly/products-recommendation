import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ProductParamDto {
  @IsInt()
  @ApiProperty({ type: Number })
  productId: number;
}
