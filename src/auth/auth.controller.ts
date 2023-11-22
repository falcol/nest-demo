import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { JwtGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth() // Need to swagger
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService,
	) {}

	// @UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Body() authUserDto: AuthUserDto) {
		const checkUser = await this.authService.validateUser(
			authUserDto.email,
			authUserDto.password,
		);
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
		return await this.userService.create(createUserDto);
	}

	@Post('refresh')
	@UseGuards(JwtGuard)
	async refrshToken(@Request() req) {
		return this.authService.refreshToken(req.user);
	}

	@Get('profile')
	@UseGuards(JwtGuard)
	getProfile(@Request() req) {
		return req.user;
	}
}
