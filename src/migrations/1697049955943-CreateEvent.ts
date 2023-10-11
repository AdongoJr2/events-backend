import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEvent1697049955943 implements MigrationInterface {
  name = 'CreateEvent1697049955943';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "event" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying(256),
                "description" text,
                "eventVenue" character varying(256) NOT NULL,
                "eventDate" TIMESTAMP WITH TIME ZONE NOT NULL,
                "latitude" double precision,
                "longitude" double precision,
                "eventCategoryId" integer,
                CONSTRAINT "UQ_b535fbe8ec6d832dde22065ebdb" UNIQUE ("name"),
                CONSTRAINT "UQ_d345d5fafe5dd3261d69a295068" UNIQUE ("description"),
                CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "event"
            ADD CONSTRAINT "FK_c23e03034cb11fd05bd2962ba45" FOREIGN KEY ("eventCategoryId") REFERENCES "event_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "event" DROP CONSTRAINT "FK_c23e03034cb11fd05bd2962ba45"
        `);
    await queryRunner.query(`
            DROP TABLE "event"
        `);
  }
}
