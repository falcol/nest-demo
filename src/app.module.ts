import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import typeorm from './config/typeOrm.config';
import { PostsModule } from './posts/posts.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [typeorm],
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => configService.get('typeorm'),
		}),
		ConfigModule.forRoot({ envFilePath: '.env' }),
		UserModule,
		PostsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
