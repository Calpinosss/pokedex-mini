import { useFavorites } from "../context/FavoritesContext.jsx";

/**
 * A small pixel star button that toggles a Pokémon in/out of the user's
 * favorites. Safe to place inside a <Link>: the click handler stops
 * propagation and prevents the default action so the parent card does not
 * navigate.
 *
 * @param {{ pokemonId: number }} props
 */
export default function FavoriteButton({ pokemonId }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(pokemonId);

  return (
    <button
      className={`fav-btn${active ? " is-active" : ""}`}
      type="button"
      aria-pressed={active}
      title={active ? "Remove from favorites" : "Add to favorites"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(pokemonId);
      }}
    >
      {active ? "★" : "☆"}
    </button>
  );
}
