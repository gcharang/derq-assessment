import type { Route } from './+types/home';

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Traffic Data' },
    {
      name: 'description',
      content: 'Road traffic volumes from Eurostat road_tf_vehmov.',
    },
  ];
}

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Traffic Data</h1>
    </main>
  );
}
