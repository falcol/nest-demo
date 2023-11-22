import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
	@ApiProperty({
		description: 'Id of user create post',
		example: 1,
	})
	@IsNotEmpty()
	readonly userId: number;

	@ApiProperty({
		description: 'Title of the post',
		example: 'title',
	})
	@IsNotEmpty()
	readonly title: string;

	@ApiProperty({
		description: 'The content of the post',
		example: 'Content',
	})
	@IsNotEmpty()
	readonly content: string;
}
