import { MigrationInterface, QueryRunner } from "typeorm";

export class Deletecascade1695737700673 implements MigrationInterface {
  name = "ChangeRelationships1695737700673";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_tag" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "schedullingId" varchar)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_tag"("id", "title", "schedullingId") SELECT "id", "title", "schedullingId" FROM "tag"`
    );
    await queryRunner.query(`DROP TABLE "tag"`);
    await queryRunner.query(`ALTER TABLE "temporary_tag" RENAME TO "tag"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_tag" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "schedullingId" varchar, CONSTRAINT "FK_d79c3c4d99162c59ec3172901e9" FOREIGN KEY ("schedullingId") REFERENCES "schedulling" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_tag"("id", "title", "schedullingId") SELECT "id", "title", "schedullingId" FROM "tag"`
    );
    await queryRunner.query(`DROP TABLE "tag"`);
    await queryRunner.query(`ALTER TABLE "temporary_tag" RENAME TO "tag"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tag" RENAME TO "temporary_tag"`);
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "schedullingId" varchar)`
    );
    await queryRunner.query(
      `INSERT INTO "tag"("id", "title", "schedullingId") SELECT "id", "title", "schedullingId" FROM "temporary_tag"`
    );
    await queryRunner.query(`DROP TABLE "temporary_tag"`);
    await queryRunner.query(`ALTER TABLE "tag" RENAME TO "temporary_tag"`);
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "schedullingId" varchar, CONSTRAINT "FK_d79c3c4d99162c59ec3172901e9" FOREIGN KEY ("schedullingId") REFERENCES "schedulling" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "tag"("id", "title", "schedullingId") SELECT "id", "title", "schedullingId" FROM "temporary_tag"`
    );
    await queryRunner.query(`DROP TABLE "temporary_tag"`);
  }
}
