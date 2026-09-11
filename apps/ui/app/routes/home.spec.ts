import { describe, expect, it, vi } from 'vitest';

vi.mock('../api', () => ({
  getCountryTraffic: vi.fn(),
  getVehicleTraffic: vi.fn(),
  updateObservation: vi.fn(),
}));

import { updateObservation } from '../api';
import { action } from './home';

const submit = (fields: Record<string, string>) => {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.append(key, value);
  return action({
    request: new Request('http://test/', { method: 'POST', body }),
  } as Parameters<typeof action>[0]);
};

describe('action', () => {
  it('passes the form fields to the API with numeric year and value', async () => {
    const stored = {
      countryCode: 'ES',
      vehicleCode: 'CAR',
      year: 2023,
      value: 500,
    };
    vi.mocked(updateObservation).mockResolvedValue(stored);

    await expect(
      submit({
        countryCode: 'ES',
        vehicleCode: 'CAR',
        year: '2023',
        value: '500',
      }),
    ).resolves.toEqual({ stored, error: null });

    expect(updateObservation).toHaveBeenCalledWith(
      { countryCode: 'ES', vehicleCode: 'CAR', year: 2023 },
      500,
    );
  });

  it('returns the failure message instead of throwing', async () => {
    vi.mocked(updateObservation).mockRejectedValue(
      new Error('value: Too small'),
    );

    await expect(
      submit({
        countryCode: 'ES',
        vehicleCode: 'CAR',
        year: '2023',
        value: '-1',
      }),
    ).resolves.toEqual({ stored: null, error: 'value: Too small' });
  });
});
