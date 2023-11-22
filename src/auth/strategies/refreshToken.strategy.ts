import { PassportStrategy } from '@nestjs/passport';
import { config } from 'dotenv';
import { ExtractJwt, Strategy } from 'passport-jwt';
config({ path: '.env' });
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
			ignoreExpiration: false,
			secretOrKey: `${process.env.JWT_SECRET}`,
		});
	}

	async validate(payload: any) {
		return { user: payload.sub, username: payload.username };
	}
}
