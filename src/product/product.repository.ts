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
      where: { id: Number(id) },
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    return product;
  }

  /**
   * Create a new product.
   * @param data - Prisma's ProductCreateInput.
   * @returns The created ProductDTO.
   */
  async create(data: Prisma.ProductCreateInput): Promise<ProductDTO> {
    return this.prisma.product.create({ data });
  }

  /**
   * Update an existing product.
   * @param productId - The ID of the product to update.
   * @param data - Prisma's ProductUpdateInput.
   * @returns The updated ProductDTO.
   */
  async update(
    productId: number,
    data: Prisma.ProductUpdateInput,
  ): Promise<ProductDTO> {
    return this.prisma.product.update({
      where: { id: productId },
      data,
    });
  }

  /**
   * Get the count of products based on the provided arguments.
   * @param productCountArgs Prisma's count query arguments for flexibility (default is empty).
   * @returns The total count of products matching the provided arguments.
   */
  async getCount(
    productCountArgs: Prisma.ProductCountArgs = {},
  ): Promise<number> {
    return this.prisma.product.count(productCountArgs);
  }
}
