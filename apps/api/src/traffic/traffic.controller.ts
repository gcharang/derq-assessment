import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { ZodValidationPipe } from '../zod-validation.pipe.js';
import { COUNTRY_CODES, VEHICLE_CODES } from './traffic.data.js';
import {
  CountryTrafficResponseSchema,
  ObservationKeySchema,
  ObservationSchema,
  UpdateObservationSchema,
  UpdateObservationBodySchema,
  VehicleTrafficResponseSchema,
} from './traffic.schemas.js';
import type {
  CountryTrafficResponse,
  Observation,
  ObservationKey,
  UpdateObservation,
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

  @Put('observations/:countryCode/:vehicleCode/:year')
  @ApiOperation({ summary: 'Create or replace a single observation' })
  @ApiParam({ name: 'countryCode', enum: COUNTRY_CODES })
  @ApiParam({ name: 'vehicleCode', enum: VEHICLE_CODES })
  @ApiParam({ name: 'year', schema: { type: 'integer' } })
  @ApiBody({ schema: UpdateObservationBodySchema })
  @ApiOkResponse({
    description: 'The stored observation',
    standardSchema: ObservationSchema,
  })
  updateObservation(
    @Param(new ZodValidationPipe(ObservationKeySchema)) key: ObservationKey,
    @Body(new ZodValidationPipe(UpdateObservationSchema))
    body: UpdateObservation,
  ): Promise<Observation> {
    return this.trafficService.updateObservation(key, body);
  }
}
