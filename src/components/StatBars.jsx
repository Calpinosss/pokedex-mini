import { useEffect, useState } from "react";
import { STAT_ORDER, STAT_MAX } from "../utils.js";

const LABELS = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP.A",
  "special-defense": "SP.D",
  speed: "SPD",
};

// stat bars that animate from 0 to their value on mount (CSS handles the transition)
function StatBars({ stats }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Wait a frame so the browser paints the 0-width state first, then
    // flip to the real widths to trigger the fill.
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const widthFor = (value, enabled) =>
    enabled ? `${Math.min(100, (value / STAT_MAX) * 100)}%` : "0%";

  return (
    <div className="stat-bars">
      {STAT_ORDER.map((name) => {
        const stat = stats.find((s) => s.stat.name === name);
        const value = stat?.base_stat ?? 0;
        return (
          <div className="stat-row" key={name}>
            <span className="stat-abbrev">{LABELS[name]}</span>
            <div
              className="stat-track"
              role="progressbar"
              aria-valuenow={value}
              aria-valuemin={0}
              aria-valuemax={STAT_MAX}
              aria-label={`${LABELS[name]}: ${value} of ${STAT_MAX}`}
            >
              <div
                className="stat-fill"
                style={{ width: widthFor(value, animate) }}
              />
            </div>
            <span className="stat-num">{value}</span>
          </div>
        );
      })}
    </div>
  );
}

export default StatBars;
