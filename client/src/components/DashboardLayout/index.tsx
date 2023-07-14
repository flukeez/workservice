import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";

import { AppShell, createStyles, useMantineTheme } from "@mantine/core";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { HEADER_HEIGHT, NAVBAR_BREAKPOINT, NAVBAR_WIDTH } from "./config";

import AppNavbar from "./AppNavbar";
import AppHeader from "./AppHeader";
// import AppFooter from './AppFooter';
import EmptyLoading from "../EmptyLoading";

const useStyles = createStyles((theme) => {
  return {
    main: {
      position: "relative",
      marginTop: HEADER_HEIGHT,

      [`@media (min-width: ${theme.breakpoints[NAVBAR_BREAKPOINT]})`]: {
        marginLeft: NAVBAR_WIDTH,
      },
    },
  };
});

export default function DashboardLayout() {
  const theme = useMantineTheme();
  const [navbarVisible, setNavbarVisible] = useState(false);
  const { classes } = useStyles();

  return (
    <>
      <AppShell
        styles={{
          main: {
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        }}
        header={
          <AppHeader
            navbarVisible={navbarVisible}
            onShowNavbarClick={() => setNavbarVisible(true)}
          />
        }
        navbar={
          <AppNavbar
            visible={navbarVisible}
            onHideClick={() => setNavbarVisible(false)}
          />
        }
      >
        <div className={classes.main}>
          <Suspense fallback={<EmptyLoading />}>
            <Outlet />
          </Suspense>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            theme="colored"
          />
        </div>
      </AppShell>
    </>
  );
}
