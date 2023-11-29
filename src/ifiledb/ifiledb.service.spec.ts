import { Test, TestingModule } from '@nestjs/testing';
import { IfiledbService } from './ifiledb.service';

describe('IfiledbService', () => {
	let service: IfiledbService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [IfiledbService],
		}).compile();

		service = module.get<IfiledbService>(IfiledbService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
