import { SPRITE_BASE_URL } from "./config.js";

// pull the id out of a pokeapi url like .../pokemon/25/
export function getIdFromUrl(url) {
  // the id is the last bit of the url
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

export function capitalize(name) {
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : name;
}

// pokeapi wants lowercase keys, so just lowercase + trim whatever we pass in
export function normalizeKey(key) {
  return String(key).toLowerCase().trim();
}

export function getSpriteUrl(id) {
  return `${SPRITE_BASE_URL}/${id}.png`;
}

export function getArtworkUrl(id) {
  return `${SPRITE_BASE_URL}/other/official-artwork/${id}.png`;
}

export function getShinyArtworkUrl(id) {
  return `${SPRITE_BASE_URL}/other/official-artwork/shiny/${id}.png`;
}

// add up the 6 base stats
export function baseStatTotal(pokemon) {
  return (pokemon?.stats || []).reduce((sum, s) => sum + s.base_stat, 0);
}

// pokeapi gives height in decimetres and weight in decigrams
export function formatHeightMeters(decimetres) {
  return `${(Number(decimetres) / 10).toFixed(1)} m`;
}

export function formatKilos(decigrams) {
  return `${(Number(decigrams) / 10).toFixed(1)} kg`;
}

// same stat order for the radar + bars so they always line up
export const STAT_ORDER = [
  "hp",
  "attack",
  "defense",
  "special-attack",
  "special-defense",
  "speed",
];

// The highest base stat reachable in Gen I (Snorlax HP) - the scale shown to
// the user for bars and the radar chart.
export const STAT_MAX = 160;

// Classify a total base stat value into an easy-to-read bucket. Presentational
// only, derived from the real total, never a made-up percentile.
export function statCategory(total) {
  if (total >= 480) return "Outstanding";
  if (total >= 420) return "Strong";
  if (total >= 350) return "Balanced";
  if (total >= 250) return "Average";
  return "Frail";
}

export function prettyNumber(num, pad = 3) {
  return String(num).padStart(pad, "0");
}
