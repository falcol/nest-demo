import { Posts } from 'src/posts/entities/post.entity';

export class TokenUserDto {
	readonly id: number;
	readonly email: string;
	readonly username: string;
	readonly isActive: boolean;
	readonly created_at: Date;
	readonly updated_at: Date;
	readonly posts: Posts[];
}
