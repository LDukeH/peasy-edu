import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthResponseDto } from './health.dto.js';

@ApiTags('System')
@Controller('health')
export class AppController {
  @Get()
  @ApiOperation({ operationId: 'getHealth' })
  @ApiOkResponse({ type: HealthResponseDto })
  getHealth(): HealthResponseDto {
    return { status: 'ok' };
  }
}
