import {MigrationInterface, QueryRunner} from "typeorm";

export class coreEntities1597611280853 implements MigrationInterface {
    name = 'coreEntities1597611280853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core_meta_translation" ADD "group" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core_meta_translation" DROP COLUMN "group"`);
    }

}
