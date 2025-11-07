'use client';

import { AddProductForm } from "@/components/AddProductForm";
import { InventoryTrend } from "@/components/InventoryTrend";
import { PerformanceHighlights } from "@/components/PerformanceHighlights";
import { ProductTable } from "@/components/ProductTable";
import { RecordSaleForm } from "@/components/RecordSaleForm";
import { RestockForm } from "@/components/RestockForm";
import { SalesHistory } from "@/components/SalesHistory";
import { StockAlerts } from "@/components/StockAlerts";
import { SummaryCards } from "@/components/SummaryCards";
import {
  calculateInventoryValue,
  calculateProfit,
  calculateRevenue,
} from "@/lib/metrics";
import type { InventorySnapshot, Product, SaleRecord } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";

const STORAGE_KEY = "agentic-store-tracker-v1";

const seedProducts: Product[] = [
  {
    id: "prd-balance-notebook",
    name: "Balance Notebook",
    sku: "STN-001",
    category: "Stationery",
    cost: 8,
    price: 20,
    stock: 72,
    reorderPoint: 30,
    unitsSold: 0,
    lastUpdated: "2024-08-28T10:15:00.000Z",
  },
  {
    id: "prd-lumen-desk-lamp",
    name: "Lumen Desk Lamp",
    sku: "LGT-214",
    category: "Lighting",
    cost: 22,
    price: 55,
    stock: 36,
    reorderPoint: 12,
    unitsSold: 0,
    lastUpdated: "2024-08-24T13:30:00.000Z",
  },
  {
    id: "prd-terracotta-planters",
    name: "Terracotta Planter Set",
    sku: "DEC-118",
    category: "Home Decor",
    cost: 14,
    price: 36,
    stock: 58,
    reorderPoint: 18,
    unitsSold: 0,
    lastUpdated: "2024-08-26T09:20:00.000Z",
  },
  {
    id: "prd-aerowire-charger",
    name: "Aerowire Charging Pad",
    sku: "ELC-332",
    category: "Electronics",
    cost: 19,
    price: 49,
    stock: 44,
    reorderPoint: 15,
    unitsSold: 0,
    lastUpdated: "2024-08-27T11:05:00.000Z",
  },
  {
    id: "prd-linen-throw",
    name: "Coastal Linen Throw",
    sku: "TXT-207",
    category: "Textiles",
    cost: 28,
    price: 75,
    stock: 28,
    reorderPoint: 10,
    unitsSold: 0,
    lastUpdated: "2024-08-29T16:45:00.000Z",
  },
  {
    id: "prd-coldbrew-kit",
    name: "Cold Brew Essentials Kit",
    sku: "KTC-041",
    category: "Kitchen",
    cost: 15,
    price: 42,
    stock: 62,
    reorderPoint: 20,
    unitsSold: 0,
    lastUpdated: "2024-08-25T15:10:00.000Z",
  },
];

