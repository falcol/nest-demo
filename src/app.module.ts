import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import typeorm from './config/typeOrm.config';
import { PostsModule } from './posts/posts.module';
import { EventsModule } from './redis-ws/events.module';
import { RedisModule } from './redis-ws/redis.module';
import { RedisService } from './redis-ws/redis.service';
import { UserModule } from './user/user.module';
import { IfiledbModule } from './ifiledb/ifiledb.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [typeorm],
			envFilePath: '.env',
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => configService.get('typeorm'),
		}),
		AuthModule,
		UserModule,
		PostsModule,
		RedisModule,
		EventsModule,
		IfiledbModule,
	],
	controllers: [AppController],
	providers: [RedisService, AppService],
})
export class AppModule {}
