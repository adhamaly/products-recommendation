import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserRole } from '@prisma/client';
import { RegisterFcmToken } from './dto/register-fcm.dto';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UserRepository) {}

  async createUser(email: string, password: string, role: UserRole) {
    const isEmailAlreadyExist = await this.findUserByEmail(email);
    if (isEmailAlreadyExist) {
      throw new MethodNotAllowedException('Email is already exist');
    }

    const createdUser = await this.usersRepository.create({
      email,
      password,
      role,
    });

    delete createdUser.password;

    return createdUser;
  }

  async findUserByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async registerFcmToken(userId: number, { fcmToken }: RegisterFcmToken) {
    await this.usersRepository.update(userId, { fcmToken: fcmToken });
  }
}
