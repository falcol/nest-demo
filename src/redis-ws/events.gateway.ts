/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable, OnModuleInit } from '@nestjs/common';
import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import Redis from 'ioredis';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: true,
	transports: ['websocket'],
})
@Injectable()
export class EventsGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private redisClient: Redis;
	private socketState: Map<string, Socket> = new Map();

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log(socket.id);
			console.log('Connected');

			this.server.emit('newMessage', 'initdata');
		});
	}

	afterInit() {
		this.redisClient = new Redis();
	}

	async sendData(message: string) {
		this.server.emit('newMessage', message);
	}

	handleConnection(client: Socket, ...args: any[]): any {
		if (client) {
			this.socketState.set(client.id, client);
			console.log(`client ${client?.id} is connecting on websocket`);
		}
	}

	handleDisconnect(client: Socket) {
		if (client) {
			console.log(`client ${client?.id} is disconnecting on websocket`);
			this.socketState.delete(client.id);
		}
	}

	@SubscribeMessage('newMessage')
	onNewMessage(@MessageBody() body: any) {
		console.log(body);
		this.server.emit('newMessage_1', {
			msg: 'New Message',
			content: body,
		});
	}

	@SubscribeMessage('subscribe')
	handleSubscribe(client: Socket, channel: string): void {
		// When a client sends a 'subscribe' message, subscribe them to the specified channel
		this.redisClient.subscribe(channel);
		this.redisClient.on('message', (channel, message) => {
			if (channel) {
				// Send data to only this websocket
				client.emit(`messageToClient_${channel}`, message);
			}
		});
	}
}
