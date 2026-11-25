import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { JsonOnlyMiddleware } from './common/middleware/json-only.middleware.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { SubjectsModule } from './modules/subjects/subjects.module.js';
import { TutorsModule } from './modules/tutors/tutors.module.js';
import { ParentsModule } from './modules/parents/parents.module.js';
import { StudentsModule } from './modules/students/students.module.js';
import { RequestsModule } from './modules/requests/requests.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    SubjectsModule,
    TutorsModule,
    ParentsModule,
    StudentsModule,
    RequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(JsonOnlyMiddleware).forRoutes('{*duongDan}');
  }
}
