import { TYPE_META, typeLabel } from "../data/types.js";

// small pill showing a pokemon's type, colored from the type palette
function TypeBadge({ type, showMultiplier }) {
  const meta = TYPE_META[type];
  const style = {
    background: meta?.accent ?? "#8a8a8a",
    color: meta?.on ?? "#ffffff",
  };

  return (
    <span className="type-badge" style={style} title={typeLabel(type)}>
      {typeLabel(type)}
      {showMultiplier != null && <span className="multiplier">{showMultiplier}×</span>}
    </span>
  );
}

export default TypeBadge;
