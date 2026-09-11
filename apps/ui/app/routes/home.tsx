import { useFetcher } from 'react-router';
import type { Route } from './+types/home';
import {
  getCountryTraffic,
  getVehicleTraffic,
  updateObservation,
} from '../api';
import type { CountryTrafficResponse, VehicleTrafficResponse } from '../api';
import { TrafficBarChart, TrafficPieChart } from '../charts';

const TOTAL_VEHICLE = { code: 'TOTAL', name: 'Total' };

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Traffic Data' },
    {
      name: 'description',
      content: 'Road traffic volumes from Eurostat road_tf_vehmov.',
    },
  ];
}

export async function loader() {
  const [countries, vehicles] = await Promise.all([
    getCountryTraffic(),
    getVehicleTraffic(),
  ]);

  return { countries, vehicles };
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();

  try {
    const stored = await updateObservation(
      {
        countryCode: String(form.get('countryCode')),
        vehicleCode: String(form.get('vehicleCode')),
        year: Number(form.get('year')),
      },
      Number(form.get('value')),
    );

    return { stored, error: null };
  } catch (error) {
    return {
      stored: null,
      error: error instanceof Error ? error.message : 'Update failed',
    };
  }
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 flex-1 rounded-lg border border-gray-200 p-3 sm:p-4 dark:border-gray-800">
      <h2 className="text-base font-semibold sm:text-lg">{title}</h2>
      <p className="mb-3 text-xs text-gray-500 sm:mb-4 sm:text-sm dark:text-gray-400">
        {subtitle}
      </p>
      {children}
    </section>
  );
}

const FIELD =
  'w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100';

function EditForm({
  countries,
  vehicles,
}: {
  countries: CountryTrafficResponse;
  vehicles: VehicleTrafficResponse;
}) {
  const fetcher = useFetcher<typeof action>();
  const busy = fetcher.state !== 'idle';

  const vehicleOptions = [
    TOTAL_VEHICLE,
    ...vehicles.data.map((row) => ({
      code: row.vehicleCode,
      name: row.vehicleName,
    })),
  ];

  return (
    <fetcher.Form
      method="post"
      className="mt-6 rounded-lg border border-gray-200 p-3 sm:mt-8 sm:p-4 dark:border-gray-800"
    >
      <h2 className="text-base font-semibold sm:text-lg">Update a figure</h2>
      <p className="mb-3 text-xs text-gray-500 sm:mb-4 sm:text-sm dark:text-gray-400">
        Writes to the database through the API. The charts reload from it on
        save.
      </p>

      <input type="hidden" name="year" value={countries.meta.year} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="min-w-0 flex-1 text-xs sm:text-sm">
          Country
          <select name="countryCode" className={`mt-1 ${FIELD}`}>
            {countries.data.map((row) => (
              <option key={row.countryCode} value={row.countryCode}>
                {row.countryName}
              </option>
            ))}
          </select>
        </label>

        <label className="min-w-0 flex-1 text-xs sm:text-sm">
          Vehicle type
          <select name="vehicleCode" className={`mt-1 ${FIELD}`}>
            {vehicleOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.name}
              </option>
            ))}
          </select>
        </label>

        <label className="min-w-0 flex-1 text-xs sm:text-sm">
          {countries.meta.unitLabel}
          <input
            type="number"
            name="value"
            min="0"
            step="0.01"
            required
            placeholder="e.g. 260299"
            className={`mt-1 ${FIELD}`}
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {busy ? 'Saving…' : 'Save'}
        </button>
      </div>

      {fetcher.data?.error && (
        <p className="mt-3 text-xs text-red-600 sm:text-sm dark:text-red-400">
          {fetcher.data.error}
        </p>
      )}
      {fetcher.data?.stored && (
        <p className="mt-3 text-xs text-green-700 sm:text-sm dark:text-green-400">
          Saved {fetcher.data.stored.countryCode} /{' '}
          {fetcher.data.stored.vehicleCode} / {fetcher.data.stored.year} ={' '}
          {fetcher.data.stored.value}
        </p>
      )}
    </fetcher.Form>
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { countries, vehicles } = loaderData;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-xl font-semibold sm:text-2xl">Traffic Data</h1>
      <p className="mt-1 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
        Eurostat road_tf_vehmov, {countries.meta.year}, in{' '}
        {countries.meta.unitLabel}.
      </p>

      <div className="mt-6 flex flex-col gap-6 sm:mt-8 lg:flex-row lg:gap-8">
        <Panel
          title="Traffic by country"
          subtitle={`Total road traffic, ${countries.meta.year}`}
        >
          <TrafficBarChart
            unitLabel={countries.meta.unitLabel}
            rows={countries.data.map((row) => ({
              code: row.countryCode,
              name: row.countryName,
              value: row.value,
            }))}
          />
        </Panel>

        <Panel
          title="Traffic by vehicle type"
          subtitle={`Share across all countries, ${vehicles.meta.year}`}
        >
          <TrafficPieChart
            unitLabel={vehicles.meta.unitLabel}
            rows={vehicles.data.map((row) => ({
              code: row.vehicleCode,
              name: row.vehicleName,
              value: row.value,
            }))}
          />
        </Panel>
      </div>

      <EditForm countries={countries} vehicles={vehicles} />
    </main>
  );
}
