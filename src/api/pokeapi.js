import { API_BASE_URL } from "../config.js";

// little in-memory cache so we don't hit the network for the same thing twice
const pokemonCache = new Map();
const speciesCache = new Map();
const chainCache = new Map();
const listCache = new Map();

async function getJson(url, cache) {
  if (cache.has(url)) return cache.get(url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }
  const data = await response.json();
  cache.set(url, data);
  return data;
}

// grab a page of pokemon (just name + url)
export async function fetchPokemonList(limit = 151, offset = 0) {
  const url = `${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
  return getJson(url, listCache);
}

// one full pokemon by name or id
export function fetchPokemon(key) {
  const url = `${API_BASE_URL}/pokemon/${encodeURIComponent(key)}`;
  return getJson(url, pokemonCache);
}

// species data (flavor text, catch rate, gender, evolution link)
export function fetchSpecies(id) {
  const url = `${API_BASE_URL}/pokemon-species/${encodeURIComponent(id)}`;
  return getJson(url, speciesCache);
}

// evolution chain for a species (the url lives on the species object)
export function fetchEvolutionChain(url) {
  return getJson(url, chainCache);
}

// load lots of pokemon at once, with a cap on how many run in parallel
// a bad one just comes back as null so the rest of the list still renders
export async function fetchPokemonBatch(keys, concurrency = 15, onProgress) {
  const results = new Array(keys.length);
  let cursor = 0;
  let done = 0;

  async function worker() {
    while (cursor < keys.length) {
      const index = cursor++;
      try {
        results[index] = await fetchPokemon(keys[index]);
      } catch {
        results[index] = null;
      }
      done += 1;
      if (onProgress) onProgress(done, keys.length);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, keys.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}
