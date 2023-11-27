import { registerAs } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config({ path: '.env' });

const dbConfig = {
	type: 'postgres',
	host: `${process.env.HOST}`,
	port: `${process.env.PORT}`,
	username: `${process.env.POSTGRES_USER}`,
	password: `${process.env.POSTGRES_PASSWORD}`,
	database: `${process.env.POSTGRES_DB}`,
	entities: [__dirname + '/**/**/entities/*.entity{.ts,.js}'],
	migrations: [__dirname + '/**/**/migrations/*{.ts,.js}'],
	autoLoadEntities: true,
	synchronize: false,
	migrationsRun: false,
	logging: true,
};

export default registerAs('typeorm', () => dbConfig);
export const connectionSource = new DataSource(dbConfig as DataSourceOptions);
