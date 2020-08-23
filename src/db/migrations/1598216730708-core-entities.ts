import {MigrationInterface, QueryRunner} from "typeorm";

export class coreEntities1598216730708 implements MigrationInterface {
    name = 'coreEntities1598216730708'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core_meta_view" ADD CONSTRAINT "UQ_ab963a64be999f260b0c2e57821" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core_meta_view" DROP CONSTRAINT "UQ_ab963a64be999f260b0c2e57821"`);
    }

}
