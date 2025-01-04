import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { GetTopProductsDTO } from './dto/get-top-products';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  // Tests will go here
  describe('getTopOrderedProducts', () => {
    it('should return the top 10 ordered products for a given area', async () => {
      const area = 'Maadi';
      const dto: GetTopProductsDTO = { area };
      const mockProducts = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        name: `Product ${index + 1}`,
        category: 'Product Category',
        area,
        _count: { orders: 100 - index },
      }));
      (productRepository.findAll as jest.Mock).mockResolvedValue(mockProducts);

      const result = await productService.getTopOrderedProducts(dto);

      expect(productRepository.findAll).toHaveBeenCalledWith({
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
      });
      expect(result).toEqual(
        mockProducts.map(({ _count, ...product }) => ({
          ...product,
          ordersCount: _count.orders,
        })),
      );
    });
  });
});
