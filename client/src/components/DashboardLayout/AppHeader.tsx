import { ActionIcon, Burger, createStyles, Group, px, useMantineColorScheme } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { HEADER_HEIGHT, NAVBAR_BREAKPOINT, NAVBAR_WIDTH } from './config';
import Logo from './Logo';

const useStyles = createStyles((theme) => {
  const breakpointMediaQuery = `@media (min-width: ${theme.breakpoints[NAVBAR_BREAKPOINT]})`;
  const actionIconColor = theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6];
  const shadowGradientAlpha = theme.colorScheme === 'dark' ? 0.3 : 0.03;

  return {
    root: {
      position: 'fixed',
      zIndex: 10,
      top: 0,
      left: 0,
      right: 0,
      height: HEADER_HEIGHT,
      background: theme.fn.gradient({
        deg: 180,
        ...(theme.colorScheme === 'dark'
          ? {
            from: theme.fn.rgba(theme.colors.dark[7], 0.95),
            to: theme.fn.rgba(theme.colors.dark[7], 0.75),
          }
          : {
            from: theme.fn.rgba(theme.white, 0.95),
            to: theme.fn.rgba(theme.white, 0.75),
          }),
      }),
      backdropFilter: 'blur(2px)',
      borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
      justifyContent: 'space-between',
      [breakpointMediaQuery]: {
        marginLeft: NAVBAR_WIDTH,
      },
      '&::after': {
        position: 'absolute',
        content: '""',
        left: 0,
        right: 0,
        height: theme.spacing.sm,
        bottom: -px(theme.spacing.sm) - 1,
        background: `linear-gradient(${theme.fn.rgba(theme.black, shadowGradientAlpha)}, ${theme.fn.rgba(
          theme.black,
          0
        )}), linear-gradient(${theme.fn.rgba(theme.black, shadowGradientAlpha)}, ${theme.fn.rgba(theme.black, 0)} 30%)`,
        opacity: 0,
        transition: 'opacity .15s ease',
      },
    },
    windowScrolledOnY: {
      '&::after': {
        opacity: 1,
      },
    },
    menuIcon: {
      color: actionIconColor,
      [breakpointMediaQuery]: {
        display: 'none',
      },
    },
    logo: {
      opacity: 1,
      transition: 'opacity .15s ease',
      [breakpointMediaQuery]: {
        display: 'none',
      },
    },
    logoWithNavbarVisible: {
      opacity: 0,
    },
  };
});

export default function AppHeader({
  navbarVisible,
  onShowNavbarClick,
}: {
  navbarVisible: boolean;
  onShowNavbarClick: () => void;
}) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  // const ColorSchemeIcon = colorScheme === 'dark' ? IconSun : IconMoon;
  const [{ y: windowScrollY }] = useWindowScroll();

  const { classes, cx } = useStyles();
  const dark = colorScheme === "dark";
  return (
    <Group className={cx(classes.root, { [classes.windowScrolledOnY]: windowScrollY !== 0 })} px="sm" spacing="xs">
      <Group spacing="xs">
        <Burger opened={navbarVisible} onClick={onShowNavbarClick} color='gray' className={classes.menuIcon} />
        <Logo className={cx(classes.logo, { [classes.logoWithNavbarVisible]: navbarVisible })} insideHeader />
      </Group>
      <Group spacing="xs">
        <ActionIcon
          aria-label="Toggle color scheme"
          color={dark ? "yellow" : "gray"}
          variant="outline"
          onClick={() => toggleColorScheme()}
        >
          {/* <ColorSchemeIcon size={16} /> */}
          {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
        </ActionIcon>
      </Group>
    </Group>
  );
}
