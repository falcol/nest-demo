import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTableName1700624829448 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.renameTable('post', 'posts');
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.renameTable('posts', 'post');
	}
}
