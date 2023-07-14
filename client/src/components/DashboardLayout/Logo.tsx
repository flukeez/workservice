import { Code, createStyles, Text } from '@mantine/core';
// import { IconPointer } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  root: {
    color: 'inherit',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  iconInsideHeader: {
    '@media (min-width: 330px)': {
      display: 'none',
    },
    '@media (min-width: 370px)': {
      display: 'inherit',
    },
  },
  title: {
    font: '16px/1 BenchNine, sans-serif',
    margin: '0 0 -3px',
  },
  titleInsideHeader: {
    display: 'none',
    '@media (min-width: 330px)': {
      display: 'block',
    },
  },
  version: {
    fontSize: 11,
    lineHeight: 1,
    padding: '4px 4px 0',
    // margin: '-8px 0 0 -4px',
    marginLeft: '-4px'
  },
  versionInsideHeader: {
    display: 'none',
    '@media (min-width: 420px)': {
      display: 'inherit',
    },
  },
}));

export default function Logo({ className, insideHeader }: { className?: string; insideHeader?: boolean }) {
  const { classes, cx } = useStyles();
  return (
    <div className={cx(classes.root, className)}>
      <Text className={cx(classes.title, { [classes.titleInsideHeader]: insideHeader })} component="h1">
        WorkService
      </Text>
      <Code className={cx(classes.version, { [classes.versionInsideHeader]: insideHeader })}>
        {/* {process.env.PACKAGE_VERSION} */}
        2.0.0
      </Code>
    </div>
  );
}
