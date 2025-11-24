<!-- Copilot / AI agent instructions for contributors and coding agents -->
# Project-specific AI instructions

These notes explain the architecture, conventions, and common workflows an AI coding agent should know to be productive in this repository.

1) Big picture
- **Framework**: This is a Next.js app using the `app/` directory (React Server Components + client components). See `app/layout.tsx` and `app/page.tsx` for the root layout and entry.
- **UI structure**: Reusable UI primitives live in `components/ui/` (e.g. `button.tsx`, `input.tsx`, `toast.tsx`). Higher-level or visually-specific components are in `components/` (for example `retro-globe.tsx`, `theme-provider.tsx`). Treat `components/ui/*` as the canonical place to add or update atomic UI elements.
- **Hooks & utilities**: Lightweight hooks are in `hooks/` (e.g. `use-mobile.ts`, `use-toast.ts`) and shared helpers in `lib/utils.ts`.

2) Why the structure
- The split between `components/` and `components/ui/` separates page-specific or composite components from small, reusable primitives. Changes to `components/ui/*` can have wide cross-cutting impact — run a quick search for usages before renaming or changing prop shapes.

3) Key patterns and conventions
- **Single-responsibility primitives**: Files in `components/ui/` export one component per file; prefer minimal prop APIs and expose variations via props (e.g., size, variant) rather than new components.
- **Radix + Tailwind**: Many primitives wrap Radix UI primitives and use Tailwind classes and `class-variance-authority` for variants. Keep styling consistent with existing patterns in `components/ui/*`.
- **Theme handling**: The app uses `next-themes` via `components/theme-provider.tsx`. Use `ThemeProvider` for theme-sensitive components.
- **Toasts**: There is a hook `hooks/use-toast.ts` and UI in `components/ui/toaster.tsx` (or similarly named). Use the hook for programmatic toast triggers to match current UX.
- **No tests detected**: There are no test scripts in `package.json`. Avoid adding test assumptions without also adding scripts and devDependencies.

4) Build / dev / lint commands (copy-paste)
- Install & run dev server: `npm install` then `npm run dev` (uses Next.js `next dev`).
- Build for production: `npm run build` then `npm run start`.
- Lint: `npm run lint` (runs `eslint .`).

5) External integrations & packages of note
- `@vercel/analytics` — lightweight analytics integration; be conservative editing the analytics setup in `app/layout.tsx` or top-level components.
- `next-themes` — theme switching provider used by `components/theme-provider.tsx`.
- `vaul` — present as a dependency; treat as an external service / secrets integration (no in-repo config discovered).
- UI libs: many `@radix-ui/*` packages and `sonner` for notifications — prefer adapting existing wrapper components in `components/ui/` rather than importing Radix primitives directly in pages.

6) TypeScript & style
- Project uses TypeScript. Keep exported types in the same file unless they warrant reuse, in which case add to `lib/` or `types/` (no `types/` dir currently).
- Styling is Tailwind + PostCSS. Check `styles/globals.css` and `postcss.config.mjs` for global rules.

7) Safe editing principles for AI agents
- When changing a public UI primitive (files in `components/ui/`):
  - Search the repo for usages before renaming props.
  - Keep prop changes backwards-compatible where possible; prefer adding optional props.
  - Update `components/theme-provider.tsx` or `app/layout.tsx` only when needed for global concerns (theme, analytics, meta tags).
- When adding new dependencies, update `package.json` and ensure they are necessary — this project already includes many UI libs.

8) Files to inspect for context when working on a change
- `app/layout.tsx`, `app/page.tsx` — global layout and app-level wrappers.
- `components/theme-provider.tsx` — theme and global providers.
- `components/ui/*` — canonical UI primitives.
- `hooks/use-toast.ts`, `hooks/use-mobile.ts` — common client hooks.
- `lib/utils.ts` — shared helper functions.

9) Example tasks & where to start
- Fix a button visual bug: edit `components/ui/button.tsx`, run `npm run dev`, verify pages using the button (`app/page.tsx` or other components).
- Add a new small UI primitive: add file under `components/ui/`, export a named component, and use it in a demo page in `app/`.

10) When to ask the human
- If a change touches multiple primitives or global providers, ask for a quick review before merging.

Feedback request: review these notes and tell me if you'd like more examples (component-level code snippets), CI/PR guidelines, or deeper mapping of file-to-page usages.
