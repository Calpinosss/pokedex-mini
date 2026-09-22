import { useState } from "react";

function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function SearchForm() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser's default full-page reload

    const name = query.trim().toLowerCase();

    if (name === "") {
      setError("Type a Pokémon name first.");
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null); // clear the old result so a slow new search doesn't show stale data mid-flight

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

      if (!response.ok) {
        throw new Error(`No Pokémon named "${name}" — check the spelling.`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="search">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a Pokémon by name…"
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {isLoading && <p className="status">Looking up {query}…</p>}
      {error && <p className="status status-error">{error}</p>}

      {result && (
        <div className="search-result">
          <img
            src={result.sprites.front_default}
            alt={result.name}
            width={64}
            height={64}
          />
          <div>
            <p className="pokemon-name">{capitalize(result.name)}</p>
            <p className="pokemon-types">
              {result.types.map((t) => t.type.name).join(", ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchForm;