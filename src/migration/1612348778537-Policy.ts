import { MigrationInterface, QueryRunner } from 'typeorm';

export class Policy1612348778537 implements MigrationInterface {
  name = 'Policy1612348778537';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `FK_79e70f077097a14304b7e3532ee` ON `user`',
    );
    await queryRunner.query(
      'DROP INDEX `FK_c28e52f758e7bbc53828db92194` ON `user`',
    );
    await queryRunner.query(
      'DROP INDEX `FK_9f7c3ad73ecbfbe87b666f4dae6` ON `client-credentials`',
    );
    await queryRunner.query(
      'DROP INDEX `FK_46bfee4492162a8886653c39674` ON `change_password`',
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` ADD `slug` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` ADD UNIQUE INDEX `IDX_7ce06d36e6504d9864b2a6b9c6` (`slug`)',
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query(
      'ALTER TABLE `role` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query('ALTER TABLE `role` DROP COLUMN `name`');
    await queryRunner.query(
      'ALTER TABLE `role` ADD `name` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `role` CHANGE `slug` `slug` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `role` ADD UNIQUE INDEX `IDX_35c9b140caaf6da09cfabb0d67` (`slug`)',
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` DROP COLUMN `name`',
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` ADD `name` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `change_password` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query('ALTER TABLE `school` DROP COLUMN `school`');
    await queryRunner.query(
      'ALTER TABLE `school` ADD `school` varchar(255) NOT NULL',
    );
    await queryRunner.query('ALTER TABLE `school` DROP COLUMN `uf`');
    await queryRunner.query(
      'ALTER TABLE `school` ADD `uf` varchar(255) NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `change_password` DROP FOREIGN KEY `FK_46bfee4492162a8886653c39674`',
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` DROP FOREIGN KEY `FK_9f7c3ad73ecbfbe87b666f4dae6`',
    );
    await queryRunner.query(
      'ALTER TABLE `user` DROP FOREIGN KEY `FK_c28e52f758e7bbc53828db92194`',
    );
    await queryRunner.query(
      'ALTER TABLE `user` DROP FOREIGN KEY `FK_79e70f077097a14304b7e3532ee`',
    );
    await queryRunner.query('ALTER TABLE `school` DROP COLUMN `uf`');
    await queryRunner.query(
      'ALTER TABLE `school` ADD `uf` varchar(100) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL',
    );
    await queryRunner.query('ALTER TABLE `school` DROP COLUMN `school`');
    await queryRunner.query(
      'ALTER TABLE `school` ADD `school` varchar(100) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `change_password` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` DROP COLUMN `name`',
    );
    await queryRunner.query(
      "ALTER TABLE `client-credentials` ADD `name` enum ('NEWSCHOOL@EXTERNAL', 'NEWSCHOOL@FRONT', 'NEWSCHOOL@ADMIN') CHARACTER SET \"latin1\" COLLATE \"latin1_swedish_ci\" NOT NULL",
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query(
      'ALTER TABLE `role` DROP INDEX `IDX_35c9b140caaf6da09cfabb0d67`',
    );
    await queryRunner.query(
      'ALTER TABLE `role` CHANGE `slug` `slug` varchar(255) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NOT NULL',
    );
    await queryRunner.query('ALTER TABLE `role` DROP COLUMN `name`');
    await queryRunner.query(
      "ALTER TABLE `role` ADD `name` enum ('EXTERNAL', 'STUDENT', 'ADMIN') CHARACTER SET \"latin1\" COLLATE \"latin1_swedish_ci\" NOT NULL",
    );
    await queryRunner.query(
      'ALTER TABLE `role` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` DROP INDEX `IDX_7ce06d36e6504d9864b2a6b9c6`',
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` DROP COLUMN `slug`',
    );
    await queryRunner.query(
      'CREATE INDEX `FK_46bfee4492162a8886653c39674` ON `change_password` (`userId`)',
    );
    await queryRunner.query(
      'CREATE INDEX `FK_9f7c3ad73ecbfbe87b666f4dae6` ON `client-credentials` (`roleId`)',
    );
    await queryRunner.query(
      'CREATE INDEX `FK_c28e52f758e7bbc53828db92194` ON `user` (`roleId`)',
    );
    await queryRunner.query(
      'CREATE INDEX `FK_79e70f077097a14304b7e3532ee` ON `user` (`invitedByUserId`)',
    );
  }
}
