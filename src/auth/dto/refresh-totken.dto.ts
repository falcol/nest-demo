import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
	@ApiProperty({
		description: 'refreshToken',
		example: '12345678',
	})
	@IsNotEmpty()
	readonly token: string;
}
