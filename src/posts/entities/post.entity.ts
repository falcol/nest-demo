import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('posts')
export class Posts {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'text',
	})
	title: string;

	@Column({
		type: 'text',
	})
	content: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@ManyToOne(() => User, (user) => user.posts)
	user: User;
}
