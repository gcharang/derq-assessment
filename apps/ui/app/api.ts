import type { components } from './api.types';

const API_URL = process.env.API_URL ?? 'http://localhost:3000';

export type CountryTrafficResponse =
  components['schemas']['CountryTrafficResponse'];
export type VehicleTrafficResponse =
  components['schemas']['VehicleTrafficResponse'];
export type TrafficMeta = CountryTrafficResponse['meta'];

async function get<T>(path: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`);
  } catch {
    throw new Response(null, {
      status: 502,
      statusText: `Could not reach the traffic API at ${API_URL}`,
    });
  }

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
