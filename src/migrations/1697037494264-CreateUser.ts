import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1697037494264 implements MigrationInterface {
  name = 'CreateUser1697037494264';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'customer')
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "firstName" character varying(200) NOT NULL,
                "lastName" character varying(200) NOT NULL,
                "username" character varying(200),
                "email" character varying NOT NULL,
                "phoneNumber" character varying NOT NULL,
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'customer',
                "password" character varying NOT NULL,
                "imageURL" character varying,
                "passwordResetToken" character varying,
                "passwordResetExpires" TIMESTAMP,
                CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."user_role_enum"
        `);
  }
}
