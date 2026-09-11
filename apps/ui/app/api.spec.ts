import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getCountryTraffic, updateObservation } from './api';

const original = globalThis.fetch;

function mockFetch(response: Partial<Response> & { json?: () => unknown }) {
  const spy = vi.fn().mockResolvedValue({ ok: true, status: 200, ...response });
  globalThis.fetch = spy as unknown as typeof fetch;
  return spy;
}

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  globalThis.fetch = original;
});

describe('updateObservation', () => {
  it('PUTs the value to the observation path', async () => {
    const stored = {
      countryCode: 'ES',
      vehicleCode: 'CAR',
      year: 2023,
      value: 206577,
    };
    const spy = mockFetch({ json: async () => stored });

    await expect(
      updateObservation(
        { countryCode: 'ES', vehicleCode: 'CAR', year: 2023 },
        206577,
      ),
    ).resolves.toEqual(stored);

    const [url, init] = spy.mock.calls[0];
    expect(url).toContain('/traffic/observations/ES/CAR/2023');
    expect(init.method).toBe('PUT');
    expect(JSON.parse(init.body)).toEqual({ value: 206577 });
  });

  it("surfaces the API's validation messages", async () => {
    mockFetch({
      ok: false,
      status: 400,
      json: async () => ({ message: ['value: Too small', 'year: invalid'] }),
    });

    await expect(
      updateObservation(
        { countryCode: 'ES', vehicleCode: 'CAR', year: 2023 },
        -1,
      ),
    ).rejects.toThrow('value: Too small, year: invalid');
  });

  it('falls back to the status code when the body carries no message', async () => {
    mockFetch({ ok: false, status: 500, json: async () => ({}) });

    await expect(
      updateObservation(
        { countryCode: 'ES', vehicleCode: 'CAR', year: 2023 },
        1,
      ),
    ).rejects.toThrow('Update failed with 500');
  });

  it('reports an unreachable API as a 502 rather than a network error', async () => {
    globalThis.fetch = vi
      .fn()
      .mockRejectedValue(new Error('ECONNREFUSED')) as unknown as typeof fetch;

    await expect(
      updateObservation(
        { countryCode: 'ES', vehicleCode: 'CAR', year: 2023 },
        1,
      ),
    ).rejects.toMatchObject({ status: 502 });
  });
});

describe('getCountryTraffic', () => {
  it('returns the parsed payload', async () => {
    const payload = {
      data: [{ countryCode: 'ES', countryName: 'Spain', value: 260299 }],
      meta: { year: 2023, unitCode: 'MIO_VKM', unitLabel: 'Million' },
    };
    mockFetch({ json: async () => payload });

    await expect(getCountryTraffic()).resolves.toEqual(payload);
  });

  it('throws a 502 when the API answers with an error status', async () => {
    mockFetch({ ok: false, status: 503, json: async () => ({}) });

    await expect(getCountryTraffic()).rejects.toMatchObject({ status: 502 });
  });
});
