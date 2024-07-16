import { Outlet } from "react-router-dom";

import {
  useMantineTheme,
  AppShell,
  Group,
  Text,
  LoadingOverlay,
  Code,
  Container,
} from "@mantine/core";

import { AdminHeader } from "./AdminHeader";

import { Suspense } from "react";
import { WEBSITE_NAME } from "@/config";

export function HomePageLayout() {
  const theme = useMantineTheme();

  return (
    <AppShell
      header={{ height: 60 }}
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
        <Container size="xl">
          <Group h="100%" px="md" justify="space-between">
            <Group>
              <Text fw={700}>{WEBSITE_NAME}</Text>
              <Code>2.0.0</Code>
            </Group>

            <AdminHeader />
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Suspense fallback={<LoadingOverlay visible={true} />}>
          <Outlet />
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
}
