import { DataSource } from 'typeorm';

import * as dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || 'development';

console.log('ENV =>>', env);

export const typeOrmDatasourceConfig = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    env === 'development'
      ? 'src/features/**/entities/*.entity.ts'
      : 'dist/features/**/entities/*.entity.js',
  ],
  migrations: [
    env === 'development' ? './src/migrations/*.ts' : './dist/migrations/*.js',
  ],
  migrationsTableName: 'typeorm_migrations',
  logging: ['query', 'info', 'error', 'log'],
  ssl:
    env === 'development'
      ? false
      : {
          requestCert: false,
          rejectUnauthorized: false, // TODO: use 'true' in production
        },
});
