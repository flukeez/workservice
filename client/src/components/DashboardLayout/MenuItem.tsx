import { useEffect, useState } from "react";
import cx from "clsx";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { Box, NavLink, ThemeIcon } from "@mantine/core";
import { SideNavItem } from "./types";
import classes from "./MenuItem.module.css";

export default function MenuItem({
  title,
  path,
  icon: Icon,
  childPath,
  subMenuItems,
}: SideNavItem) {
  const location = useLocation();
  const pathname = location.pathname;
  const [menuOpen, setMenuOpen] = useState(
    childPath?.some((currentPath) => pathname.includes(currentPath))
  );
  const hasSubMenuItems = Array.isArray(subMenuItems);

  const toggleSubMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (!childPath?.some((currentPath) => pathname.includes(currentPath))) {
      setMenuOpen(false);
    }
  }, [pathname]);

  return (
    <>
      {hasSubMenuItems ? (
        <NavLink
          autoContrast
          onClick={toggleSubMenu}
          opened={menuOpen}
          label={title}
          leftSection={
            Icon && (
              <ThemeIcon
                variant="light"
                color="gray.5"
                className={cx(classes.iconLink, {
                  [classes.activeIconLink]:
                    pathname === path ||
                    (pathname.startsWith(path) && path !== "/"),
                })}
              >
                <Icon size="1.2rem" stroke={1.5} />
              </ThemeIcon>
            )
          }
          childrenOffset={0}
          py="sm"
          className={cx(classes.navlink)}
        >
          {subMenuItems?.map((subItem, idx) => {
            return (
              <Box
                key={idx}
                style={{
                  paddingLeft: 32,
                }}
                className={cx(classes.boxnav, {
                  [classes.activeBox]:
                    pathname === subItem.path ||
                    (pathname.startsWith(subItem.path) && subItem.path !== "/"),
                })}
              >
                <NavLink
                  autoContrast
                  label={subItem.title}
                  component={Link}
                  py="sm"
                  to={subItem.path}
                  className={cx(classes.subnavlink, {
                    [classes.activeNavLink]:
                      pathname === subItem.path ||
                      (pathname.startsWith(subItem.path) &&
                        subItem.path !== "/"),
                  })}
                />
              </Box>
            );
          })}
        </NavLink>
      ) : (
        <NavLink
          autoContrast
          component={Link}
          to={path}
          label={title}
          leftSection={
            Icon && (
              <ThemeIcon
                variant="light"
                color="gray.6"
                className={cx(classes.iconLink, {
                  [classes.activeIconLink]:
                    pathname === path ||
                    (pathname.startsWith(path) && path !== "/"),
                })}
              >
                <Icon size="1.2rem" stroke={1.5} />
              </ThemeIcon>
            )
          }
          py="sm"
          className={cx(classes.navlink, {
            [classes.activeNavLink]:
              pathname === path || (pathname.startsWith(path) && path !== "/"),
          })}
        />
      )}
    </>
  );
}
