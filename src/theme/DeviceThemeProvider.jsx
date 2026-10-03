import { useCallback, useMemo, useState } from "react";
import { DeviceThemeContext, DEFAULT_DEVICE } from "./deviceThemeContext.js";

// holds the device skin (theme vars + the header label) and gives the tree a
// stable setter. the setter + memoized value staying the same identity on
// every render is what keeps route transitions from re-firing effects and
// looping; the bailout also means no-op calls never cause a re-render
export default function DeviceThemeProvider({ children }) {
  const [device, setDevice] = useState(DEFAULT_DEVICE);

  const setDeviceTheme = useCallback((theme, label) => {
    setDevice((prev) =>
      prev.theme === theme && prev.label === label ? prev : { theme, label },
    );
  }, []);

  const value = useMemo(
    () => ({ ...device, setDeviceTheme }),
    [device, setDeviceTheme],
  );

  return (
    <DeviceThemeContext.Provider value={value}>
      {children}
    </DeviceThemeContext.Provider>
  );
}
