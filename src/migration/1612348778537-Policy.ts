import { MigrationInterface, QueryRunner } from 'typeorm';

export class Policy1612348778537 implements MigrationInterface {
  name = 'Policy1612348778537';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `client-credentials` ADD `slug` varchar(255) NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `client-credentials` DROP COLUMN `slug`',
    );
  }
}
