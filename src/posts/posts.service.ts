import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
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
	) {}

	async create(createPostDto: CreatePostDto) {
		try {
			const user = await this.userRepository.findOneBy({ id: createPostDto.userId });
			const newPost = new Posts();
			newPost.title = createPostDto.title;
			newPost.content = createPostDto.content;
			newPost.user = user;
			const post = await this.postRepository.save(newPost);
			return post;
		} catch (error) {
			throw new HttpException(
				{
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					error: error.detail,
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
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
