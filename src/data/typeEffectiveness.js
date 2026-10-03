import { API_BASE_URL } from "../config.js";
import { TYPE_ORDER } from "./types.js";

// cache the pokeapi type data so each type is only fetched once
const typeCache = new Map();

async function getType(typeName) {
  if (typeCache.has(typeName)) return typeCache.get(typeName);
  const url = `${API_BASE_URL}/type/${encodeURIComponent(typeName)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load the ${typeName} type data.`);
  }
  const data = await response.json();
  typeCache.set(typeName, data);
  return data;
}

// for every one of the 18 attacking types, work out the total damage
// multiplier against the pokemon's own type(s). each type contributes
// 2 / 0.5 / 0 / 1 depending on where the attacker sits, and we multiply
// across the pokemon's types to get the final number.
export async function fetchTypeEffectiveness(types) {
  const ownTypes = (types || []).filter(Boolean);
  if (ownTypes.length === 0) return [];

  const fetched = await Promise.all(ownTypes.map(getType));

  // combine the multipliers for each attacker vs the pokemon's own types
  return TYPE_ORDER.map((attacker) => {
    let multiplier = 1;
    for (const typeData of fetched) {
      const rel = typeData.damage_relations;
      const names = (list) => (list || []).map((x) => x.name);
      if (names(rel.double_damage_from).includes(attacker)) multiplier *= 2;
      else if (names(rel.half_damage_from).includes(attacker)) multiplier *= 0.5;
      else if (names(rel.no_damage_from).includes(attacker)) multiplier *= 0;
    }
    return { type: attacker, multiplier };
  });
}

// sort the flat list into weak / resistant / immune buckets for the UI
export function groupEffectiveness(eff) {
  const groups = { weak: [], resistant: [], immune: [] };
  for (const { type, multiplier } of eff || []) {
    if (multiplier === 0) groups.immune.push({ type, multiplier });
    else if (multiplier > 1) groups.weak.push({ type, multiplier });
    else if (multiplier < 1) groups.resistant.push({ type, multiplier });
  }
  groups.weak.sort((a, b) => b.multiplier - a.multiplier);
  groups.resistant.sort((a, b) => a.multiplier - b.multiplier);
  return groups;
}

export function formatMultiplier(value) {
  if (value === 0) return "0×";
  if (Number.isInteger(value)) return `${value}×`;
  return `${value}×`;
}
