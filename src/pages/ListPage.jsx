import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePokemonList } from "../hooks/usePokemonList.js";
import { PAGE_SIZE, GEN1_SIZE } from "../config.js";
import { baseStatTotal, normalizeKey } from "../utils.js";
import { typeNames, typeColor } from "../data/types.js";
import PokedexCard from "../components/PokedexCard.jsx";
import LoadingPokeball from "../components/LoadingPokeball.jsx";
import { useDeviceTheme, DEFAULT_DEVICE } from "../theme/deviceThemeContext.js";

const SORT_OPTIONS = [
  { value: "id", label: "Pokédex no." },
  { value: "name", label: "Name (A–Z)" },
  { value: "bst", label: "Total base stats" },
];

/**
 * The main list screen: a searchable, type-filterable, sortable and paginated
 * grid of the whole Gen I roster, plus a "Surprise me!" shortcut to a random
 * Pokémon.
 */
function ListPage() {
  const { pokemons, isLoading, isError, progress } = usePokemonList();
  const { setDeviceTheme } = useDeviceTheme();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState([]);
  const [sortKey, setSortKey] = useState("id");
  const [page, setPage] = useState(1);

  // The list screen always shows the neutral red device.
  useEffect(() => {
    setDeviceTheme(DEFAULT_DEVICE.theme, DEFAULT_DEVICE.label);
  }, [setDeviceTheme]);

  // Which types actually exist in the loaded roster get a filter chip.
  const availableTypes = useMemo(() => {
    const present = new Set();
    for (const pokemon of pokemons) {
      for (const type of typeNames(pokemon)) present.add(type);
    }
    return [...present];
  }, [pokemons]);

  const visible = useMemo(() => {
    const needle = normalizeKey(query);
    const filtered = pokemons.filter((pokemon) => {
      const matchesQuery =
        needle === "" ||
        pokemon.name.includes(needle) ||
        String(pokemon.id) === needle ||
        String(pokemon.id).padStart(3, "0") === needle;

      const matchesType =
        activeTypes.length === 0 ||
        typeNames(pokemon).some((type) => activeTypes.includes(type));

      return matchesQuery && matchesType;
    });

    const sorted = [...filtered];
    if (sortKey === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortKey === "bst") {
      sorted.sort((a, b) => baseStatTotal(b) - baseStatTotal(a));
    } else {
      sorted.sort((a, b) => a.id - b.id);
    }
    return sorted;
  }, [pokemons, query, activeTypes, sortKey]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = visible.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function toggleType(type) {
    setPage(1);
    setActiveTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type],
    );
  }

  function surpriseMe() {
    if (pokemons.length === 0) return;
    const pick = pokemons[Math.floor(Math.random() * pokemons.length)];
    navigate(`/pokemon/${pick.name}`);
  }

  if (isError) {
    return (
      <p className="status status-error">
        Couldn't load the Pokédex: {isError}
      </p>
    );
  }

  if (isLoading) {
    return (
      <LoadingPokeball
        label={`Loading ${progress.done} of ${progress.total} Pokémon…`}
      />
    );
  }

  return (
    <div>
      <section className="search" aria-label="Search">
        <form
          className="search-form"
          onSubmit={(event) => event.preventDefault()}
          role="search"
        >
          <input
            className="search-input"
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name or Pokédex number…"
            aria-label="Search Pokémon by name or number"
          />
          <button
            className="surprise-button"
            type="button"
            onClick={surpriseMe}
            title="Open a random Pokémon"
          >
            Surprise me!
          </button>
        </form>
      </section>

      <div className="filter-bar" aria-label="Filter by type">
        {availableTypes.map((type) => {
          const active = activeTypes.includes(type);
          return (
            <button
              key={type}
              type="button"
              className={`chip${active ? " is-active" : ""}`}
              style={active ? { background: typeColor(type), color: "#fff" } : undefined}
              onClick={() => toggleType(type)}
              aria-pressed={active}
            >
              <span
                className="chip-dot"
                style={{ background: typeColor(type) }}
                aria-hidden="true"
              />
              {type}
            </button>
          );
        })}
      </div>

      <div className="tools-row">
        <label className="tools-label" htmlFor="sort-select">
          Sort
        </label>
        <select
          id="sort-select"
          className="sort-select"
          value={sortKey}
          onChange={(event) => setSortKey(event.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <p className="result-count" aria-live="polite">
        {query === "" && activeTypes.length === 0
          ? `All ${GEN1_SIZE} Gen I Pokémon`
          : `${visible.length} Pokémon`}
      </p>

      {pageItems.length === 0 ? (
        <div className="empty-state">
          <div className="ghost" aria-hidden="true">
            👻
          </div>
          <p>No Pokémon match those filters. Try clearing the search or types.</p>
        </div>
      ) : (
        <ul className="grid">
          {pageItems.map((pokemon) => (
            <li key={pokemon.id}>
              <PokedexCard pokemon={pokemon} />
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 && (
        <nav className="pager" aria-label="Pagination">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            ← Prev
          </button>
          <span className="pager-label" aria-live="polite">
            {currentPage} / {pageCount}
          </span>
          <button
            type="button"
            disabled={currentPage === pageCount}
            onClick={() => setPage(currentPage + 1)}
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
}

export default ListPage;
