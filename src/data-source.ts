import { DataSource } from 'typeorm';
import { User } from './modules/users/entities/user.entity';

export const AppDataSource = new DataSource({
    type: 'postgres', // or 'mysql', 'sqlite', etc.
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'db_password',
    database: process.env.DB_NAME || 'products_db',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    entities: [User],
    migrations: ['src/migrations/*.ts'],
    subscribers: ['src/subscribers/*.ts'],
});
