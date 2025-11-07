import { formatCurrency, formatNumber, getMarginPercent } from "@/lib/metrics";
import type { Product, SaleRecord } from "@/lib/types";
import { useMemo, useState } from "react";

type SortKey =
  | "name"
  | "category"
  | "margin"
  | "stock"
  | "revenue"
  | "profit"
  | "unitsSold";

type Props = {
  products: Product[];
  sales: SaleRecord[];
};

const stockStatusColor = (product: Product) => {
  if (product.stock === 0) return "text-rose-500";
  if (product.stock <= product.reorderPoint) return "text-amber-500";
  return "text-emerald-500";
};

export function ProductTable({ products, sales }: Props) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const categories = useMemo(() => {
    const unique = new Set(products.map((product) => product.category));
    return ["all", ...Array.from(unique).filter(Boolean)];
  }, [products]);

  const lookup = useMemo(() => {
    const revenueByProduct = new Map<string, number>();
    const profitByProduct = new Map<string, number>();

    sales.forEach((sale) => {
      revenueByProduct.set(sale.productId, (revenueByProduct.get(sale.productId) ?? 0) + sale.revenue);
      profitByProduct.set(sale.productId, (profitByProduct.get(sale.productId) ?? 0) + sale.profit);
    });

    return { revenueByProduct, profitByProduct };
  }, [sales]);

  const filteredProducts = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();

    const applyFilters = products.filter((product) => {
      const matchesSearch =
        lowerSearch.length === 0 ||
        product.name.toLowerCase().includes(lowerSearch) ||
        product.sku.toLowerCase().includes(lowerSearch) ||
        product.category.toLowerCase().includes(lowerSearch);

      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;

      const matchesStock =
        stockFilter === "all"
          ? true
          : stockFilter === "low"
            ? product.stock <= product.reorderPoint
            : stockFilter === "out"
              ? product.stock === 0
              : product.stock > product.reorderPoint;

      return matchesSearch && matchesCategory && matchesStock;
    });

    const sorted = [...applyFilters].sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;

      switch (sortKey) {
        case "name":
          return direction * a.name.localeCompare(b.name);
        case "category":
          return direction * a.category.localeCompare(b.category);
        case "margin":
          return direction * (getMarginPercent(a) - getMarginPercent(b));
        case "stock":
          return direction * (a.stock - b.stock);
        case "unitsSold":
          return direction * (a.unitsSold - b.unitsSold);
        case "revenue":
          return (
            direction *
            ((lookup.revenueByProduct.get(a.id) ?? 0) - (lookup.revenueByProduct.get(b.id) ?? 0))
          );
        case "profit":
          return (
            direction *
            ((lookup.profitByProduct.get(a.id) ?? 0) - (lookup.profitByProduct.get(b.id) ?? 0))
          );
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, search, categoryFilter, stockFilter, sortKey, sortDirection, lookup]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/40 backdrop-blur">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Product Catalogue</h2>
          <p className="text-sm text-slate-300">
            Track profitability, inventory health, and sales performance in one view.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products, SKUs, categories…"
            className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30 sm:w-56"
          />

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All categories" : category}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          >
            <option value="all">All stock</option>
            <option value="healthy">Healthy stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </select>
        </div>
      </header>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full table-fixed divide-y divide-slate-800/80 text-left text-sm text-slate-200">
          <thead className="text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="w-52 px-4 py-3">Product</th>
              <th className="w-28 px-4 py-3">SKU</th>
              <th className="w-32 px-4 py-3">
                <button
                  type="button"
                  onClick={() => toggleSort("category")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Category
                  <SortIcon active={sortKey === "category"} direction={sortDirection} />
                </button>
              </th>
              <th className="w-28 px-4 py-3">
                <button
                  type="button"
                  onClick={() => toggleSort("margin")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Margin
                  <SortIcon active={sortKey === "margin"} direction={sortDirection} />
                </button>
              </th>
              <th className="w-28 px-4 py-3">
                <button
                  type="button"
                  onClick={() => toggleSort("stock")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Stock
                  <SortIcon active={sortKey === "stock"} direction={sortDirection} />
                </button>
              </th>
              <th className="w-32 px-4 py-3">
                <button
                  type="button"
                  onClick={() => toggleSort("unitsSold")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Units Sold
                  <SortIcon active={sortKey === "unitsSold"} direction={sortDirection} />
                </button>
              </th>
              <th className="w-32 px-4 py-3">
                <button
                  type="button"
                  onClick={() => toggleSort("revenue")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Revenue
                  <SortIcon active={sortKey === "revenue"} direction={sortDirection} />
                </button>
              </th>
              <th className="w-32 px-4 py-3">
                <button
                  type="button"
                  onClick={() => toggleSort("profit")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Profit
                  <SortIcon active={sortKey === "profit"} direction={sortDirection} />
                </button>
              </th>
              <th className="w-40 px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredProducts.map((product) => {
              const margin = getMarginPercent(product);
              const revenue = lookup.revenueByProduct.get(product.id) ?? 0;
              const profit = lookup.profitByProduct.get(product.id) ?? 0;
              const isLow = product.stock <= product.reorderPoint;

              return (
                <tr
                  key={product.id}
                  className={`transition-colors hover:bg-slate-800/50 ${
                    isLow ? "bg-amber-950/20" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{product.name}</span>
                      <span className="text-xs text-slate-400">
                        Updated {new Date(product.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-300">{product.sku}</td>
                  <td className="px-4 py-3 text-slate-300">{product.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        margin >= 40
                          ? "bg-emerald-500/10 text-emerald-400"
                          : margin >= 20
                            ? "bg-sky-500/10 text-sky-400"
                            : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {formatNumber(margin)}%
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-semibold ${stockStatusColor(product)}`}>
                    {formatNumber(product.stock)}
                  </td>
                  <td className="px-4 py-3 text-slate-200">{formatNumber(product.unitsSold)}</td>
                  <td className="px-4 py-3 text-slate-200">{formatCurrency(revenue)}</td>
                  <td className="px-4 py-3 text-slate-200">{formatCurrency(profit)}</td>
                  <td className="px-4 py-3">
                    <StockBadge product={product} />
                  </td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td className="px-4 py-12 text-center text-sm text-slate-400" colSpan={9}>
                  No products match the current filters. Try a different search term or reset the
                  filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

type SortIconProps = { active: boolean; direction: "asc" | "desc" };

const SortIcon = ({ active, direction }: SortIconProps) => (
  <span className={`transition ${active ? "text-white" : "text-slate-500"}`}>
    {active ? (direction === "asc" ? "↑" : "↓") : "↕"}
  </span>
);

const StockBadge = ({ product }: { product: Product }) => {
  if (product.stock === 0) {
    return (
      <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400">
        Out of Stock
      </span>
    );
  }

  if (product.stock <= product.reorderPoint) {
    return (
      <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
        Reorder Soon
      </span>
    );
  }

  return (
    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
      Stock Healthy
    </span>
  );
};
