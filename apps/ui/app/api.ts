import type { components } from './api.types';

const API_URL = process.env.API_URL ?? 'http://localhost:3000';

export type CountryTrafficResponse =
  components['schemas']['CountryTrafficResponse'];
export type VehicleTrafficResponse =
  components['schemas']['VehicleTrafficResponse'];
export type Observation = components['schemas']['Observation'];
export type TrafficMeta = CountryTrafficResponse['meta'];

export interface ObservationKey {
  countryCode: string;
  vehicleCode: string;
  year: number;
}

async function call(path: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(`${API_URL}${path}`, init);
  } catch {
    throw new Response(null, {
      status: 502,
      statusText: `Could not reach the traffic API at ${API_URL}`,
    });
  }
}

async function get<T>(path: string): Promise<T> {
  const response = await call(path);

  if (!response.ok) {
    throw new Response(null, {
      status: 502,
      statusText: `${path} returned ${response.status}`,
    });
  }

  return (await response.json()) as T;
}

export const getCountryTraffic = () =>
  get<CountryTrafficResponse>('/traffic/countries');

export const getVehicleTraffic = () =>
  get<VehicleTrafficResponse>('/traffic/vehicles');

export async function updateObservation(
  { countryCode, vehicleCode, year }: ObservationKey,
  value: number,
): Promise<Observation> {
  const response = await call(
    `/traffic/observations/${countryCode}/${vehicleCode}/${year}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    },
  );

  const body: unknown = await response.json();

  if (!response.ok) {
    const message = (body as { message?: string | string[] }).message;
    throw new Error(
      Array.isArray(message)
        ? message.join(', ')
        : (message ?? `Update failed with ${response.status}`),
    );
  }

  return body as Observation;
}
