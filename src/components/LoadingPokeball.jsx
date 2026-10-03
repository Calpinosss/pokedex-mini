/**
 * A spinning Pokéball used as the app's loading indicator, with an optional
 * label. Respects prefers-reduced-motion via CSS.
 */
function LoadingPokeball({ label = "Loading…" }) {
  return (
    <div className="status" role="status" aria-live="polite">
      <div className="loading-pokeball" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingPokeball;
