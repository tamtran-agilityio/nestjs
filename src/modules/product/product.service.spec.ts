import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ExceptionService } from '../../common/exceptions/exception.service';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;
  let exceptionService: ExceptionService;

  const mockProductRepository = {
    findOneBy: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  };

  const mockExceptionService = {
    throwEntityNotFound: jest.fn(),
    throwDuplicateEntity: jest.fn(),
    ensureEntityExists: jest.fn((entity, name, id) => {
      if (!entity) {
        throw new Error(`${name} with id ${id} not found`);
      }
      return entity;
    }),
    ensureNoDuplicate: jest.fn((exists, field, value) => {
      if (exists) {
        throw new Error(`${field} ${value} already exists`);
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: ExceptionService,
          useValue: mockExceptionService,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
