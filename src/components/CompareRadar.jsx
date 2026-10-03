import { STAT_ORDER, STAT_MAX } from "../utils.js";

const LABELS = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP.A",
  "special-defense": "SP.D",
  speed: "SPD",
};

const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = CENTER - 34; // leave room for labels

// Same axis layout as RadarChart: six axes, top first, clockwise.
function pointAt(index, value, scaleMax) {
  const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
  const r = (value / scaleMax) * RADIUS;
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)];
}

function polygonPoints(values, scaleMax) {
  return values.map((value, index) => pointAt(index, value, scaleMax).join(",")).join(" ");
}

function statValues(stats) {
  return STAT_ORDER.map((name) => stats.find((s) => s.stat.name === name)?.base_stat ?? 0);
}

// tiny svg radar that overlays two pokemon stats; a = cyan, b = pink
export default function CompareRadar({ statsA, statsB, labelA, labelB }) {
  const valuesA = statValues(statsA);
  const valuesB = statValues(statsB);
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg
      className="compare-radar"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={`Radar chart comparing ${labelA} (cyan) and ${labelB} (pink)`}
    >
      {rings.map((fraction) => (
        <polygon
          key={fraction}
          points={polygonPoints(STAT_ORDER.map(() => fraction * STAT_MAX), STAT_MAX)}
          fill="none"
          stroke="rgba(155, 160, 195, 0.3)"
          strokeWidth={fraction === 1 ? 1.5 : 1}
        />
      ))}

      {STAT_ORDER.map((name, index) => {
        const [x, y] = pointAt(index, STAT_MAX, STAT_MAX);
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

      {/* Pokémon A polygon – neon cyan */}
      <polygon
        points={polygonPoints(valuesA, STAT_MAX)}
        fill="rgba(79, 230, 216, 0.18)"
        stroke="#4fe6d8"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      {STAT_ORDER.map((name, index) => {
        const [x, y] = pointAt(index, valuesA[index], STAT_MAX);
        return <circle key={`a-${name}`} cx={x} cy={y} r={3.5} fill="#4fe6d8" />;
      })}

      {/* Pokémon B polygon – neon pink */}
      <polygon
        points={polygonPoints(valuesB, STAT_MAX)}
        fill="rgba(255, 95, 168, 0.18)"
        stroke="#ff5fa8"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      {STAT_ORDER.map((name, index) => {
        const [x, y] = pointAt(index, valuesB[index], STAT_MAX);
        return <circle key={`b-${name}`} cx={x} cy={y} r={3.5} fill="#ff5fa8" />;
      })}
    </svg>
  );
}
