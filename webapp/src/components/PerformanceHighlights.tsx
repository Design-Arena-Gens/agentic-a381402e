import { formatCurrency, formatNumber } from "@/lib/metrics";
import type { Product, SaleRecord } from "@/lib/types";

type Props = {
  products: Product[];
  sales: SaleRecord[];
};

export function PerformanceHighlights({ products, sales }: Props) {
  if (products.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/40 backdrop-blur">
        <h2 className="text-lg font-semibold text-white">Performance Highlights</h2>
        <p className="mt-2 text-sm text-slate-400">
          Add inventory to see top performers, best margins, and fast movers.
        </p>
      </section>
    );
  }

  const aggregated = new Map<
    string,
    { revenue: number; profit: number; units: number; product: Product }
  >();

  sales.forEach((sale) => {
    const product = products.find((item) => item.id === sale.productId);
    if (!product) return;
    const entry = aggregated.get(sale.productId) ?? {
      revenue: 0,
      profit: 0,
      units: 0,
      product,
    };
    entry.revenue += sale.revenue;
    entry.profit += sale.profit;
    entry.units += sale.quantity;
    entry.product = product;
    aggregated.set(sale.productId, entry);
  });

  const topRevenue = Array.from(aggregated.values()).sort((a, b) => b.revenue - a.revenue)[0];
  const topProfit = Array.from(aggregated.values()).sort((a, b) => b.profit - a.profit)[0];
  const topVelocity = Array.from(aggregated.values()).sort((a, b) => b.units - a.units)[0];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <HighlightCard
        title="Revenue Leader"
        description={
          topRevenue
            ? `${formatNumber(topRevenue.units)} units sold`
            : "Log sales to discover your top earners."
        }
        amount={topRevenue ? formatCurrency(topRevenue.revenue) : undefined}
        product={topRevenue?.product.name}
        accent="from-emerald-500 via-sky-500 to-blue-500"
      />
      <HighlightCard
        title="Profit Leader"
        description={
          topProfit
            ? `${formatCurrency(topProfit.profit)} total profit`
            : "Sales profit will appear here once recorded."
        }
        amount={topProfit ? formatCurrency(topProfit.profit) : undefined}
        product={topProfit?.product.name}
        accent="from-amber-500 via-orange-400 to-red-500"
      />
      <HighlightCard
        title="Fastest Moving"
        description={
          topVelocity
            ? `${formatNumber(topVelocity.units)} units sold`
            : "Log sales to see who is flying off the shelves."
        }
        amount={topVelocity ? `${formatNumber(topVelocity.units)} sold` : undefined}
        product={topVelocity?.product.name}
        accent="from-indigo-500 via-purple-500 to-pink-500"
      />
    </section>
  );
}

type HighlightCardProps = {
  title: string;
  description: string;
  amount?: string;
  product?: string;
  accent: string;
};

const HighlightCard = ({ title, description, amount, product, accent }: HighlightCardProps) => (
  <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-950/50 p-6 text-white shadow-lg shadow-slate-900/40">
    <div
      className={`pointer-events-none absolute inset-x-0 top-[-50%] h-32 bg-gradient-to-r ${accent} opacity-60 blur-2xl`}
    />
    <div className="relative">
      <p className="text-xs uppercase tracking-widest text-slate-300">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{product ?? "Awaiting data"}</p>
      <p className="mt-2 text-sm text-slate-200/80">{description}</p>
      {amount && <p className="mt-4 text-lg font-bold text-white">{amount}</p>}
    </div>
  </div>
);
