# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio/resume SPA (live at dannycode.site) built with Vue 3 (Composition API, `<script setup lang="ts">`), Vite 6, Pinia, Vue Router 4, Bootstrap 5 + SASS. It is a fork of Ryan Balieiro's Vue resume template, so `docs/CONFIGURATION.md` and `docs/DEPLOYMENT.md` describe the original template and are partly outdated (e.g. there is no `public/data/settings.json` and no GitHub Actions workflow; the site deploys to Vercel).

## Commands

```bash
npm run dev          # Vite dev server on localhost:5173
npm run build        # vue-tsc --noEmit type-check, then vite build -> dist/
npm run preview      # serve the built dist/
npm run type-check   # vue-tsc --noEmit only
npm run lint         # eslint src/**/*.{ts,vue}
npm run lint:fix
```

There is no test suite. Verify changes with `npm run build` (which fails on type errors) and `npm run lint`.

`npm run resume:clear` wipes portfolio data/images; it's a leftover from the template and expects a `settings.json` that no longer exists. Don't run it.

## Architecture

### Content is data, not code
Almost all portfolio content lives in JSON under `public/data/`, fetched at runtime (not bundled):

- `strings.json`: UI strings by locale
- `profile.json`: name, photo, contact info
- `categories.json`: nav groupings
- `sections.json`: ordered list of sections. Each has `id`, `categoryId`, `jsonPath` (to a file in `public/data/sections/`), `faIcon`, `type` (`centered` | `column` | `row`), and `locales`
- `sections/*.json`: each holds an `articles` array. Each article names a `component` (e.g. `ArticleThread`, `ArticleTimeline`, `ArticleSkills`), with `settings` and `items`

Text fields are nested under `locales.<lang>` (only `en` is used now). In titles, `*word*` marks highlighted text.

### Load flow
`App.vue` calls `useDataManagerStore().loadData()` ([src/stores/DataManager.ts](src/stores/DataManager.ts)). It fetches the JSON files, builds `Section`/`Category` model instances from [src/models/](src/models/), validates ids (it throws on duplicates or an unknown `categoryId`), loads each section's articles, then sets `didLoadAllJsonFiles`. Nothing renders until that flag is true. App settings (language list, preloader, nav toggle) are hardcoded in `DataManager.ts`.

`LanguageManager` store provides `localize()` / `localizeFromStrings()` / `localizeDate()`, which every component uses for text.

### Rendering
- `src/vue/stack/` holds wrapper components nested in `App.vue` (WindowObserver → FeedbacksManager → LocationManager → ModalManager → Resume). They share state through `provide`/`inject`, e.g. `isDesktopLayout`, `currentSection`, `presentationMode`, `navigateToSection`, `setSpinnerEnabled`.
- [SectionBody.vue](src/vue/components/sections/SectionBody.vue) maps each article's `component` string to a Vue component through `ARTICLES_MAP`. A new article component must be registered there, or it renders as `ArticleUnavailable`.
- Optional item fields (e.g. `code` → `CodeBlock` widget with highlight.js) are parsed in [src/models/ArticleItem.ts](src/models/ArticleItem.ts) and rendered in the matching item component.
- Desktop shows all sections at once; mobile shows one at a time (`PresentationModes` in `src/composables/constants.ts`).

### Routing
Each route is a section `id` (`/about`, `/education`, …), and all routes render `App`. `LocationManager` turns `route.path` into the current section. Routes are defined in [src/router/index.ts](src/router/index.ts). `vercel.json` rewrites every path to `index.html`.

### Conventions
- Imports use absolute `/src/...` paths (e.g. `import X from "/src/vue/components/..."`). Vite resolves these from the project root.
- `src/scss/_theming.scss` (variables, mixins, Bootstrap functions/mixins) is auto-injected into every SCSS block by `vite.config.ts`. Component styles can use `$primary`, `media-breakpoint-up/down`, etc. without importing anything. Theme colors are in `src/scss/_variables.scss`.
- ESLint: unused vars are warnings, and a leading `_` silences them.
