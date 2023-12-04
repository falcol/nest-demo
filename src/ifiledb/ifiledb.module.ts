import { Module } from '@nestjs/common';
import { IfiledbController } from './ifiledb.controller';
import { IfiledbService } from './ifiledb.service';

@Module({
	imports: [],
	controllers: [IfiledbController],
	providers: [IfiledbService],
})
export class IfiledbModule {}
