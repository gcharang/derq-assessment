import { DataSource } from 'typeorm';

import { databaseOptions } from '../database.js';
import { seed } from '../database-seed.js';
import {
  COUNTRY_NAMES,
  TRAFFIC_OBSERVATIONS,
} from '../traffic/traffic.data.js';

const dataSource = await new DataSource(databaseOptions).initialize();
await seed(dataSource);
await dataSource.destroy();

console.log(
  `Seeded ${Object.keys(COUNTRY_NAMES).length} countries and ${TRAFFIC_OBSERVATIONS.length} observations`,
);
