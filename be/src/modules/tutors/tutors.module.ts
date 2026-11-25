import { Module } from '@nestjs/common';
import { MaHoaDuLieuService } from '../../common/bao-mat/ma-hoa-du-lieu.service.js';
import { TutorsController } from './tutors.controller.js';
import { TutorsService } from './tutors.service.js';

@Module({
  controllers: [TutorsController],
  providers: [TutorsService, MaHoaDuLieuService],
  exports: [TutorsService],
})
export class TutorsModule {}
