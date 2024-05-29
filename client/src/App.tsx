import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.css";
import "mantine-datatable/styles.layer.css";

import { Router } from "./Router";

function App() {
  return (
    <MantineProvider>
      <Router />
    </MantineProvider>
  );
}

export default App;
