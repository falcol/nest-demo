import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@IsInt()
	@ApiProperty({
		description: 'id user',
		example: 1,
	})
	id: number;

	@IsEmail()
	@ApiProperty({
		description: 'The email of the user',
		example: 'email@email.com',
	})
	email?: string;

	@ApiProperty({
		description: 'The name of the user',
		example: 'John Doe',
	})
	username?: string;
}
