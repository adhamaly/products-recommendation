import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterFcmToken {
  @IsString()
  @ApiProperty({ type: String })
  fcmToken: string;
}
