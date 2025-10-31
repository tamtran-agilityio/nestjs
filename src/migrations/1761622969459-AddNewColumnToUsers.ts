import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewColumnToUsers1761622969459 implements MigrationInterface {
  name = 'AddNewColumnToUsers1761622969459';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "roles" text NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
  }
}
