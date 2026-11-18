import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard.js';
import { OwnershipGuard } from '../../common/auth/ownership.guard.js';
import { OwnershipService } from '../../common/auth/ownership.service.js';
import { RolesGuard } from '../../common/auth/roles.guard.js';
import { UsersModule } from '../users/users.module.js';
import {
  LOGIN_LIMIT_PER_MINUTE,
  THROTTLE_TTL_MS,
} from './auth.constants.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { TokenService } from './token.service.js';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: THROTTLE_TTL_MS, limit: LOGIN_LIMIT_PER_MINUTE }],
      errorMessage: 'Bạn thao tác quá nhiều lần, vui lòng thử lại sau ít phút',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    OwnershipService,
    // Thứ tự khai báo là thứ tự chạy: xác thực → vai trò → "Của mình".
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: OwnershipGuard },
  ],
})
export class AuthModule {}
