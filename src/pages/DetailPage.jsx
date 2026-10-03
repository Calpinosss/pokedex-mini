import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { usePokemonDetail } from "../hooks/usePokemonDetail.js";
import {
  capitalize,
  prettyNumber,
  getArtworkUrl,
  getShinyArtworkUrl,
  baseStatTotal,
  statCategory,
  STAT_MAX,
  formatHeightMeters,
  formatKilos,
} from "../utils.js";
import { typeNames, typeColor, themeForTypes } from "../data/types.js";
import TypeBadge from "../components/TypeBadge.jsx";
import RadarChart from "../components/RadarChart.jsx";
import StatBars from "../components/StatBars.jsx";
import EvolutionChain from "../components/EvolutionChain.jsx";
import EffectivenessPanel from "../components/EffectivenessPanel.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";
import LoadingPokeball from "../components/LoadingPokeball.jsx";
import { useDeviceTheme } from "../theme/deviceThemeContext.js";

// pokeapi gender_rate: null = no data, -1 = 50/50, otherwise 50-159 in 8s
function genderLabel(rate) {
  if (rate === null || rate === undefined) return "Unknown";
  if (rate === -1) return "50% M / 50% F";
  const female = Math.round((rate / 16) * 100);
  return `${100 - female}% M / ${female}% F`;
}

// the detail screen: portrait, stats, evolution + type effectiveness, all
// re-skins the device to match the pokemon's type
function DetailPage() {
  const { name } = useParams();
  const { pokemon, species, chain, isLoading, error } = usePokemonDetail(name);
  const { setDeviceTheme } = useDeviceTheme();

  const [shiny, setShiny] = useState(false);
  const [playCry, setPlayCry] = useState(false);
  const audioRef = useRef(null);

  const types = useMemo(() => typeNames(pokemon), [pokemon]);
  const theme = useMemo(() => themeForTypes(types), [types]);

  // re-skin the device for this pokemon (and back to neutral on the list)
  useEffect(() => {
    if (pokemon) {
      setDeviceTheme(theme, `No. ${prettyNumber(pokemon.id)}`);
    }
  }, [pokemon, theme, setDeviceTheme]);

  if (isLoading) {
    return <LoadingPokeball label={`Scanning ${name}…`} />;
  }

  if (error) {
    return (
      <p className="status status-error">
        No Pokémon named “{name}” found — check the spelling, or{" "}
        <Link to="/" className="back-link">
          browse the list
        </Link>
        .
      </p>
    );
  }

  const bst = baseStatTotal(pokemon);
  const flavor =
    species?.flavor_text_entries?.find((entry) => entry.language?.name === "en") ??
    null;

  function toggleCry() {
    setPlayCry(true);
    // rewind to the start so replaying the cry works
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setPlayCry(false));
    }
  }

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">
        ← Back to list
      </Link>

      <div className="detail-top">
        <div className="detail-identity">
          <span className="detail-number">No. {prettyNumber(pokemon.id)}</span>
          <h2 className="detail-name">{pokemon.name}</h2>
          <div className="type-badges">
            {types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>
        </div>

        <div className="detail-portrait">
          <img
            src={shiny ? getShinyArtworkUrl(pokemon.id) : getArtworkUrl(pokemon.id)}
            alt={`${capitalize(pokemon.name)}${shiny ? " (shiny)" : ""}`}
            width={170}
            height={170}
          />
        </div>
      </div>

      <div className="detail-actions">
        <button type="button" className="pager" onClick={() => setShiny((v) => !v)}>
          {shiny ? "Normal" : "Shiny"}
        </button>
        <button type="button" className="pager" onClick={toggleCry}>
          {playCry ? "Playing cry…" : "Play cry"}
        </button>
        <FavoriteButton pokemonId={pokemon.id} />
        <Link to={`/compare?first=${pokemon.name}`} className="pager">
          ⇄ Compare
        </Link>
        <audio
          ref={audioRef}
          src={pokemon.cries?.latest}
          preload="none"
          onEnded={() => setPlayCry(false)}
        />
      </div>

      <section className="panel" aria-labelledby="stats-title">
        <h3 className="panel-title" id="stats-title">
          Stats
        </h3>
        <div className="stats-grid">
          <RadarChart stats={pokemon.stats} color={typeColor(types[0])} />
          <StatBars stats={pokemon.stats} />
        </div>
        <div className="bst-row">
          <span className="bst-value">{bst}</span>
          <span className="bst-caption">
            <strong>Base stat total</strong> · {statCategory(bst)} ·
            bars scaled to {STAT_MAX} (highest in Gen I)
          </span>
        </div>
      </section>

      <section className="panel" aria-labelledby="info-title">
        <h3 className="panel-title" id="info-title">
          Profile
        </h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-key">Height</span>
            <span className="info-val">{formatHeightMeters(pokemon.height)}</span>
          </div>
          <div className="info-item">
            <span className="info-key">Weight</span>
            <span className="info-val">{formatKilos(pokemon.weight)}</span>
          </div>
          <div className="info-item">
            <span className="info-key">Catch rate</span>
            <span className="info-val">
              {species ? `${species.capture_rate} / 255` : "—"}
            </span>
          </div>
          <div className="info-item">
            <span className="info-key">Gender</span>
            <span className="info-val">
              {species ? genderLabel(species.gender_rate) : "—"}
            </span>
          </div>
        </div>
        {flavor?.flavor_text && (
          <p className="flavor">
            {flavor.flavor_text.replace(/\s+/g, " ").replace(/\f/g, "")}
            <span className="flavor-source">
              — {capitalize(flavor.version?.name ?? "unknown game")}
            </span>
          </p>
        )}
      </section>

      <section className="panel" aria-labelledby="evo-title">
        <h3 className="panel-title" id="evo-title">
          Evolution
        </h3>
        {chain ? (
          <EvolutionChain chain={chain.chain ?? chain} />
        ) : (
          <p className="status">No evolution data available.</p>
        )}
      </section>

      <section className="panel" aria-labelledby="eff-title">
        <h3 className="panel-title" id="eff-title">
          Type effectiveness
        </h3>
        <EffectivenessPanel types={types} />
      </section>
    </div>
  );
}

export default DetailPage;
