import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { UsersModule } from '../src/modules/users/users.module';
import { UsersService } from '../src/modules/users/users.service';
import is from 'zod/v4/locales/is.js';

describe('UsersController (e2e)', () => {
    let app: INestApplication<App>;
    let usersService: UsersService;
    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        // const moduleFixture: TestingModule = await Test.createTestingModule({
        //     imports: [UsersModule],
        // }).compile();
        usersService = moduleFixture.get<UsersService>(UsersService);

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/users (GET)', async () => {
        const mockUsers = [
            {
                id: 1, userName: 'John Doe',
                email: 'john@example.com',
                password: 'securepassword',
                age: 30,
                isActive: true,
                roles: ['user'],
                createdAt: new Date(),
                updatedAt: new Date(),
                products: [],
            },
            {
                id: 2, userName: 'Jane Doe',
                email: 'jane@example.com',
                password: 'securepassword',
                age: 25,
                isActive: true,
                roles: ['user'],
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
        const createUserDto = {
            userName: 'auto',
            email: 'auto@example.com',
            password: 'testpassword123',
            isActive: true,
            age: 25,
            roles: ['user']
        };

        // Create user
        const createResponse = await request(app.getHttpServer())
            .post('/users')
            .send(createUserDto);
    
        expect(createResponse.status).toBe(201);

        // Login to get token
        const loginDto = {
            email: 'auto@example.com',
            password: 'testpassword123'
        };

        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto);
        
        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.access_token).toBeDefined();

        const token = loginResponse.body.access_token;

        // Use token in protected request
        const protectedResponse = await request(app.getHttpServer())
            .get('/users')
            .set('Authorization', `Bearer ${token}`);
        
        expect(protectedResponse.status).toBe(200);
    });
    afterAll(async () => {
        await app.close();
    });
});