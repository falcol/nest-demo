import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { TokenUserDto } from './dto/token-user.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private jwtService: JwtService,
		private configService: ConfigService,
	) {}

	async validateUser(email: string, password: string): Promise<TokenUserDto | any> {
		const user = await this.userService.findUserByEmail(email);
		if (user && (await user.validatePassword(password))) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, ...result } = user;
			return result;
		}
		return null;
	}

	async signUp(createUserDto: CreateUserDto): Promise<any> {
		// Check if user exists
		const userExists = await this.userService.findUserByEmail(createUserDto.email);
		if (userExists) {
			throw new BadRequestException('User already exists');
		}

		// Hash password
		const newUser = await this.userService.create(createUserDto);
		return await this.login(newUser);
	}

	async login(user: TokenUserDto) {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(
				{
					sub: {
						username: user.username,
						email: user.email,
						isActive: user.isActive,
					},
					email: user.email,
				},
				{
					secret: this.configService.get<string>('JWT_SECRET'),
					expiresIn: '15m',
				},
			),
			this.jwtService.signAsync(
				{
					sub: {
						username: user.username,
						email: user.email,
						isActive: user.isActive,
					},
					email: user.email,
				},
				{
					secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
					expiresIn: '7d',
				},
			),
		]);

		return {
			accessToken,
			refreshToken,
		};
	}

	async refreshToken(refreshToken: string): Promise<any> {
		try {
			const decodedToken = await this.jwtService.verifyAsync(refreshToken, {
				secret: this.configService.get<string>('JWT_REFRESH_SECRET'), // Replace with actual secret key
			});
			const { email } = decodedToken;

			const user = await this.userService.findUserByEmail(email);
			if (!user) {
				throw new UnauthorizedException('Invalid refresh token');
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, ...result } = user;
			return await this.login(result);
		} catch (error) {
			throw new UnauthorizedException('Invalid refresh token');
		}
	}

	getExpiresIn(token: string) {
		const decodedToken = this.jwtService.decode(token);
		return new Date(decodedToken.exp * 1000) > new Date();
	}
}
