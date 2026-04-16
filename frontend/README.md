# Frontend — The Scholarly Curator

React 19 + Vite 8 frontend for the Study Planner & Assignment Tracker.

## Stack

- **React 19** with hooks (useState, useEffect, useMemo)
- **Vite 8** with `@vitejs/plugin-react`
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **clsx** + **tailwind-merge** for conditional class merging (`cn()` helper)
- **Material Symbols Outlined** icons (Google Fonts CDN)
- **Plus Jakarta Sans** + **Manrope** fonts (Google Fonts CDN)

## Path Alias

`@` resolves to `./src` — configured in `vite.config.js`.

```js
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
```

## Dev Server

```bash
npm install
npm run dev
# http://localhost:5173
```

API calls proxy to `http://localhost:5000` (Flask backend must be running).

## Key Components

| File | Purpose |
|------|---------|
| `App.jsx` | Root layout, state, sidebar wiring |
| `components/AssignmentCard.jsx` | Card with status badge, checkbox, edit/delete |
| `components/AssignmentForm.jsx` | Add/edit modal form |
| `components/AssignmentList.jsx` | Responsive grid of cards |
| `components/FilterSort.jsx` | Course pill filter + sort dropdown |
| `components/ui/sidebar.jsx` | Collapsible sidebar primitives (SidebarProvider, Sidebar, SidebarTrigger, …) |
| `lib/utils.js` | `cn()` — clsx + tailwind-merge |
| `utils/time.js` | `formatDueDate()`, `getStatusLabel()` |
