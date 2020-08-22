import {MigrationInterface, QueryRunner} from "typeorm";

export class coreEntities1598096120417 implements MigrationInterface {
    name = 'coreEntities1598096120417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core_meta_menu_item" ADD "import_id" character varying`);
        await queryRunner.query(`ALTER TABLE "core_meta_menu_item" ADD CONSTRAINT "UQ_5e1104688c48e8e3a7fb327daec" UNIQUE ("import_id")`);
        await queryRunner.query(`ALTER TABLE "core_meta_menu_item" ADD "imported_on" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "core_meta_menu_item" ADD "imported_by" integer`);
        await queryRunner.query(`ALTER TABLE "core_role" ADD "import_id" character varying`);
        await queryRunner.query(`ALTER TABLE "core_role" ADD CONSTRAINT "UQ_0307577fceccfecb0925323b9e5" UNIQUE ("import_id")`);
        await queryRunner.query(`ALTER TABLE "core_role" ADD "imported_on" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "core_role" ADD "imported_by" integer`);
        await queryRunner.query(`ALTER TABLE "core_user" ADD "import_id" character varying`);
        await queryRunner.query(`ALTER TABLE "core_user" ADD CONSTRAINT "UQ_8690812297bb785912483940f27" UNIQUE ("import_id")`);
        await queryRunner.query(`ALTER TABLE "core_user" ADD "imported_on" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "core_user" ADD "imported_by" integer`);
        await queryRunner.query(`ALTER TABLE "core_login" ADD "import_id" character varying`);
        await queryRunner.query(`ALTER TABLE "core_login" ADD CONSTRAINT "UQ_7acb5dfaf6d451ebdd31178e7ba" UNIQUE ("import_id")`);
        await queryRunner.query(`ALTER TABLE "core_login" ADD "imported_on" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "core_login" ADD "imported_by" integer`);
        await queryRunner.query(`ALTER TABLE "core_meta_translation" ADD "import_id" character varying`);
        await queryRunner.query(`ALTER TABLE "core_meta_translation" ADD CONSTRAINT "UQ_5e307c6bb56351d2f9c33a94b28" UNIQUE ("import_id")`);
        await queryRunner.query(`ALTER TABLE "core_meta_translation" ADD "imported_on" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "core_meta_translation" ADD "imported_by" integer`);
        await queryRunner.query(`ALTER TABLE "core_meta_view" ADD "import_id" character varying`);
        await queryRunner.query(`ALTER TABLE "core_meta_view" ADD CONSTRAINT "UQ_d9c791bc00c31b86ded99e82794" UNIQUE ("import_id")`);
        await queryRunner.query(`ALTER TABLE "core_meta_view" ADD "imported_on" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "core_meta_view" ADD "imported_by" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core_meta_view" DROP COLUMN "imported_by"`);
        await queryRunner.query(`ALTER TABLE "core_meta_view" DROP COLUMN "imported_on"`);
        await queryRunner.query(`ALTER TABLE "core_meta_view" DROP CONSTRAINT "UQ_d9c791bc00c31b86ded99e82794"`);
        await queryRunner.query(`ALTER TABLE "core_meta_view" DROP COLUMN "import_id"`);
        await queryRunner.query(`ALTER TABLE "core_meta_translation" DROP COLUMN "imported_by"`);
        await queryRunner.query(`ALTER TABLE "core_meta_translation" DROP COLUMN "imported_on"`);
        await queryRunner.query(`ALTER TABLE "core_meta_translation" DROP CONSTRAINT "UQ_5e307c6bb56351d2f9c33a94b28"`);
        await queryRunner.query(`ALTER TABLE "core_meta_translation" DROP COLUMN "import_id"`);
        await queryRunner.query(`ALTER TABLE "core_login" DROP COLUMN "imported_by"`);
        await queryRunner.query(`ALTER TABLE "core_login" DROP COLUMN "imported_on"`);
        await queryRunner.query(`ALTER TABLE "core_login" DROP CONSTRAINT "UQ_7acb5dfaf6d451ebdd31178e7ba"`);
        await queryRunner.query(`ALTER TABLE "core_login" DROP COLUMN "import_id"`);
        await queryRunner.query(`ALTER TABLE "core_user" DROP COLUMN "imported_by"`);
        await queryRunner.query(`ALTER TABLE "core_user" DROP COLUMN "imported_on"`);
        await queryRunner.query(`ALTER TABLE "core_user" DROP CONSTRAINT "UQ_8690812297bb785912483940f27"`);
        await queryRunner.query(`ALTER TABLE "core_user" DROP COLUMN "import_id"`);
        await queryRunner.query(`ALTER TABLE "core_role" DROP COLUMN "imported_by"`);
        await queryRunner.query(`ALTER TABLE "core_role" DROP COLUMN "imported_on"`);
        await queryRunner.query(`ALTER TABLE "core_role" DROP CONSTRAINT "UQ_0307577fceccfecb0925323b9e5"`);
        await queryRunner.query(`ALTER TABLE "core_role" DROP COLUMN "import_id"`);
        await queryRunner.query(`ALTER TABLE "core_meta_menu_item" DROP COLUMN "imported_by"`);
        await queryRunner.query(`ALTER TABLE "core_meta_menu_item" DROP COLUMN "imported_on"`);
        await queryRunner.query(`ALTER TABLE "core_meta_menu_item" DROP CONSTRAINT "UQ_5e1104688c48e8e3a7fb327daec"`);
        await queryRunner.query(`ALTER TABLE "core_meta_menu_item" DROP COLUMN "import_id"`);
    }

}
