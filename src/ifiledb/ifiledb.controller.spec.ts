import { Test, TestingModule } from '@nestjs/testing';
import { IfiledbController } from './ifiledb.controller';
import { IfiledbService } from './ifiledb.service';

describe('IfiledbController', () => {
	let controller: IfiledbController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [IfiledbController],
			providers: [IfiledbService],
		}).compile();

		controller = module.get<IfiledbController>(IfiledbController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
