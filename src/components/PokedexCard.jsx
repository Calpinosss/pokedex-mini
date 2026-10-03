import { Link } from "react-router-dom";
import {
  getSpriteUrl,
  getArtworkUrl,
  capitalize,
  prettyNumber,
  baseStatTotal,
} from "../utils.js";
import { typeNames, typeColor } from "../data/types.js";
import TypeBadge from "./TypeBadge.jsx";
import FavoriteButton from "./FavoriteButton.jsx";

// a single card in the grid: the sprite crossfades to the official art on
// hover, and the border picks up the pokemon's main type color via a CSS var
function PokedexCard({ pokemon }) {
  const id = pokemon.id;
  const types = typeNames(pokemon);
  const accent = typeColor(types[0]);

  return (
    <Link
      to={`/pokemon/${pokemon.name}`}
      className="card"
      style={{ "--card-accent": accent }}
      aria-label={`View ${capitalize(pokemon.name)}`}
    >
      <FavoriteButton pokemonId={id} />
      <div className="card-art">
        <img
          className="art-sprite"
          src={getSpriteUrl(id)}
          alt=""
          width={64}
          height={64}
          loading="lazy"
        />
        <img
          className="art-official"
          src={getArtworkUrl(id)}
          alt={capitalize(pokemon.name)}
          width={96}
          height={96}
          loading="lazy"
        />
      </div>
      <span className="card-id">#{prettyNumber(id)}</span>
      <span className="card-name">{pokemon.name}</span>
      <span className="card-types">
        {types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </span>
      <span className="card-bst">{baseStatTotal(pokemon)}</span>
    </Link>
  );
}

export default PokedexCard;
