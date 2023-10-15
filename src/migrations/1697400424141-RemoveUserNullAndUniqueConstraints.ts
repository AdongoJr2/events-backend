import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUserNullAndUniqueConstraints1697400424141
  implements MigrationInterface
{
  name = 'RemoveUserNullAndUniqueConstraints1697400424141';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "phoneNumber" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_f2578043e491921209f5dadd080"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber")
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "phoneNumber"
            SET NOT NULL
        `);
  }
}
