import { describe, expect, it } from 'vitest';

import { TRAFFIC_OBSERVATIONS } from './traffic.data.js';

describe('the committed snapshot', () => {
  it('reads every axis at the right offset', () => {
    const valueAt = (countryCode: string, vehicleCode: string, year: number) =>
      TRAFFIC_OBSERVATIONS.find(
        (observation) =>
          observation.countryCode === countryCode &&
          observation.vehicleCode === vehicleCode &&
          observation.year === year,
      )?.value;

    expect(TRAFFIC_OBSERVATIONS).toHaveLength(300);
    expect(valueAt('ES', 'TOTAL', 2023)).toBe(260299);
    expect(valueAt('ES', 'CAR', 2023)).toBe(206577);
    expect(valueAt('CH', 'LOR_RTRN', 2023)).toBe(7321);
  });
});
