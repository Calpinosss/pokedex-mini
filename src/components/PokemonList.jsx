import { useState, useEffect } from "react";

function getIdFromUrl(url) {
  // url looks like "https://pokeapi.co/api/v2/pokemon/25/"
  const parts = url.split("/").filter(Boolean); // drop empty strings from the trailing slash
  return parts[parts.length - 1];
}

function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPokemons() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        setPokemons(data.results); // [{ name, url }, ...]
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadPokemons();
  }, []); // empty array: fetch once, when the component mounts

  if (isLoading) {
    return <p className="status">Loading Pokémon…</p>;
  }

  if (error) {
    return <p className="status status-error">Couldn't load the list: {error}</p>;
  }

  return (
    <ul className="pokemon-list">
      {pokemons.map((pokemon) => {
        const id = getIdFromUrl(pokemon.url);
        return (
          <li key={pokemon.name} className="pokemon-list-item">
            <img
              className="pokemon-sprite"
              src={getSpriteUrl(id)}
              alt={pokemon.name}
              width={48}
              height={48}
            />
            <span className="pokemon-id">#{id.padStart(3, "0")}</span>
            <span className="pokemon-name">{capitalize(pokemon.name)}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default PokemonList;