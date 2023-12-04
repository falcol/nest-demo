import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { IfiledbModule } from './ifiledb/ifiledb.module';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './redis-ws/events.module';
import { RedisModule } from './redis-ws/redis.module';
import { RedisService } from './redis-ws/redis.service';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		PrismaModule,
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
