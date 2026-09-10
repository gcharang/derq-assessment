import type { DataSourceOptions } from 'typeorm';

import { Country } from './traffic/country.entity.js';
import { TrafficObservation } from './traffic/traffic-observation.entity.js';
import { Vehicle } from './traffic/vehicle.entity.js';

export const databaseOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'traffic',
  password: process.env.DATABASE_PASSWORD ?? 'traffic',
  database: process.env.DATABASE_NAME ?? 'traffic',
  entities: [Country, Vehicle, TrafficObservation],
  synchronize: true,
};
