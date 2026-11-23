import { Module } from '@nestjs/common';
import { TutorsController } from './tutors.controller.js';

@Module({
  controllers: [TutorsController],
})
export class TutorsModule {}
