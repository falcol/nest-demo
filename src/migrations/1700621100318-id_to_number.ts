import { MigrationInterface, QueryRunner } from 'typeorm';

export class IdToNumber1700621100318 implements MigrationInterface {
	name = 'IdToNumber1700621100318';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`,
		);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "id" SERIAL NOT NULL`);
		await queryRunner.query(
			`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`,
		);
		await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "userId"`);
		await queryRunner.query(`ALTER TABLE "post" ADD "userId" integer`);
		await queryRunner.query(
			`ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`,
		);
		await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "userId"`);
		await queryRunner.query(`ALTER TABLE "post" ADD "userId" uuid`);
		await queryRunner.query(
			`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`,
		);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
		await queryRunner.query(
			`ALTER TABLE "users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`,
		);
		await queryRunner.query(
			`ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}
}
