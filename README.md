# HarvestLedger

HarvestLedger is an inventory dashboard built for **Green Valley Cooperative**, a small agricultural collective that tracks produce stock levels, prepares bulk fulfillment batches, and monitors low-stock alerts across vegetables, fruits, grains, and herbs.

Built with React 18, TypeScript, and Vite.

## Requirements

- Node.js 20+
- npm 10+

## Scripts

```bash
npm install
npm run dev        # start dev server
npm test           # run Vitest suite
npm run typecheck  # TypeScript check
npm run build      # production build
```

## Features

- Searchable, filterable inventory table with live stock refresh simulation
- Row selection with bulk action bar
- Accessible form controls with labels, live regions, and status badges

## Project structure

```
src/
  components/   UI components
  hooks/        Data fetching hooks
  data/         Mock inventory seed data
  types/        Shared TypeScript types
  __tests__/    Vitest + Testing Library tests
```

## License

Private — Green Valley Cooperative internal use only.

<!-- maintenance-33 -->
