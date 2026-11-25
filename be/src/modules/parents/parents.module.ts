import { Module } from '@nestjs/common';
import { ParentsController } from './parents.controller.js';
@Module({ controllers: [ParentsController] })
export class ParentsModule {}
