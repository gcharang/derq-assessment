import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Country } from './country.entity.js';
import { TrafficController } from './traffic.controller.js';
import { TrafficObservation } from './traffic-observation.entity.js';
import { Vehicle } from './vehicle.entity.js';
import { TrafficService } from './traffic.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Country, Vehicle, TrafficObservation])],
  controllers: [TrafficController],
  providers: [TrafficService],
})
export class TrafficModule {}
