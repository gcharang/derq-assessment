import { Module } from '@nestjs/common';

import { TrafficController } from './traffic.controller.js';

@Module({
  controllers: [TrafficController],
})
export class TrafficModule {}
