import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RedisPublishDto {
	@ApiProperty({
		description: 'channel of redis',
		example: 'test',
	})
	@IsNotEmpty()
	readonly channel: string;

	@ApiProperty({
		description: 'data of message',
		example: 'test',
	})
	@IsNotEmpty()
	readonly data: string;
}
