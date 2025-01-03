import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { GetAllProductsDTO } from './dto/get-all-products.dto';
import { ProductDTO } from './dto/product.dto';
import { Prisma } from '@prisma/client';
import { GetTopProductsDTO } from './dto/get-top-products';
import { ResponsePayload } from 'src/common/interfaces/custom-response.class';
import { ProductParamDto } from './dto/product-id-param.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productsRepository: ProductRepository) {}

  async getAllProducts(
    getAllProductsDTO: GetAllProductsDTO,
  ): Promise<ResponsePayload<ProductDTO>> {
    const { page = 1, limit = 20, categories } = getAllProductsDTO;
    const skip = (page - 1) * limit;

    const filter = categories?.length > 0 && {
      where: {
        category: { in: categories },
      },
    };

    const products = await this.productsRepository.findAll({
      ...filter,
      select: {
        id: true,
        name: true,
        category: true,
        area: true,
      },
      skip: skip,
      take: Number(limit),
    });
    const productsCount = await this.productsRepository.getCount(filter);

    return {
      data: products,
      pages: Math.ceil(productsCount / limit) || 0,
      total: productsCount,
      page: Number(page),
      limit: Number(limit),
    };
  }

  async getProductById({ productId }: ProductParamDto): Promise<ProductDTO> {
    return this.productsRepository.findById(productId);
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
