# Agentic Store Tracker

Agentic Store Tracker is a data-rich dashboard for owners who need to monitor their store catalogue, profitability, and stock positions in real time. It is built with the Next.js App Router, TypeScript, and Tailwind CSS so it can be deployed quickly to Vercel.

## Features

- 💹 **Executive metrics** – inventory value, revenue, profit, product count, low-stock alerts, and average margin
- 📦 **Product catalogue** – searchable, sortable table with margins, revenue, profit, and live stock status badges
- ⚡ **Operational actions** – add products, log sales (auto-adjust stock + profit), and restock inventory
- 🚨 **Restock alerts** – proactive panels for items at or below their reorder point
- 🧠 **Performance insights** – highlights for top revenue, profit, and velocity products
- 📈 **Inventory trendline** – lightweight SVG visualization of inventory valuation snapshots
- 📝 **Sales activity** – recent sales feed to track movement across the catalogue
- 💾 **Persistent state** – data is stored locally in the browser so it survives refreshes

## Development

1. Install dependencies

   ```bash
   npm install
   ```

2. Run the dev server

   ```bash
    npm run dev
   ```

3. Visit [http://localhost:3000](http://localhost:3000) to explore the dashboard.

## Production build

```bash
npm run build
npm run start
```

## Deployment

Deploy directly to Vercel with:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-a381402e
```

Set `VERCEL_TOKEN` beforehand if it is not already present. The production site will be available at [https://agentic-a381402e.vercel.app](https://agentic-a381402e.vercel.app).
