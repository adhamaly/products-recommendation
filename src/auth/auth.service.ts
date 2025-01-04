import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { SignupUserDto } from './dtos/signup.dto';
import { LoginEmailDto } from './dtos/login-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async signup(signupUserDto: SignupUserDto) {
    const { email, password } = signupUserDto;

    const hashedPassword = await this.generateHashedPassword(password);

    const createdUser = await this.userService.createUser(
      email,
      hashedPassword,
      UserRole.USER,
    );

    return {
      ...createdUser,
      accessToken: this.generateToken(createdUser),
    };
  }
  async login(loginEmailDto: LoginEmailDto) {
    const { email, password } = loginEmailDto;

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new ConflictException('Incorrect Email or password ');
    }

    const isPasswordMatches = await this.comparePassword(
      user.password,
      password,
    );
    if (!isPasswordMatches) {
      throw new ConflictException('Incorrect Email or password ');
    }

    delete user.password;

    return {
      ...user,
      accessToken: this.generateToken(user),
    };
  }

  private generateToken(user: User) {
    return this.jwtService.sign(
      { id: String(user.id), email: user.email, role: user.role },
      {
        secret:
          user.role === UserRole.USER
            ? this.configService.get<string>('USER_JWT_SECRET')
            : this.configService.get<string>('ADMIN_JWT_SECRET'),
        expiresIn:
          user.role === UserRole.USER
            ? Number(this.configService.get<number>('USER_JWT_EXPIRY'))
            : Number(this.configService.get<number>('ADMIN_JWT_EXPIRY')),
      },
    );
  }

  private async generateHashedPassword(password: string) {
    return bcrypt.hash(
      password,
      Number(this.configService.get<number>('SALT')),
    );
  }

  private async comparePassword(hashed: string, password: string) {
    return bcrypt.compare(password, hashed);
  }
}
