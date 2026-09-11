import type { Route } from './+types/home';
import { getCountryTraffic, getVehicleTraffic } from '../api';
import { TrafficBarChart, TrafficPieChart } from '../charts';

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
    </main>
  );
}
