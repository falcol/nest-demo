import { PartialType } from '@nestjs/swagger';
import { CreateIfiledbDto } from './create-ifiledb.dto';

export class UpdateIfiledbDto extends PartialType(CreateIfiledbDto) {}
