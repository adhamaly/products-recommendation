import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetAllProductsDTO } from './dto/get-all-products.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetTopProductsDTO } from './dto/get-top-products';
import { CustomResponse } from 'src/common/interfaces/custom-response.class';
import { ProductParamDto } from './dto/product-id-param.dto';

@Controller('products')
@ApiTags('Products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  async getAllProducts(@Query() filters: GetAllProductsDTO) {
    const result = await this.productsService.getAllProducts(filters);
    return new CustomResponse().success({
      payload: result,
    });
  }

  @Get('top-ordered-products')
  async getTopOrderProducts(@Query() getTopProductsDTO: GetTopProductsDTO) {
    const topOrderedProducts =
      await this.productsService.getTopOrderedProducts(getTopProductsDTO);

    return new CustomResponse().success({
      payload: { data: topOrderedProducts },
    });
  }

  @Get(':productId')
  async getProductById(@Param() productParamDto: ProductParamDto) {
    const product = await this.productsService.getProductById(productParamDto);
    return new CustomResponse().success({
      payload: { data: product },
    });
  }
}
