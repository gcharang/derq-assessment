import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseOptions } from './database.js';
import { TrafficModule } from './traffic/traffic.module.js';

@Module({
  imports: [TypeOrmModule.forRoot(databaseOptions), TrafficModule],
})
export class AppModule {}
