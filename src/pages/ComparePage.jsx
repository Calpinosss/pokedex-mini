import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { usePokemonList } from "../hooks/usePokemonList.js";
import { useDeviceTheme, DEFAULT_DEVICE } from "../theme/deviceThemeContext.js";
import {
  capitalize,
  prettyNumber,
  baseStatTotal,
  getArtworkUrl,
  STAT_ORDER,
} from "../utils.js";
import { typeNames } from "../data/types.js";
import TypeBadge from "../components/TypeBadge.jsx";
import CompareRadar from "../components/CompareRadar.jsx";
import LoadingPokeball from "../components/LoadingPokeball.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";

/**
 * The compare screen: pick two Pokémon (slot A can be pre-filled from a
 * `?first=<name>` param set by the "Compare" button on a detail page) and
 * see them side by side with an overlaid radar and a stat-by-stat table
 * with deltas.
 */
export default function ComparePage() {
  const { setDeviceTheme } = useDeviceTheme();
  const [searchParams] = useSearchParams();
  const { pokemons, isLoading, isError } = usePokemonList();

  const firstParam = searchParams.get("first")?.toLowerCase().trim() ?? "";

  // Slot B is a plain user choice (no URL param). Slot A starts null so it
  // follows the ?first= pre-fill until the user explicitly picks one.
  const [manualFirst, setManualFirst] = useState(null);
  const [secondId, setSecondId] = useState("");

  useEffect(() => {
    setDeviceTheme(DEFAULT_DEVICE.theme, DEFAULT_DEVICE.label);
  }, [setDeviceTheme]);

  // Derive the pre-filled slot A during render (no effect) so the value is
  // available as soon as the roster loads, and the user can override it.
  const paramFirstId = firstParam ? findIdByName(pokemons, firstParam) : "";
  const firstId = manualFirst ?? paramFirstId;

  const pokemonA = pokemons.find((p) => p.id === Number(firstId));
  const pokemonB = pokemons.find((p) => p.id === Number(secondId));

  const optionsA = useMemo(
    () => pokemons.filter((p) => p.id !== Number(secondId)),
    [pokemons, secondId],
  );
  const optionsB = useMemo(
    () => pokemons.filter((p) => p.id !== Number(firstId)),
    [pokemons, firstId],
  );

  if (isError) {
    return <p className="status status-error">Couldn't load comparison: {isError}</p>;
  }

  if (isLoading) {
    return <LoadingPokeball label="Preparing comparison…" />;
  }

  const bothReady = Boolean(pokemonA && pokemonB);

  return (
    <div className="compare-page">
      <Link to="/" className="back-link">
        ← Back to list
      </Link>
      <h2 className="compare-heading">Compare</h2>

      <div className="compare-selectors">
        <label className="compare-label" htmlFor="compare-a">
          <span className="compare-slot-label">Slot A</span>
          <select
            id="compare-a"
            className="compare-select"
            value={firstId}
            onChange={(event) => setManualFirst(event.target.value)}
          >
            <option value="">Select Pokémon…</option>
            {optionsA.map((pokemon) => (
              <option key={pokemon.id} value={pokemon.id}>
                #{prettyNumber(pokemon.id)} · {capitalize(pokemon.name)}
              </option>
            ))}
          </select>
        </label>

        <span className="compare-vs" aria-hidden="true">
          VS
        </span>

        <label className="compare-label" htmlFor="compare-b">
          <span className="compare-slot-label">Slot B</span>
          <select
            id="compare-b"
            className="compare-select"
            value={secondId}
            onChange={(event) => setSecondId(event.target.value)}
          >
            <option value="">Select Pokémon…</option>
            {optionsB.map((pokemon) => (
              <option key={pokemon.id} value={pokemon.id}>
                #{prettyNumber(pokemon.id)} · {capitalize(pokemon.name)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {bothReady && (
        <div className="compare-body">
          <div className="compare-portraits">
            <div className="compare-portrait">
              <img
                src={getArtworkUrl(pokemonA.id)}
                alt={capitalize(pokemonA.name)}
                width={130}
                height={130}
              />
              <div className="compare-portrait-info">
                <span className="compare-portrait-name">{capitalize(pokemonA.name)}</span>
                <div className="type-badges">
                  {typeNames(pokemonA).map((type) => (
                    <TypeBadge key={type} type={type} />
                  ))}
                </div>
                <span className="compare-portrait-bst">BST {baseStatTotal(pokemonA)}</span>
                <FavoriteButton pokemonId={pokemonA.id} />
              </div>
            </div>

            <div className="compare-radar-wrap">
              <CompareRadar
                statsA={pokemonA.stats}
                statsB={pokemonB.stats}
                labelA={pokemonA.name}
                labelB={pokemonB.name}
              />
              <div className="compare-legend">
                <span className="legend-item">
                  <span className="legend-dot" style={{ background: "#4fe6d8" }} />
                  {capitalize(pokemonA.name)}
                </span>
                <span className="legend-item">
                  <span className="legend-dot" style={{ background: "#ff5fa8" }} />
                  {capitalize(pokemonB.name)}
                </span>
              </div>
            </div>

            <div className="compare-portrait">
              <img
                src={getArtworkUrl(pokemonB.id)}
                alt={capitalize(pokemonB.name)}
                width={130}
                height={130}
              />
              <div className="compare-portrait-info">
                <span className="compare-portrait-name">{capitalize(pokemonB.name)}</span>
                <div className="type-badges">
                  {typeNames(pokemonB).map((type) => (
                    <TypeBadge key={type} type={type} />
                  ))}
                </div>
                <span className="compare-portrait-bst">BST {baseStatTotal(pokemonB)}</span>
                <FavoriteButton pokemonId={pokemonB.id} />
              </div>
            </div>
          </div>

          <div className="compare-stats-table">
            <table>
              <thead>
                <tr>
                  <th>Stat</th>
                  <th>{capitalize(pokemonA.name)}</th>
                  <th>{capitalize(pokemonB.name)}</th>
                  <th>Delta</th>
                </tr>
              </thead>
              <tbody>
                {STAT_ORDER.map((statName) => {
                  const statA =
                    pokemonA.stats.find((s) => s.stat.name === statName)?.base_stat ?? 0;
                  const statB =
                    pokemonB.stats.find((s) => s.stat.name === statName)?.base_stat ?? 0;
                  const delta = statB - statA;
                  const rowClass =
                    delta > 0 ? "stat-row-b-wins" : delta < 0 ? "stat-row-a-wins" : "";
                  return (
                    <tr key={statName} className={rowClass}>
                      <td>{statName.replace("-", " ")}</td>
                      <td>{statA}</td>
                      <td>{statB}</td>
                      <td>
                        {delta > 0 ? `+${delta}` : delta < 0 ? String(delta) : "±0"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>{baseStatTotal(pokemonA)}</strong></td>
                  <td><strong>{baseStatTotal(pokemonB)}</strong></td>
                  <td>
                    <strong>
                      {(() => {
                        const totalDelta = baseStatTotal(pokemonB) - baseStatTotal(pokemonA);
                        return totalDelta > 0
                          ? `+${totalDelta}`
                          : totalDelta < 0
                            ? String(totalDelta)
                            : "±0";
                      })()}
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/** Find a roster Pokémon's id from its lowercase API name. */
function findIdByName(pokemons, name) {
  const found = pokemons.find((pokemon) => pokemon.name === name);
  return found ? String(found.id) : "";
}
