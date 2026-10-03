# Pokédex Mini

A retro, pixel-art Pokédex for all 151 Generation I Pokémon, styled like a
Tokyo night city. You can browse the whole roster, search and filter it, open a
full profile for any Pokémon (stats, radar chart, flavor text, evolution
chain, type effectiveness), add favorites, and compare two Pokémon side by
side.

The interface is themed as a handheld device: a dark Pokédex bezel around a
digital screen, with a layered night-city background, CRT scanlines, and a
pixel-art aesthetic inspired by classic 8/16-bit Pokémon games.

## Features

- **Browse** all 151 Gen I Pokémon in a paginated grid.
- **Search** by name or Pokédex number (live as you type).
- **Filter** by one or more types at the same time.
- **Sort** by Pokédex number, name, or total base stats.
- **Surprise me** — jump to a random Pokémon.
- **Detail page** — animated stat bars, a radar chart, shiny toggle, cry
  playback, height/weight/catch-rate/gender, flavor text, evolution chain, and
  type effectiveness.
- **Favorites** — star any Pokémon; the list is saved in your browser and
  shows up on the Favorites page.
- **Compare** — pick two Pokémon and see an overlaid radar chart and a
  stat-by-stat table with the difference.

The device re-skins itself to the current Pokémon's type on the detail
screen, then goes back to the neutral red skin on the list page.

## Tech stack

- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/) (hash routing)
- [PokeAPI](https://pokeapi.co/) for all Pokémon data
- Plain CSS (no UI framework), pixel fonts (VT323 + Fredoka)

No backend. All data is fetched client-side from the PokeAPI public REST API,
and cached in memory for the session so navigating back and forth does not
re-hit the network.

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm run dev
```

Then open the printed URL (usually `http://localhost:5173/pokedex-mini/`).
The dev server has a `/pokedex-mini/` base path, so keep that part of the URL.

### Build for production

```bash
npm run build
```

This outputs a static site to `dist/`.

### Preview the production build locally

```bash
npm run preview
```

Then open the printed URL (usually `http://localhost:4173/pokedex-mini/`).

### Lint

The project uses [Oxlint](https://oxlint.dev):

```bash
npx oxlint src
```

## How to use the site

### List page (home)

- Type in the search box to filter by name or number (e.g. `pika`, `25`,
  `025`).
- Tap the type chips to filter; combine several to narrow the list.
- Use the **Sort** dropdown to reorder the grid.
- Hit **Surprise me!** to open a random Pokémon.
- Click the star on any card to add or remove it from favorites.
- Use the **Prev / Next** buttons to page through the results (30 per page).

### Favorites

- The star link in the header (with a count badge) opens the Favorites page.
- Favorite Pokémon are stored in your browser's `localStorage`, so they
  survive a refresh. Clearing site data will remove them.

### Detail page

- Opened by clicking any Pokémon card (or an evolution stage).
- Toggle **Shiny** to swap the artwork to its shiny version.
- **Play cry** plays the Pokémon's cry.
- The **Stats** panel shows an animated radar chart and stat bars, plus the
  base stat total.
- The **Profile** panel shows height, weight, catch rate, gender, and the
  flavor text.
- The **Evolution** panel draws the full evolution chain; clicking a stage
  opens that Pokémon. Re-clicking the one that is already open just scrolls
  back to the top of the page.
- The **Type effectiveness** panel lists what the Pokémon is weak, resistant,
  and immune to.
- The **Compare** button opens the compare screen with this Pokémon already
  selected in slot A.

### Compare page

- Pick any two Pokémon in the two dropdowns (they cannot be the same one).
- The overlaid radar shows both stat shapes at once (slot A in cyan, slot B in
  pink), and the table below shows each stat, both values, and the difference.

### Header

- The logo returns you to the list.
- ⇄ opens the compare page.
- ★ opens the favorites page.

## Project structure

```
src/
  App.jsx                  # routes + providers
  main.jsx                 # entry point, manual scroll restoration
  index.css                # the whole Tokyo Night design system
  config.js                # shared constants (list size, page size, URLs)
  utils.js                 # small shared helpers
  api/pokeapi.js           # fetch + in-memory cache layer
  data/
    types.js               # type colors and labels
    typeEffectiveness.js   # damage multiplier math
  hooks/
    usePokemonList.js      # loads + hydrates the full Gen I roster
    usePokemonDetail.js    # loads one pokemon + species + evolution chain
  theme/
    deviceThemeContext.js  # neutral/red device theme defaults
    DeviceThemeProvider.jsx# re-skins the device per pokemon
  context/
    FavoritesContext.jsx   # favorites store (localStorage)
  components/              # cards, charts, panels, logo, etc.
  pages/
    ListPage.jsx           # home / browse
    DetailPage.jsx         # one pokemon profile
    FavoritesPage.jsx      # starred pokemon
    ComparePage.jsx        # two-pokemon comparison
    NotFoundPage.jsx       # 404
public/
  city/near.png            # the night-city background image
  city/*.svg               # older layered city art (kept for reference)
  favicon.svg
```

## Data

All Pokémon data comes from [PokeAPI](https://pokeapi.co/). No API key is
required. The app loads the full 151 Gen I roster on first visit and caches it
in memory for the session.

## Notes

- The list screen shows all 151 Generation I Pokémon. To change that, edit
  `GEN1_SIZE` in `src/config.js`.
- The city background lives in `public/city/near.png`; swap that file (same
  name) to change the scene without touching any code.
- Favorites are the only thing written to your browser's storage.
