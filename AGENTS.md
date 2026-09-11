
## Package manager
Always use `pnpm` 

## Git

Conventional commits, concise imperative: `feat:`, `fix:`, `chore:`, `refactor:`, `style:`, `docs:`

## i18n
This project uses `@astrolicious/i18n` for internationalization - under the hood it uses [i18next](https://www.i18next.com/).
Anytime you are working on i18n make sure to read the [i18n docs](https://astro-i18n.netlify.app/) and the [i18next](https://www.i18next.com/llms.txt).

Context7 library IDs for fetching docs:
- `@astrolicious/i18n`: `/astrolicious/i18n`
- `i18next`: `/i18next/i18next`

Key utilities (all imported from `i18n:astro`):
- `t()` — translation function (requires `client: { translations: true, data: true }`)
- `getLocale()` — current locale at runtime (requires `client: { data: true }`)
- `getLocalePlaceholder()` — current locale in `getStaticPaths` (no client config needed)
- `getSwitcherData()` — locale switcher data (requires `client: { data: true, paths: true }`)

Translation file structure: `src/locales/{locale}/{namespace}.json` (default namespace: `common.json`)

## Documentation

Full documentation: https://docs.astro.build — consult before related tasks:

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Styling and Tailwind](https://docs.astro.build/en/guides/styling/)
- [Fonts](https://docs.astro.build/en/guides/fonts/)