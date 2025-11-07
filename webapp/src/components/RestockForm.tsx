import type { Product } from "@/lib/types";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Props = {
  products: Product[];
  onRestock: (productId: string, quantity: number) => void;
};

export function RestockForm({ products, onRestock }: Props) {
  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products],
  );

  const [selected, setSelected] = useState(sortedProducts[0]?.id ?? "");
  const [quantity, setQuantity] = useState("10");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (sortedProducts.length === 0) {
      setSelected("");
      return;
    }

    const stillExists = sortedProducts.some((product) => product.id === selected);
    if (!stillExists) {
      setSelected(sortedProducts[0].id);
    }
  }, [sortedProducts, selected]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(null);

    const qty = Number(quantity);

    if (!selected) {
      setError("Choose a product to increase its stock.");
      return;
    }

    if (Number.isNaN(qty) || qty <= 0) {
      setError("Restock quantity must be at least 1.");
      return;
    }

    onRestock(selected, qty);
    setError(null);
    const product = products.find((item) => item.id === selected);
    setSuccess(`${qty} unit${qty > 1 ? "s" : ""} added to ${product?.name ?? "product"}.`);
    setQuantity("10");
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/40 backdrop-blur">
      <h2 className="text-lg font-semibold text-white">Restock Inventory</h2>
      <p className="text-sm text-slate-300">Increase stock counts after purchase orders arrive.</p>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-[2fr_1fr]">
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          <span className="font-medium text-white">Product</span>
          <select
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          >
            {sortedProducts.length === 0 && <option value="">Add products first</option>}
            {sortedProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} — {product.stock} in stock
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-300">
          <span className="font-medium text-white">Quantity</span>
          <input
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          />
        </label>

        <div className="md:col-span-2">
          {error && <p className="text-sm text-rose-400">{error}</p>}
          {success && <p className="text-sm text-emerald-400">{success}</p>}
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={products.length === 0}
          >
            Restock
          </button>
        </div>
      </form>
    </section>
  );
}