const seedSales: SaleRecord[] = [
  {
    id: "sale-001",
    productId: "prd-balance-notebook",
    quantity: 40,
    date: "2024-08-12T09:00:00.000Z",
    revenue: 800,
    profit: 480,
  },
  {
    id: "sale-002",
    productId: "prd-balance-notebook",
    quantity: 35,
    date: "2024-08-20T10:15:00.000Z",
    revenue: 700,
    profit: 420,
  },
  {
    id: "sale-003",
    productId: "prd-balance-notebook",
    quantity: 30,
    date: "2024-08-28T10:15:00.000Z",
    revenue: 600,
    profit: 360,
  },
  {
    id: "sale-004",
    productId: "prd-lumen-desk-lamp",
    quantity: 15,
    date: "2024-08-10T11:30:00.000Z",
    revenue: 825,
    profit: 495,
  },
  {
    id: "sale-005",
    productId: "prd-lumen-desk-lamp",
    quantity: 12,
    date: "2024-08-18T13:30:00.000Z",
    revenue: 660,
    profit: 396,
  },
  {
    id: "sale-006",
    productId: "prd-lumen-desk-lamp",
    quantity: 18,
    date: "2024-08-24T13:30:00.000Z",
    revenue: 990,
    profit: 594,
  },
  {
    id: "sale-007",
    productId: "prd-terracotta-planters",
    quantity: 22,
    date: "2024-08-14T09:20:00.000Z",
    revenue: 792,
    profit: 484,
  },
  {
    id: "sale-008",
    productId: "prd-terracotta-planters",
    quantity: 18,
    date: "2024-08-21T09:20:00.000Z",
    revenue: 648,
    profit: 396,
  },
  {
    id: "sale-009",
    productId: "prd-terracotta-planters",
    quantity: 16,
    date: "2024-08-26T09:20:00.000Z",
    revenue: 576,
    profit: 352,
  },
  {
    id: "sale-010",
    productId: "prd-aerowire-charger",
    quantity: 30,
    date: "2024-08-09T08:30:00.000Z",
    revenue: 1470,
    profit: 900,
  },
  {
    id: "sale-011",
    productId: "prd-aerowire-charger",
    quantity: 24,
    date: "2024-08-18T11:05:00.000Z",
    revenue: 1176,
    profit: 720,
  },
  {
    id: "sale-012",
    productId: "prd-aerowire-charger",
    quantity: 27,
    date: "2024-08-27T11:05:00.000Z",
    revenue: 1323,
    profit: 810,
  },
  {
    id: "sale-013",
    productId: "prd-linen-throw",
    quantity: 12,
    date: "2024-08-15T16:45:00.000Z",
    revenue: 900,
    profit: 564,
  },
  {
    id: "sale-014",
    productId: "prd-linen-throw",
    quantity: 10,
    date: "2024-08-22T16:45:00.000Z",
    revenue: 750,
    profit: 470,
  },
  {
    id: "sale-015",
    productId: "prd-linen-throw",
    quantity: 16,
    date: "2024-08-29T16:45:00.000Z",
    revenue: 1200,
    profit: 752,
  },
  {
    id: "sale-016",
    productId: "prd-coldbrew-kit",
    quantity: 26,
    date: "2024-08-11T15:10:00.000Z",
    revenue: 1092,
    profit: 702,
  },
  {
    id: "sale-017",
    productId: "prd-coldbrew-kit",
    quantity: 32,
    date: "2024-08-20T15:10:00.000Z",
    revenue: 1344,
    profit: 864,
  },
  {
    id: "sale-018",
    productId: "prd-coldbrew-kit",
    quantity: 24,
    date: "2024-08-25T15:10:00.000Z",
    revenue: 1008,
    profit: 648,
  },
];

const applySeedSalesToProducts = (products: Product[], sales: SaleRecord[]) => {
  const productMap = new Map(products.map((product) => [product.id, product]));
  sales.forEach((sale) => {
    const product = productMap.get(sale.productId);
    if (!product) {
      return;
    }
    product.unitsSold += sale.quantity;
    if (sale.date > product.lastUpdated) {
      product.lastUpdated = sale.date;
    }
  });
  return products;
};

const seededProducts = applySeedSalesToProducts(
  seedProducts.map((product) => ({ ...product })),
  seedSales,
);

const createSnapshot = (products: Product[], sales: SaleRecord[]): InventorySnapshot => ({
  date: new Date().toISOString(),
  inventoryValue: calculateInventoryValue(products),
  revenueToDate: calculateRevenue(sales),
  profitToDate: calculateProfit(sales),
});

const generateInitialSnapshots = (
  products: Product[],
  sales: SaleRecord[],
): InventorySnapshot[] => {
  const inventoryValue = calculateInventoryValue(products);
  const revenue = calculateRevenue(sales);
  const profit = calculateProfit(sales);
  const steps = [0.72, 0.8, 0.88, 0.95, 1];
  const now = new Date();

  return steps.map((factor, index) => {
    const snapshotDate = new Date(now);
    snapshotDate.setDate(snapshotDate.getDate() - (steps.length - 1 - index) * 7);
    return {
      date: snapshotDate.toISOString(),
      inventoryValue: Math.round(inventoryValue * factor),
      revenueToDate: Math.round(revenue * factor),
      profitToDate: Math.round(profit * factor),
    };
  });
};

const seededSnapshots = generateInitialSnapshots(seededProducts, seedSales);

