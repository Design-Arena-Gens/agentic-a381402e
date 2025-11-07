import { formatCurrency, formatNumber } from "@/lib/metrics";
import type { Product } from "@/lib/types";

type Props = {
  products: Product[];
};

export function StockAlerts({ products }: Props) {
  const lowStock = products
    .filter((product) => product.stock <= product.reorderPoint)
    .sort((a, b) => a.stock - b.stock);

  const outOfStock = lowStock.filter((product) => product.stock === 0);
  const needsAttention = lowStock.filter((product) => product.stock > 0);

  if (products.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-slate-300 shadow-xl shadow-slate-950/40 backdrop-blur">
        <h2 className="text-lg font-semibold text-white">Stock Alerts</h2>
        <p className="mt-2 text-sm text-slate-400">
          Add products to start receiving restock recommendations.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/40 backdrop-blur">
      <h2 className="text-lg font-semibold text-white">Stock Alerts</h2>
      <p className="text-sm text-slate-300">Respond quickly to products trending toward stockouts.</p>

      <div className="mt-4 space-y-4">
        {outOfStock.length === 0 && needsAttention.length === 0 && (
          <p className="text-sm text-emerald-400">
            All good! Your inventory is healthy across every product.
          </p>
        )}

        {outOfStock.length > 0 && (
          <AlertGroup title="Out of stock" tone="critical">
            {outOfStock.map((product) => (
              <AlertItem key={product.id} product={product} />
            ))}
          </AlertGroup>
        )}

        {needsAttention.length > 0 && (
          <AlertGroup title="Running low" tone="warning">
            {needsAttention.map((product) => (
              <AlertItem key={product.id} product={product} />
            ))}
          </AlertGroup>
        )}
      </div>
    </section>
  );
}

type AlertGroupProps = {
  title: string;
  tone: "critical" | "warning";
  children: React.ReactNode;
};

const AlertGroup = ({ title, tone, children }: AlertGroupProps) => (
  <div
    className={`rounded-2xl border px-4 py-3 ${
      tone === "critical"
        ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
        : "border-amber-500/30 bg-amber-500/10 text-amber-50"
    }`}
  >
    <h3 className="text-sm font-semibold uppercase tracking-wide">{title}</h3>
    <div className="mt-3 space-y-3">{children}</div>
  </div>
);

const AlertItem = ({ product }: { product: Product }) => {
  const margin = product.price - product.cost;
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <div>
        <p className="font-medium">
          {product.name}{" "}
          <span className="text-xs uppercase tracking-wide text-slate-200/70">
            ({product.sku})
          </span>
        </p>
        <p className="text-xs text-slate-200/70">
          Reorder when below {formatNumber(product.reorderPoint)} units • Margin per unit{" "}
          {formatCurrency(margin)}
        </p>
      </div>
      <span className="rounded-full bg-black/30 px-3 py-1 font-semibold">
        {formatNumber(product.stock)} left
      </span>
    </div>
  );
};
