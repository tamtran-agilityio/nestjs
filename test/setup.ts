import { DataSource } from 'typeorm';
import { User } from '../src/modules/users/entities/user.entity';
import { Product } from '../src/modules/product/entities/product.entity';

let dataSource: DataSource;

beforeAll(async () => {
  dataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    entities: [User, Product],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
});

afterAll(async () => {
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
  }
});

afterEach(async () => {
  if (dataSource && dataSource.isInitialized) {
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    }
  }
});
