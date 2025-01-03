import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ProductDTO } from './dto/product.dto';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Find all products with optional filters, pagination, and sorting.
   * @param productFindManyArgs Prisma's findMany arguments for flexibility.
   * @returns An array of ProductDTO.
   */
  async findAll(
    productFindManyArgs: Prisma.ProductFindManyArgs = {},
  ): Promise<ProductDTO[]> {
    return this.prisma.product.findMany(productFindManyArgs);
  }

  /**
   * Find a product by its ID.
   * @param id The ID of the product.
   * @returns The ProductDTO or null if not found.
   */
  async findById(id: number): Promise<ProductDTO | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    return product;
  }

  async create(data: {
    name: string;
    category: string;
    area: string;
  }): Promise<ProductDTO> {
    return this.prisma.product.create({ data });
  }
}
