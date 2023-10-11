import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenModule } from './features/refresh-token/refresh-token.module';
import { EventCategoryModule } from './features/event-category/event-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          configService.get('NODE_ENV') === 'development'
            ? 'dist/features/**/entities/*.entity.js'
            : 'dist/features/**/entities/*.entity.js',
        ],
        migrations: [
          configService.get('NODE_ENV') === 'development'
            ? 'dist/migrations/*.js'
            : 'dist/migrations/*.js',
        ],
        migrationsTableName: 'typeorm_migrations',
        logging: ['query', 'info', 'error', 'log'],
      }),
    }),
    RefreshTokenModule,
    EventCategoryModule,
  ],
  providers: [],
})
export class AppModule {}
