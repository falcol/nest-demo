import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async canActivate(context: ExecutionContext): Promise<any> {
		const request = context.switchToHttp().getRequest();
		const client = context.switchToWs().getClient();

		const token = request.handshake.auth['token'] || request.handshake.headers['authorization'];

		if (!token) {
			throw new WsException('Invalid token');
		}

		try {
			const user = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get<string>('JWT_SECRET'), // Replace with actual secret key
			});
			client.user = user;
			return true;
		} catch (error) {
			client.emit('unauthorized', { message: '401 Unauthorized' });
			throw new WsException('Invalid token');
		}
	}
}
