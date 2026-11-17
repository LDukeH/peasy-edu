import { ApiProperty } from '@nestjs/swagger';

/** Hình dạng lỗi mặc định của NestJS (HttpException / ValidationPipe). */
export class ErrorResponseDto {
  @ApiProperty({ type: 'integer', example: 400 })
  statusCode: number;

  @ApiProperty({
    description:
      'Thông báo lỗi; lỗi validate (400) trả về mảng, các lỗi khác trả về chuỗi',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: ['soDienThoai phải gồm 10 chữ số, bắt đầu bằng 0'],
  })
  message: string | string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
