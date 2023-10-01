import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 *checks what environment used to deploy
 */
const env = process.env.NODE_ENV || 'development';
const path =
  env === 'local'
    ? '.env.local'
    : env === 'production'
    ? '.env.production'
    : env === 'stage'
    ? '.env.stage'
    : env === 'stage-v2'
    ? '.env.stage-v2'
    : env === 'stage-v3'
    ? '.env.stage-v3'
    : '.env.development';

dotenv.config({ path });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/src/db/migrations/*.js'],
  synchronize: true,
  logging: false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;

export const seedOrmConfig: TypeOrmModuleOptions = {
  ...dataSourceOptions,
  logging: ['error', 'warn'],
};
