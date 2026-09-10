import type { DataSource } from 'typeorm';

import { Country } from './traffic/country.entity.js';
import { TrafficObservation } from './traffic/traffic-observation.entity.js';
import { Vehicle } from './traffic/vehicle.entity.js';
import {
  COUNTRY_NAMES,
  TRAFFIC_OBSERVATIONS,
  VEHICLE_NAMES,
} from './traffic/traffic.data.js';

export async function seed(dataSource: DataSource): Promise<void> {
  await dataSource.getRepository(Country).upsert(
    Object.entries(COUNTRY_NAMES).map(([code, name]) => ({ code, name })),
    ['code'],
  );

  await dataSource.getRepository(Vehicle).upsert(
    Object.entries(VEHICLE_NAMES).map(([code, name]) => ({ code, name })),
    ['code'],
  );

  await dataSource
    .getRepository(TrafficObservation)
    .upsert([...TRAFFIC_OBSERVATIONS], ['countryCode', 'vehicleCode', 'year']);
}
