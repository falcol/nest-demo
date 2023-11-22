import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthUserDto {
	@ApiProperty({
		description: 'The email of the user',
		example: 'email@gmail.com',
	})
	@IsEmail()
	@IsNotEmpty()
	readonly email: string;

	@ApiProperty({
		description: 'The password of the user',
		example: '12345678',
	})
	@IsNotEmpty()
	readonly password: string;
}
