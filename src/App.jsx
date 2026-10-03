import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import DeviceThemeProvider from "./theme/DeviceThemeProvider.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import ListPage from "./pages/ListPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import ComparePage from "./pages/ComparePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <DeviceThemeProvider>
        <FavoritesProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<ListPage />} />
              <Route path="/pokemon/:name" element={<DetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </FavoritesProvider>
      </DeviceThemeProvider>
    </HashRouter>
  );
}

export default App;
