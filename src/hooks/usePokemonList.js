import { useEffect, useState } from "react";
import { fetchPokemonList, fetchPokemonBatch } from "../api/pokeapi.js";
import { GEN1_SIZE, FETCH_CONCURRENCY } from "../config.js";
import { getIdFromUrl } from "../utils.js";

// loads the whole gen 1 list as full pokemon objects so we can search,
// filter and sort it all on the client side
export function usePokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const [progress, setProgress] = useState({ done: 0, total: GEN1_SIZE });

  useEffect(() => {
    let active = true;

    async function load() {
      setIsLoading(true);
      setIsError(null);
      setPokemons([]);

      try {
        const list = await fetchPokemonList(GEN1_SIZE, 0);
        const keys = list.results.map((item) => getIdFromUrl(item.url));

        const batch = await fetchPokemonBatch(keys, FETCH_CONCURRENCY, (done, total) => {
          if (active) setProgress({ done, total });
        });

        if (!active) return;
        const loaded = batch.filter(Boolean).sort((a, b) => a.id - b.id);
        setPokemons(loaded);
      } catch (err) {
        if (active) setIsError(err.message);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return { pokemons, isLoading, isError, progress };
}