const cloneProducts = (items: Product[]) => items.map((product) => ({ ...product }));
const cloneSales = (items: SaleRecord[]) => items.map((sale) => ({ ...sale }));
const cloneSnapshots = (items: InventorySnapshot[]) =>
  items.map((snapshot) => ({ ...snapshot }));

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [snapshots, setSnapshots] = useState<InventorySnapshot[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          products: Product[];
          sales: SaleRecord[];
          snapshots: InventorySnapshot[];
        };
        setProducts(cloneProducts(parsed.products ?? []));
        setSales(cloneSales(parsed.sales ?? []));
        setSnapshots(cloneSnapshots(parsed.snapshots ?? []));
      } catch (error) {
        console.error("Failed to parse stored inventory data", error);
        setProducts(cloneProducts(seededProducts));
        setSales(cloneSales(seedSales));
        setSnapshots(cloneSnapshots(seededSnapshots));
      }
    } else {
      setProducts(cloneProducts(seededProducts));
      setSales(cloneSales(seedSales));
      setSnapshots(cloneSnapshots(seededSnapshots));
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || typeof window === "undefined") {
      return;
    }
    const payload = JSON.stringify({ products, sales, snapshots });
    window.localStorage.setItem(STORAGE_KEY, payload);
  }, [products, sales, snapshots, loaded]);

  const pushSnapshot = (nextProducts: Product[], nextSales: SaleRecord[]) => {
    const snapshot = createSnapshot(nextProducts, nextSales);
    setSnapshots((prev) => [...prev.slice(-11), snapshot]);
  };

  const handleAddProduct = (product: Product) => {
    setProducts((current) => {
      const nextProducts = [...current, product];
      pushSnapshot(nextProducts, sales);
      return nextProducts;
    });
  };

  const handleRecordSale = (productId: string, quantity: number) => {
    setProducts((currentProducts) => {
      const target = currentProducts.find((product) => product.id === productId);
      if (!target) {
        return currentProducts;
      }

      if (target.stock < quantity) {
        return currentProducts;
      }

      const updatedProducts = currentProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              stock: product.stock - quantity,
              unitsSold: product.unitsSold + quantity,
              lastUpdated: new Date().toISOString(),
            }
          : product,
      );

      const saleRecord: SaleRecord = {
        id: uuid(),
        productId,
        quantity,
        date: new Date().toISOString(),
        revenue: quantity * target.price,
        profit: quantity * (target.price - target.cost),
      };

      setSales((currentSales) => {
        const nextSales = [...currentSales, saleRecord];
        pushSnapshot(updatedProducts, nextSales);
        return nextSales;
      });

      return updatedProducts;
    });
  };

  const handleRestock = (productId: string, quantity: number) => {
    setProducts((currentProducts) => {
      const updatedProducts = currentProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              stock: product.stock + quantity,
              lastUpdated: new Date().toISOString(),
            }
          : product,
      );
      pushSnapshot(updatedProducts, sales);
      return updatedProducts;
    });
  };

  const handleReset = () => {
    setProducts(cloneProducts(seededProducts));
    setSales(cloneSales(seedSales));
    setSnapshots(cloneSnapshots(seededSnapshots));
  };

  const inventoryValue = useMemo(() => calculateInventoryValue(products), [products]);
  const totalRevenue = useMemo(() => calculateRevenue(sales), [sales]);
  const totalProfit = useMemo(() => calculateProfit(sales), [sales]);
  const lowStockProducts = useMemo(
    () => products.filter((product) => product.stock <= product.reorderPoint),
    [products],
  );

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="animate-pulse text-center">
          <p className="text-sm uppercase tracking-widest text-slate-400">Loading dashboard</p>
          <p className="mt-2 text-2xl font-semibold">Initializing inventory data…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-24 text-white">
      <div className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="absolute inset-x-12 top-6 -z-10 h-56 rounded-full bg-sky-500/20 blur-3xl" />

        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Store Performance Command Center
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Monitor catalog health, profitability, and restock readiness with real-time inventory
              analytics tailored to your store.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-sky-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400/40 sm:w-auto"
          >
            Reset demo data
          </button>
        </header>

        <section className="mt-10 space-y-6">
          <SummaryCards
            products={products}
            sales={sales}
            lowStockCount={lowStockProducts.length}
            inventoryValue={inventoryValue}
            totalProfit={totalProfit}
            totalRevenue={totalRevenue}
          />

          <PerformanceHighlights products={products} sales={sales} />

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <ProductTable products={products} sales={sales} />
            <div className="flex flex-col gap-6">
              <StockAlerts products={products} />
              <SalesHistory products={products} sales={sales} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <InventoryTrend snapshots={snapshots} />
            <div className="flex flex-col gap-6">
              <RecordSaleForm products={products} onRecordSale={handleRecordSale} />
              <RestockForm products={products} onRestock={handleRestock} />
            </div>
          </div>

          <AddProductForm onAdd={handleAddProduct} />
        </section>
      </div>
    </main>
  );
}
