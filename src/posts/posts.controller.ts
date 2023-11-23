import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
@ApiTags('Posts')
@ApiBearerAuth() // Need to swagger
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Post()
	async create(@Body() createPostDto: CreatePostDto) {
		return this.postsService.create(createPostDto);
	}

	@Get()
	async findAll() {
		return await this.postsService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return this.postsService.findOne(+id);
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
		return this.postsService.update(+id, updatePostDto);
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		return this.postsService.remove(+id);
	}
}
