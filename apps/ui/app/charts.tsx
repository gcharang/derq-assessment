import {
  Bar,
  BarChart,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const PALETTE = ['#2563eb', '#0891b2', '#65a30d', '#ca8a04', '#dc2626'];

const compact = new Intl.NumberFormat('en-GB', { notation: 'compact' });
const full = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });

const TICK = { fill: 'var(--chart-axis)', fontSize: 12 };

const TOOLTIP_STYLE = {
  backgroundColor: 'var(--chart-tooltip-bg)',
  border: '1px solid var(--chart-tooltip-border)',
  borderRadius: 6,
  color: 'var(--chart-tooltip-text)',
  fontSize: 12,
};

export interface Slice {
  code: string;
  name: string;
  value: number;
}

function Frame({ children }: { children: React.ReactElement }) {
  return (
    <div className="relative h-64 w-full min-w-0 sm:h-72 lg:h-80">
      <div className="absolute inset-0">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TrafficBarChart({
  rows,
  unitLabel,
}: {
  rows: Slice[];
  unitLabel: string;
}) {
  const names = new Map(rows.map((row) => [row.code, row.name]));

  return (
    <Frame>
      <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <XAxis
          dataKey="code"
          interval={0}
          tick={TICK}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          width={44}
          tickFormatter={compact.format}
          tick={TICK}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value) => [full.format(Number(value)), unitLabel]}
          labelFormatter={(code) => names.get(String(code)) ?? String(code)}
          cursor={{ fill: 'var(--chart-cursor)' }}
          contentStyle={TOOLTIP_STYLE}
        />
        <Bar dataKey="value" fill={PALETTE[0]} radius={[4, 4, 0, 0]} />
      </BarChart>
    </Frame>
  );
}

export function TrafficPieChart({
  rows,
  unitLabel,
}: {
  rows: Slice[];
  unitLabel: string;
}) {
  const slices = rows.map((row, index) => ({
    ...row,
    fill: PALETTE[index % PALETTE.length],
  }));

  return (
    <Frame>
      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          data={slices}
          dataKey="value"
          nameKey="name"
          outerRadius="70%"
          stroke="var(--chart-stroke)"
          isAnimationActive={false}
        />
        <Tooltip
          formatter={(value) => [full.format(Number(value)), unitLabel]}
          contentStyle={TOOLTIP_STYLE}
        />
        <Legend wrapperStyle={{ fontSize: 12, lineHeight: 1.5 }} />
      </PieChart>
    </Frame>
  );
}
