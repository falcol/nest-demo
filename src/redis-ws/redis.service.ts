import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import Redis from 'ioredis';
config({ path: '.env' });

@Injectable()
export class RedisService {
	private readonly client: Redis;
	private readonly configService: ConfigService;

	constructor() {
		this.client = new Redis({
			host: process.env.REDIS_HOST,
			port: parseInt(process.env.REDIS_PORT),
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
