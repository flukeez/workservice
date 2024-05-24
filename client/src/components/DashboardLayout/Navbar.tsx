import { AppShell, ScrollArea } from "@mantine/core";
import MenuItem from "./MenuItem";
import { SIDENAV_ITEMS } from "./side-menu";

export function Navbar() {
  return (
    <>
      <AppShell.Section component={ScrollArea}>
        {SIDENAV_ITEMS.map((item, idx) => {
          return <MenuItem key={idx} {...item} />;
        })}
      </AppShell.Section>
    </>
  );
}
