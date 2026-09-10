import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TOTAL_VEHICLE_CODE, UNIT } from './traffic.data.js';
import { TrafficObservation } from './traffic-observation.entity.js';
import type {
  CountryTrafficResponse,
  VehicleTrafficResponse,
} from './traffic.schemas.js';

const SNAPSHOT_YEAR = 2023;

@Injectable()
export class TrafficService {
  constructor(
    @InjectRepository(TrafficObservation)
    private readonly observations: Repository<TrafficObservation>,
  ) {}

  async getCountryTraffic(): Promise<CountryTrafficResponse> {
    const data = await this.observations
      .createQueryBuilder('observation')
      .innerJoin('observation.country', 'country')
      .select('observation.countryCode', 'countryCode')
      .addSelect('country.name', 'countryName')
      .addSelect('observation.value', 'value')
      .where('observation.year = :year', { year: SNAPSHOT_YEAR })
      .andWhere('observation.vehicleCode = :vehicle', {
        vehicle: TOTAL_VEHICLE_CODE,
      })
      .orderBy('observation.value', 'DESC')
      .getRawMany<CountryTrafficResponse['data'][number]>();

    return { data, meta: this.meta() };
  }

  async getVehicleTraffic(): Promise<VehicleTrafficResponse> {
    const data = await this.observations
      .createQueryBuilder('observation')
      .innerJoin('observation.vehicle', 'vehicle')
      .select('observation.vehicleCode', 'vehicleCode')
      .addSelect('vehicle.name', 'vehicleName')
      .addSelect(
        'ROUND(SUM(observation.value)::numeric, 2)::double precision',
        'value',
      )
      .where('observation.year = :year', { year: SNAPSHOT_YEAR })
      .andWhere('observation.vehicleCode <> :total', {
        total: TOTAL_VEHICLE_CODE,
      })
      .groupBy('observation.vehicleCode')
      .addGroupBy('vehicle.name')
      .orderBy('SUM(observation.value)', 'DESC')
      .getRawMany<VehicleTrafficResponse['data'][number]>();

    return { data, meta: this.meta() };
  }

  private meta() {
    return {
      year: SNAPSHOT_YEAR,
      unitCode: UNIT.code,
      unitLabel: UNIT.label,
    };
  }
}
