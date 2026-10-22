# Mango Range

Custom dual-handle `<Range />` component built with Next.js (App Router) and TypeScript.

## Run

```bash
npm install
npm run dev        # http://localhost:8080
npm test           # unit + integration tests
npm run lint && npm run typecheck
```

- `/exercise1` — normal range, bounds from `GET /api/range`. Click a value label to type a new one.
- `/exercise2` — fixed values range, values from `GET /api/range-values`.

## Structure

```
src/
├── app/          # Server Component pages + mock API route handlers
├── components/   # atoms (Handle, Track, CurrencyLabel) → molecules (EditableLabel) → organisms (Range)
├── domain/       # pure range logic, no React
└── services/     # HTTP client for the mock API
```

## Key decisions

- **Server first:** pages fetch the mock API on the server and pass plain data down; only `<Range />` is a client component.
- **One component, two modes:** props are a discriminated union (`{ min, max }` or `{ values }`), so mixing modes does not compile.
- **Fixed mode reuses normal mode:** it runs over the indexes of `values`, which gives snapping, keyboard steps and even spacing for free.
- **Accessible:** each handle is a `role="slider"` with ARIA values, full keyboard support (arrows, PageUp/PageDown, Home/End), Pointer Events for mouse and touch, and click on the line as a non-drag alternative.
- **Uncontrolled:** `<Range />` owns its state (`defaultValue`, `onChange`), so pages stay Server Components.
