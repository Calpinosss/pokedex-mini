// constants we don't want to scatter around the codebase
export const API_BASE_URL = "https://pokeapi.co/api/v2";
export const SPRITE_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

// how many gen 1 pokemon we pull in
export const GEN1_SIZE = 151;

// how many to show per page on the list screen
export const PAGE_SIZE = 30;

// max requests in flight at once when we hydrate the list
export const FETCH_CONCURRENCY = 12;
