import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ifiledb } from './entities/ifiledb.entity';
import { IfiledbController } from './ifiledb.controller';
import { IfiledbService } from './ifiledb.service';

@Module({
	imports: [TypeOrmModule.forFeature([Ifiledb])],
	controllers: [IfiledbController],
	providers: [IfiledbService],
})
export class IfiledbModule {}
