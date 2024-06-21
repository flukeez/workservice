import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.css";
import "mantine-datatable/styles.layer.css";
import "@fontsource/noto-sans-thai";

import { Router } from "./Router";

function App() {
  return (
    <MantineProvider
      theme={{
        fontFamily: "Noto Sans Thai, sans-serif",
        headings: { fontFamily: "Noto Sans Thai, sans-serif" },
      }}
    >
      <Router />
    </MantineProvider>
  );
}

export default App;
