import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { AppModule } from '../src/app.module';
import { ProductService } from '../src/modules/product/product.service';
import authConfig from '../src/config/auth.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../src/modules/users/users.module';
import { AuthModule } from '../src/modules/auth/auth.module';
import { CommonModule } from '../src/common/common.module';
import { UsersService } from '../src/modules/users/users.service';
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
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(smokeTestUser);

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

    const responseDetails = await request(app.getHttpServer())
      .get(`/products/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(responseDetails.status).toBe(200);
    expect(responseDetails.body).toEqual(
      expect.objectContaining(createProductDto),
    );

    const response = await request(app.getHttpServer())
      .get('/products?limit=10&page=1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data.products)).toBe(true);
    console.log('Response body:', response.body.data.products);
    // expect(response.body.data.products).toEqual([createResponse.body]);

    // const responses = await request(app.getHttpServer())
    //   .get('/products')
    //   .set('Authorization', `Bearer ${token}`);
    //   console.log('responses body:', responses.body.data.products);
  });
});
