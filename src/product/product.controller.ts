import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetAllProductsDTO } from './dto/get-all-products.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetTopProductsDTO } from './dto/get-top-products';

@Controller('products')
@ApiTags('Products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  async getAllProducts(@Query() filters: GetAllProductsDTO) {
    return this.productsService.getAllProducts(filters);
  }

  @Get('top-ordered-products')
  async getTopOrderProducts(@Query() getTopProductsDTO: GetTopProductsDTO) {
    const topOrderedProducts =
      await this.productsService.getTopOrderedProducts(getTopProductsDTO);

    return topOrderedProducts;
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(Number(id));
  }
}
