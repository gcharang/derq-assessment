import { Module } from '@nestjs/common';

import { TrafficModule } from './traffic/traffic.module.js';

@Module({
  imports: [TrafficModule],
})
export class AppModule {}
