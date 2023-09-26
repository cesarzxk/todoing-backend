import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableSchedulling1695577021994 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "schedulling",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "title",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "description",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "time",
            type: "timestamp",
            isNullable: false,
          },
          {
            name: "duration",
            type: "timestamp",
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("schedulling");
  }
}
