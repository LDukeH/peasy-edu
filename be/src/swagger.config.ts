import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export function createSwaggerDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Peasy Edu API')
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .build();

  return SwaggerModule.createDocument(app, config, {
    // Nếu methodKey là findAll trong TutorsController -> operationId: tutors_findAll -> useTutorsFindAll
    // Nếu bạn đặt tên hàm đã rõ nghĩa (vd: getTutors) thì chỉ cần giữ methodKey
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      const prefix = controllerKey.replace(/Controller$/, '');
      const camelPrefix = prefix.charAt(0).toLowerCase() + prefix.slice(1);
      return methodKey.startsWith(camelPrefix)
        ? methodKey
        : `${camelPrefix}_${methodKey}`;
    },
  });
}
