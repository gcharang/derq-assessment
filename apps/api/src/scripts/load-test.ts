const [
  url = 'http://localhost:3000/traffic/countries',
  workers = '50',
  seconds = '10',
] = process.argv.slice(2);

const latencies: number[] = [];
let errors = 0;

async function drive(until: number): Promise<void> {
  while (performance.now() < until) {
    const start = performance.now();
    try {
      const response = await fetch(url);
      await response.arrayBuffer();
      if (!response.ok) {
        errors += 1;
      }
    } catch {
      errors += 1;
    }
    latencies.push(performance.now() - start);
  }
}

function percentile(sorted: number[], fraction: number): number {
  return sorted[
    Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))
  ];
}

await drive(performance.now() + 2000);
latencies.length = 0;
errors = 0;

const started = performance.now();
await Promise.all(
  Array.from({ length: Number(workers) }, () =>
    drive(started + Number(seconds) * 1000),
  ),
);
const elapsed = (performance.now() - started) / 1000;

const sorted = latencies.toSorted((left, right) => left - right);
console.log(
  JSON.stringify(
    {
      url,
      workers: Number(workers),
      seconds: Number(elapsed.toFixed(1)),
      requests: latencies.length,
      rps: Math.round(latencies.length / elapsed),
      errors,
      p50: Number(percentile(sorted, 0.5).toFixed(2)),
      p95: Number(percentile(sorted, 0.95).toFixed(2)),
      p99: Number(percentile(sorted, 0.99).toFixed(2)),
    },
    null,
    2,
  ),
);
