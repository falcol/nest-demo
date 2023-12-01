import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private dataSource: DataSource,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const newUser = new User();
			newUser.username = createUserDto.username;
			newUser.email = createUserDto.email;
			newUser.password = createUserDto.password;

			const createdUser = await queryRunner.manager.save(newUser);

			await queryRunner.commitTransaction();

			return createdUser;
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
		return await this.userRepository
			.createQueryBuilder('user')
			.select(['user.username', 'user.email', 'posts.title', 'posts.content'])
			.leftJoin('user.posts', 'posts')
			.getMany();
	}

	async findUserByEmail(email: string) {
		return await this.userRepository.findOneBy({ email: email });
	}

	async findOne(id: number) {
		return await this.userRepository.findOne({ where: { id: id }, relations: ['posts'] });
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		return { id: id, user: updateUserDto };
	}

	async remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
