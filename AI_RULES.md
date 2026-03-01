# AI Rules

## Tech Stack

- **React 18** with **TypeScript** — all source code lives in `src/` and must be written in `.tsx` / `.ts`.
- **Vite 5** (with the SWC React plugin) for bundling, dev server, and HMR. The `@` path alias maps to `./src`.
- **React Router DOM v6** for client-side routing. All route definitions live in `src/App.tsx`.
- **Tailwind CSS 3** for styling, configured with CSS variables, the `tailwindcss-animate` plugin, and a custom design-token palette (primary, secondary, destructive, success, warning, muted, accent, sidebar, etc.).
- **shadcn/ui** (default style, CSS-variables mode) as the component library. Pre-built components are in `src/components/ui/` and should **not** be edited directly.
- **Radix UI** primitives power the shadcn/ui components — they are already installed and should only be consumed through the shadcn/ui wrappers.
- **Tanstack React Query v5** for async server-state management (fetching, caching, mutations).
- **React Hook Form + Zod** (`@hookform/resolvers`) for form state management and schema validation.
- **Recharts** for data visualisation and charting.
- **Framer Motion** for animations and transitions.
- **Lucide React** for icons.

## Rules

### Project Structure
1. All source code goes in `src/`.
2. Pages go in `src/pages/` — one file per route.
3. Reusable components go in `src/components/`.
4. Hooks go in `src/hooks/`.
5. Utility functions and shared data go in `src/lib/`.
6. Routes are defined **only** in `src/App.tsx` — do not create route definitions elsewhere.

### Styling
7. **Always use Tailwind CSS classes** for layout, spacing, colors, typography, and responsive design. Do not write raw CSS unless absolutely necessary.
8. Use the `cn()` helper from `@/lib/utils` to merge conditional class names.
9. Reference design tokens via Tailwind (`bg-primary`, `text-muted-foreground`, etc.) — never hard-code hex/hsl values.

### Components & UI
10. **Use shadcn/ui components** (`@/components/ui/*`) for all standard UI elements (buttons, dialogs, inputs, selects, toasts, etc.). Do not install or use alternative component libraries.
11. **Do not edit** files inside `src/components/ui/`. If you need a variant, create a new wrapper component in `src/components/`.
12. Use **Lucide React** for all icons. Do not add other icon libraries.
13. Use **Sonner** (`@/components/ui/sonner`) or the built-in **Toaster** (`@/components/ui/toaster`) for toast notifications.

### Data & State
14. Use **Tanstack React Query** for all server-state: data fetching, caching, pagination, and mutations. Do not use `useEffect` + `useState` for API calls.
15. Use **React Hook Form** with **Zod** resolvers for form handling and validation. Do not build custom form state management.
16. For simple client-only state, plain React `useState` / `useReducer` / context is fine — no need for an external state library.

### Animations
17. Use **Framer Motion** for complex animations and page transitions.
18. Use **Tailwind's `animate-*` utilities** or `tailwindcss-animate` classes for simple CSS animations (fades, spins, pulses).

### Charts
19. Use **Recharts** for all charts and data visualisations. Wrap them with the shadcn chart component (`@/components/ui/chart`) when applicable.

### Testing
20. Write tests with **Vitest** and **React Testing Library**. Test files go in `src/test/` or co-located as `*.test.ts(x)`.

### General
21. Always use TypeScript — no `.js` / `.jsx` files.
22. Use the `@/` import alias for all project imports (e.g., `@/components/...`, `@/lib/...`).
23. Keep files small and focused. Prefer composition over large monolithic components.
24. Do not install new dependencies without explicit approval. The existing stack covers UI, forms, data fetching, charts, animations, and icons.
