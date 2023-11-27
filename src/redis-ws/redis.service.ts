import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
	private readonly client: Redis;

	constructor(private configService: ConfigService) {
		this.client = new Redis({
			host: this.configService.get<string>('REDIS_HOST'),
			port: this.configService.get<number>('REDIS_PORT'),
		});

		this.client.on('message', (channel, message) => {
			console.log(`Received message from channel ${channel}: ${message}`);
		});
	}

	async get(key: string): Promise<string | null> {
		return await this.client.get(key);
	}

	async set(key: string, value: string): Promise<void> {
		await this.client.set(key, value);
	}

	async subscribe(channel: string): Promise<void> {
		await this.client.subscribe(channel);
	}

	async publish(channel: string, message: string): Promise<void> {
		await this.client.publish(channel, message);
	}
}
