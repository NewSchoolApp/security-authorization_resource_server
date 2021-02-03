import { MigrationInterface, QueryRunner } from 'typeorm';

export class Policy1612354794699 implements MigrationInterface {
  name = 'Policy1612354794699';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `role_policies_policy` (`roleId` varchar(36) NOT NULL, `policyId` varchar(36) NOT NULL, INDEX `IDX_77a05aab87336e865f79c05874` (`roleId`), INDEX `IDX_e7d4d602e498d9684443f6ba13` (`policyId`), PRIMARY KEY (`roleId`, `policyId`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `role_policies_policy`');
  }
}
