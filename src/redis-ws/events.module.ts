/* eslint-disable @typescript-eslint/no-unused-vars */

import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsJwtGuard } from '../auth/guards/ws-jwt-guard .guard';
import { EventsGateway } from './events.gateway';

@Module({
	providers: [EventsGateway, JwtService, WsJwtGuard],
	exports: [EventsGateway],
})
export class EventsModule {}
