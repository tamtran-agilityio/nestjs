import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { faker } from '@faker-js/faker';
import { UsersModule } from '../src/modules/users/users.module';
import { AuthModule } from '../src/modules/auth/auth.module';
import { CommonModule } from '../src/common/common.module';
import { UsersService } from '../src/modules/users/users.service';
import { User } from '../src/modules/users/entities/user.entity';
import { Product } from '../src/modules/product/entities/product.entity';
import authConfig from '../src/config/auth.config';
import { Role } from 'src/common/enums/role.enum';

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>;
  let usersService: UsersService;
  beforeEach(async () => {
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
        JwtModule.register({
          secret: authConfig().secret,
          signOptions: { expiresIn: authConfig().expiresIn },
        }),
        CommonModule,
        UsersModule,
        AuthModule.forRoot({
          secret: authConfig().secret,
          expiresIn: authConfig().expiresIn,
        }),
      ],
    }).compile();
    usersService = moduleFixture.get<UsersService>(UsersService);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', async () => {
    const mockUsers = [
      {
        id: 1,
        userName: 'John Doe',
        email: 'john@example.com',
        password: 'securepassword',
        age: 30,
        isActive: true,
        roles: [Role.USER],
        createdAt: new Date(),
        updatedAt: new Date(),
        products: [],
      },
      {
        id: 2,
        userName: 'Jane Doe',
        email: 'jane@example.com',
        password: 'securepassword',
        age: 25,
        isActive: true,
        roles: [Role.USER],
        createdAt: new Date(),
        updatedAt: new Date(),
        products: [],
      },
    ];
    jest.spyOn(usersService, 'findAll').mockResolvedValue(mockUsers);
    const response = await request(app.getHttpServer()).get('/users');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access token is required');
  });

  it('should create user and login to get token', async () => {
    const smokeTestUser = {
      userName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
    };

    // Sign up smoke test user
    const signUpResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(smokeTestUser);
    expect(signUpResponse.status).toBe(201);

    // Login to get token using the same credentials
    const loginDto = {
      email: smokeTestUser.email,
      password: smokeTestUser.password,
    };

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.access_token).toBeDefined();

    const token = loginResponse.body.access_token || '';

    // Verify get profile
    const profileResponse = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.email).toBe(smokeTestUser.email);

    // Use token in protected request
    const protectedResponse = await request(app.getHttpServer())
      .get('/users?activeOnly=0&page=0')
      .set('Authorization', `Bearer ${token}`);

    expect(protectedResponse.status).toBe(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
