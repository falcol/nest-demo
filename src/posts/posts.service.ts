import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(createPostDto: CreatePostDto) {
		try {
			const post = await this.prismaService.$transaction(async (prisma) => {
				// Find the user
				const user = await prisma.user.findUnique({
					where: { id: createPostDto.userId },
				});

				if (!user) {
					throw new Error('User not found');
				}

				// Create the post
				const newPost = await prisma.post.create({
					data: {
						title: createPostDto.title,
						content: createPostDto.content,
						user: {
							connect: { id: user.id },
						},
					},
				});

				return newPost;
			});

			return post;
		} catch (error) {
			throw new HttpException(
				{
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					error: error.message,
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async findAll() {
		return await this.prismaService.post.findMany({
			select: {
				title: true,
				content: true,
				user: {
					select: {
						id: true,
						username: true,
						email: true,
					},
				},
			},
		});
	}

	async findOne(postId: number) {
		return await this.prismaService.post.findUnique({
			where: { id: postId },
			select: {
				title: true,
				content: true,
				user: {
					select: {
						id: true,
						username: true,
						email: true,
					},
				},
			},
		});
	}

	async update(id: number, updatePostDto: UpdatePostDto) {
		return { id: id, data: updatePostDto };
	}

	async remove(id: number) {
		return `This action removes a #${id} post`;
	}
}
