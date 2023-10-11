import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventCategory1697026951975 implements MigrationInterface {
  name = 'CreateEventCategory1697026951975';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "event_category" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying(256),
                CONSTRAINT "UQ_d2c138089f45f7c3fa916ffb680" UNIQUE ("name"),
                CONSTRAINT "PK_697909a55bde1b28a90560f3ae2" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "event_category"
        `);
  }
}
