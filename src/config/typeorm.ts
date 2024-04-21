import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { error } from 'console';

export const dataBaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  database: configService.get('DB_NAME'),
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: ['error'],
  dropSchema: false,
});
