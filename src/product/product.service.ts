import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAllProductsDTO } from './dto/get-all-products.dto';
import { ProductDTO } from './dto/product.dto';
import { Prisma } from '@prisma/client';
import { GetTopProductsDTO } from './dto/get-top-products';

@Injectable()
export class ProductService {
  constructor(
    private readonly productsRepository: ProductRepository,
    private prismaService: PrismaService,
  ) {}

  async getAllProducts(filters: GetAllProductsDTO): Promise<ProductDTO[]> {
    if (filters.categories && filters.categories.length) {
      const products = [];
      for (let i = 0; i < filters.categories.length; i++) {
        products.push(
          await this.prismaService.product.findFirst({
            where: { category: filters.categories[i] },
          }),
        );
      }
    }
    return this.prismaService.product.findMany();
  }

  async getProductById(id: number): Promise<ProductDTO> {
    return this.productsRepository.findById(id);
  }

  async getTopOrderedProducts({ area }: GetTopProductsDTO) {
    const productFindManyArgs: Prisma.ProductFindManyArgs = {
      where: { area },
      orderBy: {
        orders: {
          _count: 'desc',
        },
      },
      select: {
        id: true,
        name: true,
        category: true,
        area: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
      take: 10,
    };

    const products = await this.productsRepository.findAll(productFindManyArgs);

    return products.map(
      ({ _count, ...product }: ProductDTO & { _count: { orders: number } }) => {
        return { ...product, ordersCount: _count.orders };
      },
    );
  }
}
