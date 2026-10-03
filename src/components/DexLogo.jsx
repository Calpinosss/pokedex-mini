import logoSrc from "../assets/pokedex-logo.png";

/**
 * The Pokédex device + wordmark lockup used in the navigation bar.
 *
 * This is the ORIGINAL pixel-art logo supplied by the project owner: a red
 * handheld device joined to the "Pokédex" wordmark whose "o" is a Poké Ball,
 * with neon cyan/pink energy accents on a transparent background.
 *
 * Per the design brief it is used AS-IS — never redrawn, recoloured,
 * re-set, or split into separate icon + text pieces. Sizing is controlled
 * by the `.dex-logo` CSS rule in index.css.
 *
 * The `<img>` keeps the asset's native 2:1 aspect ratio; no distortion is
 * applied. All ids and comments in this file stay in English.
 */
export default function DexLogo() {
  return (
    <img
      className="dex-logo"
      src={logoSrc}
      alt="Pokédex"
      role="img"
      draggable={false}
    />
  );
}
