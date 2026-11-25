import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller.js';
@Module({ controllers: [RequestsController] })
export class RequestsModule {}
