import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDeviceTheme, DEFAULT_DEVICE } from "../theme/deviceThemeContext.js";

// the 404 screen. resets the device back to its normal red skin
// so a broken link doesn't leave it stuck in some pokemon's theme
function NotFoundPage() {
  const { setDeviceTheme } = useDeviceTheme();

  useEffect(() => {
    setDeviceTheme(DEFAULT_DEVICE.theme, DEFAULT_DEVICE.label);
  }, [setDeviceTheme]);

  return (
    <div className="notfound">
      <div className="ghost" aria-hidden="true">
        👻
      </div>
      <p>
        This corner of the Pokédex is empty. Even Ghost types can't find
        anything here.
      </p>
      <Link to="/" className="back-link">
        ← Back to the list
      </Link>
    </div>
  );
}

export default NotFoundPage;
