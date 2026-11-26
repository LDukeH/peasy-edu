import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSignedUrlDto {
  @ApiProperty({
    description: 'Đường dẫn tệp trên Storage lấy từ hồ sơ gia sư',
    example:
      'ung-tuyen/550e8400-e29b-41d4-a716-446655440000/cccd-mat-truoc.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  path: string;
}

export class SignedUrlResponseDto {
  @ApiProperty({
    description: 'Signed URL tạm thời để xem hoặc tải tệp từ bucket private',
    example:
      'https://project-ref.supabase.co/storage/v1/object/sign/peasy-private/ung-tuyen/...',
  })
  url: string;

  @ApiProperty({
    description: 'Thời hạn hiệu lực của URL (giây)',
    type: 'integer',
    example: 300,
  })
  expiresIn: number;
}
