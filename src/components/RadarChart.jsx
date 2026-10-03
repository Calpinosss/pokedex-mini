import { STAT_ORDER, STAT_MAX } from "../utils.js";

const LABELS = {
  "hp": "HP",
  "attack": "ATK",
  "defense": "DEF",
  "special-attack": "SP.A",
  "special-defense": "SP.D",
  "speed": "SPD",
};

const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = CENTER - 34; // leave room for labels

// Six axes evenly spaced around the radar, starting at the top and going
// clockwise, matching STAT_ORDER.
function pointAt(index, value, scaleMax) {
  const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
  const r = (value / scaleMax) * RADIUS;
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)];
}

function polygonPoints(values, scaleMax) {
  return values
    .map((value, index) => pointAt(index, value, scaleMax).join(","))
    .join(" ");
}

/**
 * A dependency-free SVG radar chart for the six base stats. Values are
 * normalised against `scaleMax` (the highest reachable base stat) so the
 * shape is comparable across pokemon, and the scale is passed through so
 * the caller can show it to the user.
 *
 * @param {{ stats: Array<{ stat: { name: string }, base_stat: number }>,
 *            color?: string }} props
 */
function RadarChart({ stats, color = "var(--type-accent, #e33a3a)" }) {
  const values = STAT_ORDER.map((name) =>
    stats.find((s) => s.stat.name === name)?.base_stat ?? 0,
  );

  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg
      className="radar"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={`Radar chart. ${STAT_ORDER.map(
        (name, i) => `${LABELS[name]} ${values[i]}`,
      ).join(", ")}. Scale 0 to ${STAT_MAX}.`}
    >
      {/* Grid rings */}
      {rings.map((fraction) => (
        <polygon
          key={fraction}
          points={polygonPoints(
            STAT_ORDER.map(() => fraction * STAT_MAX),
            STAT_MAX,
          )}
          fill="none"
          stroke="rgba(155, 160, 195, 0.35)"
          strokeWidth={fraction === 1 ? 1.5 : 1}
        />
      ))}

      {/* Axis lines + labels */}
      {STAT_ORDER.map((name, index) => {
        const [x, y] = pointAt(index, STAT_MAX, STAT_MAX);
        // Labels sit just outside the value dots so they never collide with
        // the polygon; a subtle halo keeps them readable over the chart fill.
        const [lx, ly] = pointAt(index, STAT_MAX * 1.3, STAT_MAX * 1.3);
        return (
          <g key={name}>
            <line
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke="rgba(155, 160, 195, 0.3)"
              strokeWidth={1}
            />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fontWeight={700}
              fill="#cdd2f5"
              stroke="rgba(6, 8, 22, 0.85)"
              strokeWidth={3}
              paintOrder="stroke"
            >
              {LABELS[name]}
            </text>
          </g>
        );
      })}

      {/* Value polygon */}
      <polygon
        points={polygonPoints(values, STAT_MAX)}
        fill={color}
        fillOpacity={0.25}
        stroke={color}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />

      {/* Value dots */}
      {STAT_ORDER.map((name, index) => {
        const [x, y] = pointAt(index, values[index], STAT_MAX);
        return <circle key={name} cx={x} cy={y} r={3.5} fill={color} />;
      })}
    </svg>
  );
}

export default RadarChart;
