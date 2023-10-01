import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrate1694596567621 implements MigrationInterface {
  name = 'Migrate1694596567621';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contact-information" DROP CONSTRAINT "UQ_dfa6566792b76dae636f3608758"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contact-information" ADD CONSTRAINT "UQ_dfa6566792b76dae636f3608758" UNIQUE ("email")`
    );
  }
}
