import type { Product } from "@/lib/types";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Props = {
  products: Product[];
  onRecordSale: (productId: string, quantity: number) => void;
};

export function RecordSaleForm({ products, onRecordSale }: Props) {
  const availableProducts = useMemo(
    () => products.filter((product) => product.stock > 0),
    [products],
  );

  const [productId, setProductId] = useState(availableProducts[0]?.id ?? "");
  const [quantity, setQuantity] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (availableProducts.length === 0) {
      setProductId("");
      return;
    }

    const stillExists = availableProducts.some((product) => product.id === productId);
    if (!stillExists) {
      setProductId(availableProducts[0].id);
    }
  }, [availableProducts, productId]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(null);

    const qty = Number(quantity);

    if (!productId) {
      setError("Select a product that still has stock.");
      return;
    }

    if (Number.isNaN(qty) || qty <= 0) {
      setError("Quantity sold must be at least 1.");
      return;
    }

    const product = products.find((item) => item.id === productId);
    if (!product) {
      setError("Selected product could not be found.");
      return;
    }

    if (qty > product.stock) {
      setError(`Only ${product.stock} units remaining in stock for ${product.name}.`);
      return;
    }

    onRecordSale(productId, qty);
    setError(null);
    setSuccess(`${qty} unit${qty > 1 ? "s" : ""} recorded for ${product.name}.`);
    setQuantity("1");
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/40 backdrop-blur">
      <h2 className="text-lg font-semibold text-white">Log a Sale</h2>
      <p className="text-sm text-slate-300">
        Keep revenue up-to-date and automatically reduce stock levels.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-[2fr_1fr]">
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          <span className="font-medium text-white">Product</span>
          <select
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          >
            {availableProducts.length === 0 && <option value="">No stock available</option>}
            {availableProducts.map((product) => (
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
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={availableProducts.length === 0}
          >
            Record Sale
          </button>
        </div>
      </form>
    </section>
  );
}
