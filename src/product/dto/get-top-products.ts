import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetTopProductsDTO {
  @IsString()
  @ApiProperty({ type: String })
  area: string;
}
