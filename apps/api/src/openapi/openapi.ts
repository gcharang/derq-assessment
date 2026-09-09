import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { OpenAPIObject } from '@nestjs/swagger';
import type { INestApplication } from '@nestjs/common';

export function createOpenApiDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Derq Traffic API')
    .setDescription(
      'Road traffic volumes from a fixed snapshot of Eurostat road_tf_vehmov.',
    )
    .setVersion('1.0.0')
    .addTag('traffic')
    .build();

  return SwaggerModule.createDocument(app, config);
}
