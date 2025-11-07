import type { Product } from "@/lib/types";
import { FormEvent, useState } from "react";
import { v4 as uuid } from "uuid";

type Props = {
  onAdd: (product: Product) => void;
};

const initialState = {
  name: "",
  sku: "",
  category: "",
  cost: "",
  price: "",
  stock: "",
  reorderPoint: "10",
};

export function AddProductForm({ onAdd }: Props) {
  const [values, setValues] = useState(initialState);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cost = Number(values.cost);
    const price = Number(values.price);
    const stock = Number(values.stock);
    const reorderPoint = Number(values.reorderPoint);

    if (!values.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!values.sku.trim()) {
      setError("SKU is required to keep your catalogue organized.");
      return;
    }

    if (Number.isNaN(cost) || cost < 0) {
      setError("Cost must be a non-negative number.");
      return;
    }

    if (Number.isNaN(price) || price <= 0) {
      setError("Price must be greater than zero.");
      return;
    }

    if (Number.isNaN(stock) || stock < 0) {
      setError("Starting stock must be zero or higher.");
      return;
    }

    if (Number.isNaN(reorderPoint) || reorderPoint < 0) {
      setError("Reorder point must be zero or higher.");
      return;
    }

    const product: Product = {
      id: uuid(),
      name: values.name.trim(),
      sku: values.sku.trim().toUpperCase(),
      category: values.category.trim() || "Uncategorized",
      cost,
      price,
      stock,
      reorderPoint,
      unitsSold: 0,
      lastUpdated: new Date().toISOString(),
    };

    onAdd(product);
    setValues(initialState);
    setError(null);
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/40 backdrop-blur">
      <h2 className="text-lg font-semibold text-white">Add New Product</h2>
      <p className="text-sm text-slate-300">Build your catalogue and start tracking performance.</p>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
        <Input
          label="Product Name"
          value={values.name}
          onChange={(value) => setValues((prev) => ({ ...prev, name: value }))}
          required
        />
        <Input
          label="SKU"
          value={values.sku}
          onChange={(value) => setValues((prev) => ({ ...prev, sku: value }))}
          helper="Use unique codes for faster lookups."
          required
        />
        <Input
          label="Category"
          value={values.category}
          onChange={(value) => setValues((prev) => ({ ...prev, category: value }))}
          placeholder="Accessories, Apparel, Electronics…"
        />
        <Input
          label="Cost"
          type="number"
          min="0"
          step="0.01"
          value={values.cost}
          onChange={(value) => setValues((prev) => ({ ...prev, cost: value }))}
          required
        />
        <Input
          label="Price"
          type="number"
          min="0"
          step="0.01"
          value={values.price}
          onChange={(value) => setValues((prev) => ({ ...prev, price: value }))}
          required
        />
        <Input
          label="Starting Stock"
          type="number"
          min="0"
          step="1"
          value={values.stock}
          onChange={(value) => setValues((prev) => ({ ...prev, stock: value }))}
          required
        />
        <Input
          label="Reorder Point"
          type="number"
          min="0"
          step="1"
          value={values.reorderPoint}
          onChange={(value) => setValues((prev) => ({ ...prev, reorderPoint: value }))}
          required
        />

        <div className="md:col-span-2">
          {error && <p className="mb-2 text-sm text-rose-400">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Add Product
          </button>
        </div>
      </form>
    </section>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  helper?: string;
  required?: boolean;
  min?: string;
  step?: string;
};

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  helper,
  required,
  min,
  step,
}: InputProps) => (
  <label className="flex flex-col gap-2 text-sm text-slate-300">
    <span className="font-medium text-white">{label}</span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      type={type}
      placeholder={placeholder}
      required={required}
      min={min}
      step={step}
      className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
    />
    {helper && <span className="text-xs text-slate-400">{helper}</span>}
  </label>
);
