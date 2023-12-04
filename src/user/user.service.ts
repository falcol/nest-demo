import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(createUserDto: CreateUserDto): Promise<any> {
		try {
			// Hash the password
			const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

			// Replace the plain text password with the hashed password
			createUserDto.password = hashedPassword;

			const createdUser = await this.prismaService.$transaction([
				this.prismaService.user.create({
					data: createUserDto,
				}),
			]);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, ...newUser } = createdUser[0];
			return newUser;
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
		return await this.prismaService.user.findMany({
			select: {
				email: true,
				username: true,
				isActive: true,
				posts: {
					select: {
						title: true,
						content: true,
					},
				},
			},
		});
	}

	async findUserByEmail(email: string) {
		return await this.prismaService.user.findUnique({
			where: {
				email: email,
			},
		});
	}

	async findOne(id: number): Promise<any> {
		return await this.prismaService.user.findUnique({
			where: {
				id: Number(id),
			},
			select: {
				email: true,
				username: true,
				isActive: true,
				posts: {
					select: {
						title: true,
						content: true,
					},
				},
			},
		});
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		return { id: id, user: updateUserDto };
	}

	async remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
