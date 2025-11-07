import { formatCurrency, formatNumber } from "@/lib/metrics";
import type { Product, SaleRecord } from "@/lib/types";

type Props = {
  sales: SaleRecord[];
  products: Product[];
};

export function SalesHistory({ sales, products }: Props) {
  const productMap = new Map(products.map((product) => [product.id, product.name]));
  const recentSales = [...sales].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  if (recentSales.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-slate-300 shadow-xl shadow-slate-950/40 backdrop-blur">
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        <p className="mt-2 text-sm text-slate-400">
          Log sales to see performance trends and product velocity.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/40 backdrop-blur">
      <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
      <p className="text-sm text-slate-300">Latest sales logged across your catalogue.</p>

      <ul className="mt-4 space-y-3">
        {recentSales.map((sale) => (
          <li
            key={sale.id}
            className="flex items-center justify-between rounded-2xl bg-slate-800/60 px-4 py-3 text-sm text-slate-200"
          >
            <div>
              <p className="font-semibold text-white">
                {productMap.get(sale.productId) ?? "Archived Product"}
              </p>
              <p className="text-xs text-slate-400">
                {formatNumber(sale.quantity)} units • {formatCurrency(sale.revenue)} revenue •{" "}
                {formatCurrency(sale.profit)} profit
              </p>
            </div>
            <span className="text-xs uppercase tracking-wide text-slate-400">
              {new Date(sale.date).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
