import { Outlet, Link } from "react-router-dom";
import DexLogo from "../components/DexLogo.jsx";
import { useDeviceTheme } from "../theme/deviceThemeContext.js";
import { useFavorites } from "../context/FavoritesContext.jsx";

// the device frame around the screen: logo + number up top, themed bezel,
// and the routed page inside
function Layout() {
  const { theme, label } = useDeviceTheme();
  const themed = theme["--type-soft"] !== "transparent";
  const { favorites } = useFavorites();
  const favCount = favorites.length;

  return (
    <div className="app">
      <div className="device" style={theme}>
        <header className="device-header">
          <Link to="/" className="pokedex-logo" aria-label="Pokédex home">
            <DexLogo />
          </Link>
          <div className="device-header-right">
            <Link
              to="/compare"
              className="header-icon-link"
              title="Compare two Pokémon"
              aria-label="Compare two Pokémon"
            >
              <span aria-hidden="true">⇄</span>
            </Link>
            <Link
              to="/favorites"
              className="header-icon-link"
              title={`Favorites (${favCount})`}
              aria-label={`Favorites, ${favCount} saved`}
            >
              <span aria-hidden="true">{favCount > 0 ? "★" : "☆"}</span>
              {favCount > 0 && <span className="fav-count-badge">{favCount}</span>}
            </Link>
            <span className="device-number" aria-label={label}>
              {label}
            </span>
          </div>
        </header>

        <div className={`device-screen${themed ? " themed" : ""}`}>
          <div className="screen-inner">
            <main>
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
