import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { SubjectsModule } from './modules/subjects/subjects.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, SubjectsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
