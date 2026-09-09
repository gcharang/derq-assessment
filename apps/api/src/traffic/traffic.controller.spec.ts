import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { TrafficController } from './traffic.controller.js';
import { CountryTrafficResponseSchema } from './traffic.schemas.js';

describe('TrafficController', () => {
  let controller: TrafficController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TrafficController],
    }).compile();

    controller = moduleRef.get(TrafficController);
  });

  it('returns a payload satisfying the published schema', () => {
    expect(() =>
      CountryTrafficResponseSchema.parse(controller.getCountryTraffic()),
    ).not.toThrow();
  });

  it('returns at least one country', () => {
    expect(controller.getCountryTraffic().data.length).toBeGreaterThan(0);
  });

  it('rejects rows carrying unknown keys', () => {
    const [first] = controller.getCountryTraffic().data;
    const result = CountryTrafficResponseSchema.safeParse({
      data: [{ ...first, unexpected: true }],
    });

    expect(result.success).toBe(false);
  });
});
