import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dtos/signup.dto';
import { LoginEmailDto } from './dtos/login-email.dto';
import { CustomResponse } from 'src/common/interfaces/custom-response.class';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('public/signup')
  async signup(@Body() signupUserDto: SignupUserDto) {
    return new CustomResponse().success({
      payload: { data: await this.authService.signup(signupUserDto) },
    });
  }

  @Public()
  @Post('public/login')
  async login(@Body() loginEmailDto: LoginEmailDto) {
    return new CustomResponse().success({
      payload: { data: await this.authService.login(loginEmailDto) },
    });
  }
}
