import { MigrationInterface, QueryRunner } from "typeorm";

export class PostToPosts11700624249245 implements MigrationInterface {
    name = 'PostToPosts11700624249245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "UQ_e28aa0c4114146bfb1567bfa9ac"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "UQ_e28aa0c4114146bfb1567bfa9ac" UNIQUE ("title")`);
    }

}
