import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import csv from 'csv-parser';
import detect from 'detect-file-encoding-and-language';
import stream from 'stream';
import { DataSource, Repository } from 'typeorm';
import { CreateIfiledbDto } from './dto/create-ifiledb.dto';
import { UpdateIfiledbDto } from './dto/update-ifiledb.dto';
import { Ifiledb } from './entities/ifiledb.entity';

@Injectable()
export class IfiledbService {
	constructor(
		@InjectRepository(Ifiledb)
		private ifileRepository: Repository<Ifiledb>,
		private dataSource: DataSource,
	) {}

	create(createIfiledbDto: CreateIfiledbDto) {
		return { data: createIfiledbDto };
	}

	findAll() {
		return `This action returns all ifiledb`;
	}

	findOne(id: number) {
		return `This action returns a #${id} ifiledb`;
	}

	update(id: number, updateIfiledbDto: UpdateIfiledbDto) {
		return { id: id, data: updateIfiledbDto };
	}

	remove(id: number) {
		return `This action removes a #${id} ifiledb`;
	}

	async parseCsvBuffer(buffer: Buffer): Promise<CreateIfiledbDto[] | any> {
		// Set init data
		const results: CreateIfiledbDto[] = [];
		// 1 file csv có dạng như sau id,name, from, to, order, s1_name,s2_name,color_name
		const expectedHeaders = ['id', 'name', 'from', 'to', 'order', 's1_name', 's2_name', 'color_name'];
		let rowCount = 0;
		const headerLength = expectedHeaders.length;
		const errorRows = [];
		const fieldRequired = ['name', 'from'];
		const orderMap = {};
		const nameMap = {};
		const groupedData = {};
		const oldQuery = { from: '', id: '' };
		const query = [];

		// Check encoding utf8
		// Trường hợp file CSV end code không phải UTF8 thì bắn lỗi
		await this.checkEncoding(buffer);

		const bufferStream = new stream.PassThrough();
		bufferStream.end(buffer);
		return new Promise((resolve, reject) => {
			bufferStream
				.pipe(csv())
				.on('headers', (headers) => {
					// Check headers are valid
					// Trường hợp header hoặc 1 row nào đó không đủ 8 collumn hoặc thừa ra (bất kể 1 row nào) thì cũng bắn message
					try {
						this.validateHeader(headers, expectedHeaders);
					} catch (error) {
						bufferStream.destroy();
						reject(error);
					}
				})
				.on('data', async (row) => {
					rowCount++;
					try {
						const isEmptyRow = this.isEmptyRows(row, rowCount, errorRows);
						if (!isEmptyRow) {
							const data = new CreateIfiledbDto(row);
							// Trường hợp header hoặc 1 row nào đó không đủ 8 collumn hoặc thừa ra (bất kể 1 row nào) thì cũng bắn message
							this.checkRow(data, headerLength, rowCount, errorRows);
							// Validate bắt buộc nhập cột name,from trong file. Trường nào không nhập thì bắn message cấu trúc {tên hạng mục} require
							this.checkRequiredFields(data, fieldRequired, rowCount, errorRows);
							//  nếu trùng 1 bộ id,from thì order k được trùng lặp. Nếu trùng thì bắn lỗi  Trường hợp trùng lặp thì bắn lỗi "order duplicate"
							this.checkOrder(data, orderMap, rowCount, errorRows);
							// Gom data lại theo Set id, ngày from validate trùng data nếu cùng ID, From mà bộ 3 key: s1_name,s2_name,color_name trùng nhau thì báo message "Duplicate"
							this.checkNames(data, nameMap, rowCount, errorRows);
							// Valid ngày TO (Ngày TO chỉ được phép set cho set cho order = max(order) cuối cùng)
							this.groupData(data, groupedData);
							if (data.id != oldQuery.id || oldQuery.from != data.from) {
								oldQuery.id = data.id;
								oldQuery.from = data.from;
								query.push(oldQuery);
							}
							results.push(data);
						}
					} catch (error) {
						bufferStream.destroy();
						reject(error);
					}
				})
				.on('end', async () => {
					try {
						await Promise.all(query.map((data) => this.groupDataDb(groupedData, data.id, data.from)));
						// Valid ngày TO (Ngày TO chỉ được phép set cho set cho order = max(order) cuối cùng)
						await this.validateGroupedData(groupedData, errorRows);
						if (errorRows.length > 0) {
							throw new HttpException(
								{ errors: errorRows, status: HttpStatus.BAD_REQUEST },
								HttpStatus.BAD_REQUEST,
							);
						}
						resolve(results);
					} catch (error) {
						reject(error);
					}
				})
				.on('error', (error) => {
					bufferStream.destroy();
					reject(error);
				});
		});
	}

