import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './entities/post.entity';

@Injectable()
export class PostsService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(Posts)
		private postRepository: Repository<Posts>,
		private dataSource: DataSource,
	) {}

	async create(createPostDto: CreatePostDto) {
		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const user = await queryRunner.manager.findOneByOrFail(User, { id: createPostDto.userId });
			const newPost = new Posts();
			newPost.title = createPostDto.title;
			newPost.content = createPostDto.content;
			newPost.user = user;

			const post = await queryRunner.manager.save(newPost);

			await queryRunner.commitTransaction();

			return post;
		} catch (error) {
			await queryRunner.rollbackTransaction();

			throw new HttpException(
				{
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					error: error.detail || error.message,
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		} finally {
			await queryRunner.release();
		}
	}

	async findAll() {
		return await this.postRepository
			.createQueryBuilder('posts')
			.innerJoinAndSelect('posts.user', 'user')
			.select(['posts', 'user.username'])
			.getMany();
	}

	async findOne(postId: number) {
		// return await this.postRepository.findOne({ where: { id: id }, relations: ['user'] });
		return await this.postRepository
			.createQueryBuilder('posts')
			.innerJoin('posts.user', 'user')
			.select(['posts.title', 'posts.content', 'user.username', 'user.email'])
			.where('posts.id = :postId', { postId })
			.getOne();
	}

	async update(id: number, updatePostDto: UpdatePostDto) {
		return { id: id, data: updatePostDto };
	}

	async remove(id: number) {
		return `This action removes a #${id} post`;
	}
}
