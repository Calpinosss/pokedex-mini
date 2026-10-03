import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { usePokemonList } from "../hooks/usePokemonList.js";
import { useFavorites } from "../context/FavoritesContext.jsx";
import PokedexCard from "../components/PokedexCard.jsx";
import LoadingPokeball from "../components/LoadingPokeball.jsx";
import { useDeviceTheme, DEFAULT_DEVICE } from "../theme/deviceThemeContext.js";

/**
 * The favorites screen: shows only the Pokémon the user has starred. It
 * reuses the shared list hook so favorites are always backed by the real
 * Gen I roster, and renders the same card component as the main list.
 */
export default function FavoritesPage() {
  const { pokemons, isLoading, isError } = usePokemonList();
  const { favorites } = useFavorites();
  const { setDeviceTheme } = useDeviceTheme();

  useEffect(() => {
    setDeviceTheme(DEFAULT_DEVICE.theme, DEFAULT_DEVICE.label);
  }, [setDeviceTheme]);

  const favoritePokemons = useMemo(() => {
    const favoriteIds = new Set(favorites);
    return pokemons.filter((pokemon) => favoriteIds.has(pokemon.id));
  }, [pokemons, favorites]);

  if (isError) {
    return <p className="status status-error">Couldn't load favorites: {isError}</p>;
  }

  if (isLoading) {
    return <LoadingPokeball label="Loading favorites…" />;
  }

  return (
    <div>
      <Link to="/" className="back-link">
        ← Back to list
      </Link>
      <h2 className="favorites-heading">Favorites</h2>

      {favoritePokemons.length === 0 ? (
        <div className="empty-state">
          <div className="ghost" aria-hidden="true">
            ☆
          </div>
          <p>
            No favorites yet. Tap the <strong>star</strong> on any Pokémon card
            to add it here.
          </p>
        </div>
      ) : (
        <>
          <p className="result-count" aria-live="polite">
            {favoritePokemons.length} favorite
            {favoritePokemons.length !== 1 ? "s" : ""}
          </p>
          <ul className="grid">
            {favoritePokemons.map((pokemon) => (
              <li key={pokemon.id}>
                <PokedexCard pokemon={pokemon} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
