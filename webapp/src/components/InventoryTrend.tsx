import { formatCurrency } from "@/lib/metrics";
import type { InventorySnapshot } from "@/lib/types";

type Props = {
  snapshots: InventorySnapshot[];
};

export function InventoryTrend({ snapshots }: Props) {
  if (snapshots.length < 2) {
    return (
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-slate-300 shadow-xl shadow-slate-950/40 backdrop-blur">
        <h2 className="text-lg font-semibold text-white">Inventory Trend</h2>
        <p className="mt-2 text-sm text-slate-400">
          Track inventory value over time as you add, sell, and restock products.
        </p>
      </section>
    );
  }

  const points = snapshots.slice(-12); // show last 12 snapshots
  const maxValue = Math.max(...points.map((point) => point.inventoryValue));
  const minValue = Math.min(...points.map((point) => point.inventoryValue));
  const diff = Math.max(maxValue - minValue, 1);

  const path = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - ((point.inventoryValue - minValue) / diff) * 100;
      return `${index === 0 ? "M" : "L"} ${x},${y}`;
    })
    .join(" ");

  const first = points[0];
  const last = points[points.length - 1];
  const delta = last.inventoryValue - first.inventoryValue;
  const deltaPercentage = (delta / first.inventoryValue) * 100;

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/40 backdrop-blur">
      <h2 className="text-lg font-semibold text-white">Inventory Trend</h2>
      <p className="text-sm text-slate-300">Rolling snapshots of your stock valuation.</p>

      <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Current Value</p>
            <p className="text-2xl font-semibold text-white">{formatCurrency(last.inventoryValue)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-slate-400">Change</p>
            <p
              className={`text-lg font-semibold ${
                delta >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {delta >= 0 ? "+" : ""}
              {formatCurrency(delta)} ({deltaPercentage >= 0 ? "+" : ""}
              {deltaPercentage.toFixed(1)}%)
            </p>
          </div>
        </div>

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-6 h-32 w-full">
          <defs>
            <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${path} L 100,100 L 0,100 Z`}
            fill="url(#trendGradient)"
            stroke="none"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={path}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="mt-4 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
          {points.map((point) => (
            <div key={point.date} className="flex justify-between">
              <span>{new Date(point.date).toLocaleString()}</span>
              <span className="font-medium text-slate-200">
                {formatCurrency(point.inventoryValue)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
