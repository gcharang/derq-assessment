import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module.js';
import { createOpenApiDocument } from './openapi.js';

const app = await NestFactory.create(AppModule, { logger: false });

const outputPath = resolve(process.cwd(), 'openapi.json');
await writeFile(
  outputPath,
  `${JSON.stringify(createOpenApiDocument(app), null, 2)}\n`,
  'utf8',
);
await app.close();

console.log(`OpenAPI document written to ${outputPath}`);
