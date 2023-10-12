import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserEventCategoryInterests1697137780864
  implements MigrationInterface
{
  name = 'CreateUserEventCategoryInterests1697137780864';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user_interests_event_category" (
                "userId" integer NOT NULL,
                "eventCategoryId" integer NOT NULL,
                CONSTRAINT "PK_81e06fe4164907a8d779823586c" PRIMARY KEY ("userId", "eventCategoryId")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_634338a922af4c75c8d0720cf7" ON "user_interests_event_category" ("userId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_48687508825b1244f69dd94b50" ON "user_interests_event_category" ("eventCategoryId")
        `);
    await queryRunner.query(`
            ALTER TABLE "user_interests_event_category"
            ADD CONSTRAINT "FK_634338a922af4c75c8d0720cf76" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "user_interests_event_category"
            ADD CONSTRAINT "FK_48687508825b1244f69dd94b50b" FOREIGN KEY ("eventCategoryId") REFERENCES "event_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_interests_event_category" DROP CONSTRAINT "FK_48687508825b1244f69dd94b50b"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_interests_event_category" DROP CONSTRAINT "FK_634338a922af4c75c8d0720cf76"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_48687508825b1244f69dd94b50"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_634338a922af4c75c8d0720cf7"
        `);
    await queryRunner.query(`
            DROP TABLE "user_interests_event_category"
        `);
  }
}
