import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { Persona } from 'src/common/decorators/persona.decorator';
import { UserJwtPersona } from 'src/common/interfaces/user-jwt-persona.interface';
import { RegisterFcmToken } from './dto/register-fcm.dto';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('register-fcm-token')
  async registerFcmToken(
    @Persona() userJwtPersona: UserJwtPersona,
    @Body() registerFcmToken: RegisterFcmToken,
  ) {
    await this.usersService.registerFcmToken(
      userJwtPersona.id,
      registerFcmToken,
    );
  }
}
