import { Outlet } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import {
  useMantineTheme,
  AppShell,
  Burger,
  Group,
  Text,
  LoadingOverlay,
  Code,
  TextInput,
  ThemeIcon,
} from "@mantine/core";

import { AdminHeader } from "./AdminHeader";
import { Navbar } from "./Navbar";
import { Suspense } from "react";
import { IconSearch } from "@tabler/icons-react";

export function DashboardLayout() {
  const theme = useMantineTheme();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 240,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
      bg={theme.colors.red[8]}
      styles={{
        main: {
          background: theme.colors.gray[0],
        },

        navbar: {
          backgroundColor: theme.colors.dark[9],
        },
        section: {
          backgroundColor: theme.colors.dark[7],
          color: theme.colors.gray[5],
        },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <ThemeIcon color="gray" variant="light" hiddenFrom="sm">
              <Burger opened={mobileOpened} onClick={toggleMobile} size="sm" />
            </ThemeIcon>
            <ThemeIcon color="gray" variant="light" visibleFrom="sm">
              <Burger
                opened={desktopOpened}
                onClick={toggleDesktop}
                size="sm"
              />
            </ThemeIcon>

            {/* <MantineLogo size={30} />
             */}
            <Text fw={700}>WorkService</Text>
            <Code>1.0.0</Code>
          </Group>
          <TextInput
            visibleFrom="sm"
            rightSection={<IconSearch size="1rem" />}
            placeholder="ค้นหา..."
            color="gray"
          />
          <AdminHeader />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Suspense fallback={<LoadingOverlay visible={true} />}>
          <Outlet />
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
}
