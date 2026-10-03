import { useEffect, useState } from "react";
import {
  fetchTypeEffectiveness,
  groupEffectiveness,
} from "../data/typeEffectiveness.js";
import TypeBadge from "./TypeBadge.jsx";

// show what a pokemon is weak/resistant/immune to. the inner content
// remounts (via key) whenever the types change so the effect only runs once
function EffectivenessPanel({ types }) {
  const typesKey = (types || []).join(",");

  if (!typesKey) {
    return <p className="status">No type data available.</p>;
  }

  return <EffectivenessContent key={typesKey} types={types} />;
}

// fetch + render one fixed set of types. remounted on every type change, so
// the effect runs once and the dep list stays trivial
function EffectivenessContent({ types }) {
  const [groups, setGroups] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    fetchTypeEffectiveness(types)
      .then((eff) => {
        if (active) setGroups(groupEffectiveness(eff));
      })
      .catch((err) => {
        if (active) setError(err.message);
      });

    return () => {
      active = false;
    };
    // types won't change for this keyed instance, so we don't need it in the deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <p className="status status-error">Couldn't load type effectiveness.</p>
    );
  }

  if (!groups) {
    return <p className="status">Loading type effectiveness…</p>;
  }

  const sections = [
    { key: "weak", title: "Weak against", items: groups.weak },
    { key: "resistant", title: "Resistant to", items: groups.resistant },
    { key: "immune", title: "Immune to", items: groups.immune },
  ];

  return (
    <div className="eff-groups">
      {sections.map(({ key, title, items }) => (
        <div
          className={`eff-group${items.length === 0 ? " none" : ""}`}
          key={key}
        >
          <span className="eff-label">{title}</span>
          {items.length === 0 ? (
            <span className="info-val">—</span>
          ) : (
            items.map(({ type, multiplier }) => (
              <TypeBadge
                key={`${key}-${type}`}
                type={type}
                showMultiplier={
                  key === "resistant" || key === "immune"
                    ? multiplier
                    : undefined
                }
              />
            ))
          )}
        </div>
      ))}
    </div>
  );
}

export default EffectivenessPanel;
