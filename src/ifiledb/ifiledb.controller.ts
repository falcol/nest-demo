import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateIfiledbDto } from './dto/create-ifiledb.dto';
import { UpdateIfiledbDto } from './dto/update-ifiledb.dto';
import { IfiledbService } from './ifiledb.service';

@Controller('ifiledb')
@ApiTags('ReadCsvInsertDB')
@ApiBearerAuth() // Need to swagger
export class IfiledbController {
	constructor(private readonly ifiledbService: IfiledbService) {}

	@Post()
	create(@Body() createIfiledbDto: CreateIfiledbDto) {
		return this.ifiledbService.create(createIfiledbDto);
	}

	@Get()
	findAll() {
		return this.ifiledbService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.ifiledbService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateIfiledbDto: UpdateIfiledbDto) {
		return this.ifiledbService.update(+id, updateIfiledbDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.ifiledbService.remove(+id);
	}

	@Post('readcsv')
	@UseInterceptors(FileInterceptor('file'))
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@ApiOperation({ summary: 'Upload CSV file' })
	async getCsvData(@UploadedFile() file: Express.Multer.File): Promise<any> {
		const buffer = Buffer.from(file.buffer);
		const dataIfile = await this.ifiledbService.parseCsvBuffer(buffer);
		return await this.ifiledbService.insertIfile(dataIfile);
	}
}
