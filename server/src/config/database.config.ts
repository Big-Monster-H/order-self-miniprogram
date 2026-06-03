import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';

const isSQLite = process.env.DB_TYPE === 'sqlite' || !process.env.DB_HOST;

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  useFactory: () => {
    if (isSQLite) {
      console.log('使用 SQLite 本地数据库: task_platform.db');
      return {
        type: 'better-sqlite3',
        database: join(__dirname, '..', '..', 'task_platform.db'),
        entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
        synchronize: true,
        logging: false,
      };
    }
    return {
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'task_platform',
      entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
      synchronize: true,
      logging: false,
      timezone: '+08:00',
      charset: 'utf8mb4',
    };
  },
};