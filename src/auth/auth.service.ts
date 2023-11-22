import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private jwtService: JwtService,
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.userService.findUserByEmail(email);
		if (user && (await user.validatePassword(password))) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, ...result } = user;
			return result;
		}
		return null;
	}

	async login(user) {
		const payload = {
			email: user.email,
			sub: {
				username: user.username,
			},
		};

		return {
			accessToken: this.jwtService.sign(payload),
			refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
		};
	}

	async refreshToken(user: User) {
		const payload = {
			email: user.email,
			sub: {
				username: user.username,
			},
		};

		return {
			accessToken: this.jwtService.sign(payload),
		};
	}
}
