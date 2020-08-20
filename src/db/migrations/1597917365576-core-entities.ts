import {MigrationInterface, QueryRunner} from "typeorm";

export class coreEntities1597917365576 implements MigrationInterface {
    name = 'coreEntities1597917365576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core_user" ADD "language_code" character varying`);
        await queryRunner.query(`ALTER TABLE "core_user" ALTER COLUMN "email" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core_user" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "core_user" DROP COLUMN "language_code"`);
    }

}
