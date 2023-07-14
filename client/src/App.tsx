import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useLocalStorage } from "@mantine/hooks";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  useMantineTheme,
} from "@mantine/core";

import DashboardLayout from "./components/DashboardLayout";

const Dashboard = lazy(() => import("./pages/dashboard"));
const Information = lazy(() => import("./pages/information"));
const TypeManage = lazy(() => import("./pages/typeManage"));
const TypeMoney = lazy(() => import("./pages/typeMoney"));

const Pagenotfound = lazy(() => import("./pages/pageNotFound/pageNotFound"));

function App() {
  const theme = useMantineTheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "ws-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const ColorText =
    colorScheme === "dark" ? theme.colors.gray[5] : theme.colors.dark[3];
  const fontWeight = 600;

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme: colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <BrowserRouter>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/information" element={<Information />} />
              <Route path="/typemanages" element={<TypeManage />} />
              <Route path="/typeMoneys" element={<TypeMoney />} />

              <Route path="*" element={<Pagenotfound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
