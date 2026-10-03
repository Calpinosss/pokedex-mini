import { useEffect, useState } from "react";
import {
  fetchPokemon,
  fetchSpecies,
  fetchEvolutionChain,
} from "../api/pokeapi.js";

// loads a pokemon + its species + evolution chain for one detail page.
// the api layer caches each one, so revisiting is cheap
export function usePokemonDetail(key) {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [chain, setChain] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setIsLoading(true);
      setError(null);
      setPokemon(null);
      setSpecies(null);
      setChain(null);

      try {
        const data = await fetchPokemon(key);
        if (!active) return;
        setPokemon(data);

        // species + chain are just extra stuff; if they fail, the profile still works
        const speciesPromise = fetchSpecies(data.id).catch(() => null);
        const sp = await speciesPromise;
        if (active) setSpecies(sp || null);

        if (sp?.evolution_chain?.url) {
          try {
            const chainData = await fetchEvolutionChain(sp.evolution_chain.url);
            if (active) setChain(chainData || null);
          } catch {
            if (active) setChain(null);
          }
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [key]);

  return { pokemon, species, chain, isLoading, error };
}
