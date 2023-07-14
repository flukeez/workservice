import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  createStyles,
  rem,
  NavLink,
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  link: {
    fontWeight: 500,
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    paddingLeft: rem(31),
    marginLeft: rem(30),
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    borderLeft: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },
  chevron: {
    transition: 'transform 200ms ease',
  },
}));

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  link?: string;
  links?: { label: string; link: string }[];
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, link, links }: LinksGroupProps) {

  const location = useLocation()
  const pathNameSplit = location.pathname.split('/')
  const pathName = "/" + pathNameSplit[1]

  useEffect(() => {
    if (links?.map((item) => item.link).includes(pathName)) {
      setOpened(true)
    } else {
      setOpened(false)
    }
  }, [location])

  const { classes, theme, cx } = useStyles();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft;

  const items = (hasLinks ? links : []).map((link) => (
    <Text
      component={Link}
      to={link.link}
      key={link.label}
      className={cx(classes.link, { [classes.linkActive]: pathName.includes(link.link) })}
    >
      {link.label}
    </Text>
  ));

  if (hasLinks) {
    return (
      <>
        <UnstyledButton
          onClick={(e) => {
            hasLinks ? e.stopPropagation() : null
            setOpened((o) => !o)
          }}
          className={classes.control}
        >
          <Group position="apart" spacing={0}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ThemeIcon variant="light" size={30}>
                <Icon size="1.1rem" />
              </ThemeIcon>
              <Box ml="md">{label}</Box>
            </Box>
            {hasLinks && (
              <ChevronIcon
                className={classes.chevron}
                size="1rem"
                stroke={1.5}
                style={{
                  transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none',
                }}
              />
            )}
          </Group>
        </UnstyledButton>
        {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
      </>
    );
  } else {
    return (
      <>
        <Text
          component={Link}
          to={link || ''}
          key={label}
        >
          <UnstyledButton
            className={cx(classes.control, { [classes.linkActive]: pathName.includes(link || '') })}
          >
            <Group position="apart" spacing={0}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ThemeIcon variant="light" size={30}>
                  <Icon size="1.1rem" />
                </ThemeIcon>
                <Box ml="md">{label}</Box>
              </Box>
            </Group>
          </UnstyledButton>
        </Text>
      </>
    )
  }
}

export function AppNavbarLinkList({ items }: { items: any }) {
  return <LinksGroup {...items} />
}