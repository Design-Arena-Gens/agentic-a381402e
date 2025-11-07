import { calculateAverageMargin, formatCurrency, formatNumber } from "@/lib/metrics";
import type { Product, SaleRecord } from "@/lib/types";

type Props = {
  products: Product[];
  sales: SaleRecord[];
  lowStockCount: number;
  inventoryValue: number;
  totalRevenue: number;
  totalProfit: number;
};

const metrics = [
  "Inventory Value",
  "Total Revenue",
  "Total Profit",
  "Products",
  "Low Stock",
  "Avg. Margin",
];

const cardColors: Record<(typeof metrics)[number], string> = {
  "Inventory Value": "from-blue-500 to-sky-500",
  "Total Revenue": "from-emerald-500 to-teal-500",
  "Total Profit": "from-amber-500 to-orange-500",
  Products: "from-indigo-500 to-purple-500",
  "Low Stock": "from-rose-500 to-pink-500",
  "Avg. Margin": "from-cyan-500 to-blue-400",
};

export function SummaryCards({
  products,
  sales,
  lowStockCount,
  inventoryValue,
  totalProfit,
  totalRevenue,
}: Props) {
  const values: Record<(typeof metrics)[number], string> = {
    "Inventory Value": formatCurrency(inventoryValue),
    "Total Revenue": formatCurrency(totalRevenue),
    "Total Profit": formatCurrency(totalProfit),
    Products: formatNumber(products.length),
    "Low Stock": formatNumber(lowStockCount),
    "Avg. Margin": `${formatNumber(calculateAverageMargin(products))}%`,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => (
        <div
          key={metric}
          className={`relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-white shadow-lg shadow-slate-900/40 backdrop-blur-sm`}
        >
          <div
            className={`pointer-events-none absolute inset-x-0 top-[-40%] h-40 blur-3xl ${cardColors[metric]} opacity-70`}
            aria-hidden
          />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              {metric}
            </p>
            <p className="mt-2 text-3xl font-bold">{values[metric]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
