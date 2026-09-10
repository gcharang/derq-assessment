import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  CountryTrafficResponseSchema,
  VehicleTrafficResponseSchema,
} from './traffic.schemas.js';
import type {
  CountryTrafficResponse,
  VehicleTrafficResponse,
} from './traffic.schemas.js';
import { TrafficService } from './traffic.service.js';

@ApiTags('traffic')
@Controller('traffic')
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Get('countries')
  @ApiOperation({ summary: 'Total road traffic per country' })
  @ApiOkResponse({
    description: 'Total traffic distance per country',
    standardSchema: CountryTrafficResponseSchema,
  })
  getCountryTraffic(): Promise<CountryTrafficResponse> {
    return this.trafficService.getCountryTraffic();
  }

  @Get('vehicles')
  @ApiOperation({ summary: 'Traffic distribution by vehicle type' })
  @ApiOkResponse({
    description: 'Traffic distance per vehicle type, summed across countries',
    standardSchema: VehicleTrafficResponseSchema,
  })
  getVehicleTraffic(): Promise<VehicleTrafficResponse> {
    return this.trafficService.getVehicleTraffic();
  }
}
