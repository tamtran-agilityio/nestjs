import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { ProductService } from '../src/modules/product/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../src/modules/users/users.module';
import { AuthModule } from '../src/modules/auth/auth.module';
import { CommonModule } from '../src/common/common.module';
import { User } from '../src/modules/users/entities/user.entity';
import { Product } from '../src/modules/product/entities/product.entity';
import { ProductModule } from '../src/modules/product/product.module';

describe('ProductsController (e2e)', () => {
  let app: INestApplication<App>;
  let productService: ProductService;

  beforeEach(async () => {
    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.JWT_EXPIRES_IN = '3600';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Product],
          synchronize: true,
          logging: false,
        }),
        CacheModule.register({
          isGlobal: true,
        }),
        CommonModule,
        UsersModule,
        ProductModule,
        AuthModule.forRoot({
          secret: 'test-secret-key',
          expiresIn: 3600,
        }),
      ],
    }).compile();
    productService = moduleFixture.get<ProductService>(ProductService);

    app = moduleFixture.createNestApplication();

    // Apply global configurations that might be needed
    // Check if there are global guards/filters/interceptors that need to be applied

    await app.init();
  });

  const initUserAndGetToken = async () => {
    const smokeTestUser = {
      userName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
    };

    // Sign up smoke test user
    await request(app.getHttpServer()).post('/auth/signup').send(smokeTestUser);

    // Login to get token
    const loginDto = {
      email: smokeTestUser.email,
      password: smokeTestUser.password,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    expect(response.status).toBe(200);
    expect(response.body.access_token).toBeDefined();

    // Let's decode the token to see what it contains
    return response.body.access_token;
  };

  it('should create product', async () => {
    const token = await initUserAndGetToken();
    const randomName = faker.person.fullName();
    const createProductDto = {
      name: randomName,
      description: 'Description for Product 1',
      price: 100,
    };

    const response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send(createProductDto);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(createProductDto));
  });

  it('/products (GET)', async () => {
    const token = await initUserAndGetToken();
    const randomName = faker.person.fullName();
    const createProductDto = {
      name: randomName,
      description: 'Description for Product 1',
      price: 100,
    };

    const createResponse = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send(createProductDto);

    expect(createResponse.status).toBe(201);

    // Verify the created product can be retrieved
    const responseDetails = await request(app.getHttpServer())
      .get(`/products/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(responseDetails.status).toBe(200);
    expect(responseDetails.body).toEqual(
      expect.objectContaining(createProductDto),
    );

    // Now test the /products GET endpoint
    const response = await request(app.getHttpServer())
      .get('/products?limit=10&page=1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data.products)).toBe(true);
    expect(response.body.data.products).toEqual([createResponse.body]);
  });

  describe('PATCH /products/:id', () => {
    // Implement tests for updating a product
    it('should update product details', async () => {
      const token = await initUserAndGetToken();
      const randomName = faker.person.fullName();
      const createProductDto = {
        name: randomName,
        description: 'Description for Product 1',
        price: 100,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(createProductDto);

      expect(createResponse.status).toBe(201);

      const updateProductDto = {
        name: faker.person.fullName(),
        description: 'Updated Description',
        price: 150,
      };

      const response = await request(app.getHttpServer())
        .patch(`/products/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateProductDto);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining(updateProductDto));
    });
  });

  describe('DELETE /products/:id', () => {
    // Implement tests for deleting a product
    it('should delete product', async () => {
      const token = await initUserAndGetToken();
      const randomName = faker.person.fullName();
      const createProductDto = {
        name: randomName,
        description: 'Description for Product to be deleted',
        price: 200,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(createProductDto);

      expect(createResponse.status).toBe(201);

      const response = await request(app.getHttpServer())
        .delete(`/products/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);

      // Verify deletion
      const verifyResponse = await request(app.getHttpServer())
        .get(`/products/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(verifyResponse.status).toBe(404);
    });

    it('should return 404 when deleting non-existent product', async () => {
      const token = await initUserAndGetToken();
      const nonExistentProductId = 'non-existent-id';

      const response = await request(app.getHttpServer())
        .delete(`/products/${nonExistentProductId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
