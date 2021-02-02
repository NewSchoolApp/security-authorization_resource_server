import { MigrationInterface, QueryRunner } from 'typeorm';

export class Policy1612264163519 implements MigrationInterface {
  name = 'Policy1612264163519';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` DROP FOREIGN KEY `FK_79e70f077097a14304b7e3532ee`',
    );
    await queryRunner.query(
      'ALTER TABLE `user` DROP FOREIGN KEY `FK_c28e52f758e7bbc53828db92194`',
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` DROP FOREIGN KEY `FK_9f7c3ad73ecbfbe87b666f4dae6`',
    );
    await queryRunner.query(
      'ALTER TABLE `change_password` DROP FOREIGN KEY `FK_46bfee4492162a8886653c39674`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_ae4578dcaed5adff96595e6166` ON `role`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_c6528d2d9ab22e6802915fd9f9` ON `client-credentials`',
    );
    await queryRunner.query('DROP INDEX `id_UNIQUE` ON `school`');
    await queryRunner.query(
      'CREATE TABLE `policy` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `version` int NOT NULL, `id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `slug` varchar(255) NOT NULL, UNIQUE INDEX `IDX_bbf1ced3d7b178c4ebfa7dda8d` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query('ALTER TABLE `school` DROP COLUMN `createdAt`');
    await queryRunner.query('ALTER TABLE `school` DROP COLUMN `updatedAt`');
    await queryRunner.query(
      'ALTER TABLE `role` ADD `slug` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `role` ADD UNIQUE INDEX `IDX_35c9b140caaf6da09cfabb0d67` (`slug`)',
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
    await queryRunner.query(
      'ALTER TABLE `user` ADD CONSTRAINT `FK_79e70f077097a14304b7e3532ee` FOREIGN KEY (`invitedByUserId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD CONSTRAINT `FK_c28e52f758e7bbc53828db92194` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` ADD CONSTRAINT `FK_9f7c3ad73ecbfbe87b666f4dae6` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `change_password` ADD CONSTRAINT `FK_46bfee4492162a8886653c39674` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
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
      'ALTER TABLE `role` DROP INDEX `IDX_35c9b140caaf6da09cfabb0d67`',
    );
    await queryRunner.query('ALTER TABLE `role` DROP COLUMN `slug`');
    await queryRunner.query(
      'ALTER TABLE `school` ADD `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query(
      'ALTER TABLE `school` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_bbf1ced3d7b178c4ebfa7dda8d` ON `policy`',
    );
    await queryRunner.query('DROP TABLE `policy`');
    await queryRunner.query(
      'CREATE UNIQUE INDEX `id_UNIQUE` ON `school` (`id`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_c6528d2d9ab22e6802915fd9f9` ON `client-credentials` (`name`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_ae4578dcaed5adff96595e6166` ON `role` (`name`)',
    );
    await queryRunner.query(
      'ALTER TABLE `change_password` ADD CONSTRAINT `FK_46bfee4492162a8886653c39674` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `client-credentials` ADD CONSTRAINT `FK_9f7c3ad73ecbfbe87b666f4dae6` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD CONSTRAINT `FK_c28e52f758e7bbc53828db92194` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD CONSTRAINT `FK_79e70f077097a14304b7e3532ee` FOREIGN KEY (`invitedByUserId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT',
    );
  }
}
