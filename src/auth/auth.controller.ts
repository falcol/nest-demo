import { Body, Controller, Get, HttpException, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RedisService } from '../redis-ws/redis.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { RefreshTokenDto } from './dto/refresh-totken.dto';
import { JwtGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth() // Need to swagger
export class AuthController {
	constructor(
		private authService: AuthService,
		private redisService: RedisService,
	) {}

	// @UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Body() authUserDto: AuthUserDto) {
		const checkUser = await this.authService.validateUser(authUserDto.email, authUserDto.password);
		if (checkUser) {
			return await this.authService.login(checkUser);
		}

		throw new HttpException(
			{
				status: HttpStatus.UNAUTHORIZED,
				error: 'Email or password incorrect',
			},
			HttpStatus.UNAUTHORIZED,
		);
	}

	@Post('register')
	async registerUser(@Body() createUserDto: CreateUserDto) {
		return await this.authService.signUp(createUserDto);
	}

	@Post('refresh')
	async refreshToken(@Body() refreshToken: RefreshTokenDto) {
		return await this.authService.refreshToken(refreshToken.refreshToken);
	}

	@Post('expries-in')
	async expriesIn(@Body() refreshToken: RefreshTokenDto) {
		return this.authService.getExpiresIn(refreshToken.refreshToken);
	}

	@Get('profile')
	@UseGuards(JwtGuard)
	getProfile(@Request() req) {
		return req.user;
	}

	@Get('publish')
	async publishTest() {
		return await this.redisService.publish('test', 'mess');
	}
}
