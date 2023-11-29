import { MigrationInterface, QueryRunner } from "typeorm";

export class Ifiledb1701231209070 implements MigrationInterface {
    name = 'Ifiledb1701231209070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ifile" ("pk" SERIAL NOT NULL, "id" text NOT NULL, "name" text NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "order" integer NOT NULL, "s1_name" text NOT NULL, "s2_name" text NOT NULL, "color_name" text NOT NULL, CONSTRAINT "PK_506caab9ee5bd87a478af199e01" PRIMARY KEY ("pk"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ifile"`);
    }

}
