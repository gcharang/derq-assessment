import { describe, expect, it } from 'vitest';
import type { Repository } from 'typeorm';

import { TrafficObservation } from './traffic-observation.entity.js';
import {
  CountryTrafficResponseSchema,
  VehicleTrafficResponseSchema,
} from './traffic.schemas.js';
import { TrafficService } from './traffic.service.js';

const CHAINED = [
  'innerJoin',
  'select',
  'addSelect',
  'where',
  'andWhere',
  'groupBy',
  'addGroupBy',
  'orderBy',
];

function serviceReturning(rows: unknown[]): TrafficService {
  const builder: Record<string, unknown> = { getRawMany: async () => rows };
  for (const method of CHAINED) {
    builder[method] = () => builder;
  }

  return new TrafficService({
    createQueryBuilder: () => builder,
  } as unknown as Repository<TrafficObservation>);
}

describe('TrafficService', () => {
  it('wraps country rows in a payload matching the published schema', async () => {
    const service = serviceReturning([
      { countryCode: 'ES', countryName: 'Spain', value: 260299 },
    ]);

    const response = await service.getCountryTraffic();

    expect(() => CountryTrafficResponseSchema.parse(response)).not.toThrow();
    expect(response.data).toHaveLength(1);
  });

  it('wraps vehicle rows in a payload matching the published schema', async () => {
    const service = serviceReturning([
      { vehicleCode: 'CAR', vehicleName: 'Passenger cars', value: 423972.09 },
    ]);

    const response = await service.getVehicleTraffic();

    expect(() => VehicleTrafficResponseSchema.parse(response)).not.toThrow();
    expect(response.data).toHaveLength(1);
  });

  it('reports the year and unit the values are measured in', async () => {
    const { meta } = await serviceReturning([]).getCountryTraffic();

    expect(meta).toEqual({
      year: 2023,
      unitCode: 'MIO_VKM',
      unitLabel: 'Million vehicle-kilometres (VKM)',
    });
  });
});
