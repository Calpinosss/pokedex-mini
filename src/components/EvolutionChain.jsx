import { Link, useLocation } from "react-router-dom";
import { getSpriteUrl, getIdFromUrl, capitalize, prettyNumber } from "../utils.js";

// turn the raw evolution_details into a short label like "Lv. 16 · via Thunder Stone"
// gen 1 mostly just uses levels, but the extras keep it working for later gens
function describeCondition(details) {
  if (!details || details.length === 0) return null;

  const parts = [];
  for (const detail of details) {
    if (detail.item?.name) {
      parts.push(`via ${capitalize(detail.item.name)}`);
    }
    if (detail.held_item?.name) {
      parts.push(`holding ${capitalize(detail.held_item.name)}`);
    }
    if (detail.min_level) {
      parts.push(`Lv. ${detail.min_level}`);
    }
    if (detail.location?.name) {
      parts.push(`in ${capitalize(detail.location.name)}`);
    }
  }
  return parts.length ? parts.join(" · ") : null;
}

// one evolution stage: clicking the one that's already open just scrolls to
// the top so you don't get stuck mid-page
function EvoNode({ node, id }) {
  const name = node.species.name;
  const location = useLocation();

  function handleClick(event) {
    if (location.pathname === `/pokemon/${name}`) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <Link
      to={`/pokemon/${name}`}
      className="evo-node"
      aria-label={`View ${name}`}
      onClick={handleClick}
    >
      <img
        src={getSpriteUrl(id)}
        alt={capitalize(name)}
        width={48}
        height={48}
        loading="lazy"
      />
      <span className="evo-num">#{prettyNumber(id)}</span>
      <span className="evo-name">{name}</span>
    </Link>
  );
}

// draw one branch of the chain. `incoming` is the condition that leads into
// this node; if it has several children they stack in a vertical group
function EvoBranch({ node, incoming }) {
  const id = getIdFromUrl(node.species.url);
  const children = node.evolves_to || [];

  return (
    <div className="evo-branch">
      {incoming && (
        <>
          <span className="evo-arrow" aria-hidden="true">→</span>
          <span className="evo-condition">{incoming}</span>
        </>
      )}
      <EvoNode node={node} id={id} />
      {children.length > 0 && (
        <div className="evo-children">
          {children.map((child, index) => {
            const condition = describeCondition(child.evolution_details);
            return (
              <EvoBranch
                key={`${child.species.name}-${index}`}
                node={child}
                incoming={condition}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// the whole evolution chain for a pokemon; each stage links to its detail page
function EvolutionChain({ chain }) {
  if (!chain) return null;

  return (
    <div className="evo">
      <EvoBranch node={chain} incoming={null} />
    </div>
  );
}

export default EvolutionChain;