	validateHeader(headers: string[], expectedHeaders: string[]) {
		const missingHeaders = expectedHeaders.filter((header) => !headers.includes(header));
		const extraHeaders = headers.filter((header) => !expectedHeaders.includes(header));

		if (missingHeaders.length > 0 || extraHeaders.length > 0) {
			throw new HttpException(
				{
					error: 'The headers in the CSV file do not match the expected headers',
					missingHeaders: `${missingHeaders.join(', ')}`,
					extraHeaders: `${extraHeaders.join(', ')}`,
				},
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	async detectEncoding(fileBuffer: Buffer): Promise<any> {
		const buffer = Buffer.from(fileBuffer);
		return await detect(buffer);
	}

	async checkEncoding(buffer: Buffer) {
		const encode = await this.detectEncoding(buffer);
		const { encoding } = encode;
		if (encoding !== 'UTF-8') {
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					error: 'This file is encoding ' + encoding + ', encoding file must UTF-8',
				},
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	checkOrder(row: any, orderMap: object, rowCount: number, errorRows: string[]) {
		const key = `${row.id}-${row.from}-${row.order}`;
		if (orderMap[key]) {
			errorRows.push(`Order duplicate in row from ${orderMap[key]} and ${rowCount}`);
		}
		orderMap[key] = rowCount;
	}

	checkRow(row: any, headerLength: number, rowCount: number, errorRows: string[]) {
		const rowValues = Object.values(row);
		if (rowValues.length !== headerLength) {
			errorRows.push(`Row ${rowCount} in the CSV file does not have the same number of columns as there are headers.`);
		}
	}

	checkRequiredFields(row: any, fieldRequired: string[], rowCount: number, errorRows: string[]) {
		fieldRequired.forEach((field) => {
			if (!row[field]) {
				errorRows.push(`Row ${rowCount} must be required field: ${field}`);
			}
		});
	}

	checkNames(row: any, nameMap: object, rowCount: number, errorRows: string[]) {
		const key = `${row.id}-${row.from}-${row.s1_name}-${row.s2_name}-${row.color_name}`;
		if (nameMap[key]) {
			errorRows.push(`Duplicate s1_name, s2_name, color_name in row from ${nameMap[key]} and ${rowCount}`);
		}
		nameMap[key] = rowCount;
	}

	groupData(row: any, groupedData: object) {
		const idFromKey = `${row.id}-${row.from}`;
		if (!groupedData[idFromKey]) {
			groupedData[idFromKey] = [];
		}
		groupedData[idFromKey].push(row);
	}

	async groupDataDb(groupedData: object, id: string, from: string) {
		const dataInDB = await this.ifileRepository
			.createQueryBuilder('ifile')
			.select([
				'ifile.id as id',
				'ifile.name as name',
				'ifile.from as from',
				'ifile.to as to',
				'ifile.order as order',
				'ifile.s1_name as s1_name',
				'ifile.s2_name as s2_name',
				'ifile.color_name as color_name',
			])
			.where({ id: id, from: from })
			.distinct(true)
			.getRawMany();

		dataInDB.forEach((data) => {
			const idFromKey = `${data.id}-${data.from}`;
			if (!groupedData[idFromKey]) {
				groupedData[idFromKey] = [];
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { pk, ...result } = data;
			const resultDto = new CreateIfiledbDto(result);
			if (!groupedData[idFromKey].some((obj) => JSON.stringify(obj) === JSON.stringify(resultDto))) {
				groupedData[idFromKey].push(resultDto);
			}
		});
		return groupedData;
	}

	async validateGroupedData(groupedData: object, errors: string[]) {
		for (const [key, group] of Object.entries(groupedData)) {
			const sortedGroup = group.sort((a, b) => a.order - b.order);
			const lastRow = sortedGroup[sortedGroup.length - 1];
			if ((lastRow.to === undefined || lastRow.to === null || lastRow.to === '') && !key.includes('undefined')) {
				errors.push(`Date 'to' must be set for the last order in group ${key}`);
			}
			for (const row of sortedGroup.slice(0, -1)) {
				const errStr = `Date 'to' can only be set for the last order in group ${key} at order ${lastRow.order}`;
				if (row.to !== undefined && row.to !== null && row.to !== '' && !errors.includes(errStr)) {
					errors.push(errStr);
				}
			}
		}
	}

	isEmptyRows(row: any, rowCount: number, errors: string[]): boolean {
		if (Object.keys(row).length === 0) {
			errors.push(`Row ${rowCount} must not be empty`);
			return true;
		}

		return false;
	}

	async insertIfile(ifilesData: CreateIfiledbDto[]) {
		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			// Split the data into chunks of 1000 items
			const chunkSize = 1000;
			for (let i = 0; i < ifilesData.length; i += chunkSize) {
				const chunk = ifilesData.slice(i, i + chunkSize);

				const iFilesArr = chunk.map((data) => {
					return plainToClass(Ifiledb, data);
				});

				await queryRunner.manager.createQueryBuilder(Ifiledb, 'ifile').insert().values(iFilesArr).execute();
			}

			await queryRunner.commitTransaction();
			return { status: HttpStatus.CREATED, message: 'Insert to DB success' };
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
}
