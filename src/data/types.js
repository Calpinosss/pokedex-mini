// colors for each pokemon type. `on` is the text color to sit on top of the accent

export const TYPE_ORDER = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export const TYPE_META = {
  normal:   { label: "Normal",   accent: "#A8A77A", soft: "#E4E3D5", on: "#1f1f1a" },
  fire:     { label: "Fire",     accent: "#EE8130", soft: "#FFE3D0", on: "#ffffff" },
  water:    { label: "Water",    accent: "#6397F1", soft: "#D6E7FB", on: "#ffffff" },
  electric: { label: "Electric", accent: "#F7D02C", soft: "#FBF3CF", on: "#5a4a00" },
  grass:    { label: "Grass",    accent: "#7AC74C", soft: "#DFF3D4", on: "#1d4a10" },
  ice:      { label: "Ice",      accent: "#9ED6FF", soft: "#E4F3FF", on: "#1f4d8f" },
  fighting: { label: "Fighting", accent: "#C03028", soft: "#F2CFCB", on: "#ffffff" },
  poison:   { label: "Poison",   accent: "#A33EA1", soft: "#EBD3EF", on: "#ffffff" },
  ground:   { label: "Ground",   accent: "#CB856B", soft: "#F0DDD3", on: "#ffffff" },
  flying:   { label: "Flying",   accent: "#A98FF3", soft: "#E6DFFB", on: "#ffffff" },
  psychic:  { label: "Psychic",  accent: "#F95F72", soft: "#FBD3D9", on: "#5c0f1a" },
  bug:      { label: "Bug",      accent: "#A6AC3D", soft: "#E6E8C9", on: "#2c2e0d" },
  rock:     { label: "Rock",     accent: "#B6A136", soft: "#EFE8CC", on: "#3f370f" },
  ghost:    { label: "Ghost",    accent: "#735797", soft: "#DAD1E7", on: "#ffffff" },
  dragon:   { label: "Dragon",   accent: "#6F35FC", soft: "#DCD0FB", on: "#ffffff" },
  dark:     { label: "Dark",     accent: "#5A5366", soft: "#D8D4DE", on: "#ffffff" },
  steel:    { label: "Steel",    accent: "#B7B7CE", soft: "#E8E8F0", on: "#333344" },
  fairy:    { label: "Fairy",    accent: "#D683A6", soft: "#F4DCE8", on: "#ffffff" },
};

export function typeLabel(name) {
  return TYPE_META[name]?.label ?? name;
}

export function typeColor(name) {
  return TYPE_META[name]?.accent ?? "#8a8a8a";
}

// build the CSS vars the detail screen needs from a pokemon's types
// (first type = main accent, second = a subtle extra tint)
export function themeForTypes(types) {
  const list = (types || []).filter(Boolean);
  const primary = TYPE_META[list[0]] ?? TYPE_META.normal;
  const secondary = list[1] ? TYPE_META[list[1]]?.accent ?? primary.accent : null;

  return {
    "--type-accent": primary.accent,
    "--type-soft": primary.soft,
    "--type-secondary": secondary,
  };
}

// flatten the raw types array into just the type names
export function typeNames(pokemon) {
  return (pokemon?.types || []).map((t) => t.type?.name).filter(Boolean);
}
