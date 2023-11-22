import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Posts } from '../../posts/entities/post.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'text',
		unique: true,
	})
	email: string;

	@Column({
		type: 'text',
	})
	password: string;

	@Column({
		type: 'text',
		nullable: true,
	})
	username: string;

	@Column({ default: true })
	isActive: boolean;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@OneToMany(() => Posts, (post) => post.user)
	posts: Posts[];
}
