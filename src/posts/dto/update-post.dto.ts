import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
	@ApiProperty({
		description: 'Id of post',
		example: 1,
	})
	@IsNotEmpty()
	readonly postId: number;

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
