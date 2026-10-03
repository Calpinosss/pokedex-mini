import { createContext, useContext } from "react";

// the device goes back to its normal red skin when no pokemon theme is active
// (i.e. on the list page). --type-soft stays transparent so the screen just
// shows its plain digital grid.
export const DEFAULT_DEVICE = {
  theme: {
    "--type-accent": "var(--pokedex-red)",
    "--type-soft": "transparent",
    "--type-secondary": "var(--pokedex-red)",
  },
  label: "GEN 1 · 151",
};

export const DeviceThemeContext = createContext(DEFAULT_DEVICE);

/**
 * Read the current device appearance (theme variables + header label) and the
 * setter used to re-theme the bezel for a detail screen.
 */
export function useDeviceTheme() {
  return useContext(DeviceThemeContext);
}
