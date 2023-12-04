import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { RedisService } from '../redis-ws/redis.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';
config({ path: '.env' });
@Module({
	providers: [AuthService, JwtStrategy, RefreshJwtStrategy, UserService, RedisService],
	controllers: [AuthController],
	imports: [
		JwtModule.register({
			secret: `${process.env.JWT_SECRET}`,
			signOptions: { expiresIn: '10h' },
		}),
	],
})
export class AuthModule {}
