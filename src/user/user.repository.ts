import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, UserRole } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Find all users with optional filters, pagination, and sorting.
   * @param userFindManyArgs Prisma's findMany arguments for flexibility.
   * @returns An array of User.
   */
  async findAll(
    userFindManyArgs: Prisma.UserFindManyArgs = {},
  ): Promise<User[]> {
    return this.prisma.user.findMany(userFindManyArgs);
  }

  /**
   * Find a user by its ID.
   * @param id The ID of the user.
   * @returns The User or null if not found.
   */
  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  /**
   * Find a user with filters
   * @param userFindFirstArgs.
   * @returns The User or null if not found.
   */
  async findOne(
    userFindFirstArgs: Prisma.UserFindFirstArgs,
  ): Promise<User | null> {
    return this.prisma.user.findFirst(userFindFirstArgs);
  }

  async create(data: {
    email: string;
    password: string;
    role: UserRole;
  }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  /**
   * Update an existing User.
   * @param userId - The ID of the user to update.
   * @param data - Prisma's UserUpdateInput.
   * @returns The updated User.
   */
  async update(userId: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}
