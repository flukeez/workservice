import { useEffect, useState } from "react";
import cx from "clsx";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { Box, NavLink, ThemeIcon } from "@mantine/core";
import { SideNavItem } from "./types";

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
          leftSection={Icon && <Icon size="1.2rem" stroke={1.5} />}
          childrenOffset={0}
          py="sm"
        >
          {subMenuItems?.map((subItem, idx) => {
            return (
              <Box
                key={idx}
                style={{
                  paddingLeft: 32,
                }}
              >
                <NavLink
                  autoContrast
                  label={subItem.title}
                  component={Link}
                  to={subItem.path}
                  active={subItem.path === pathname}
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
          leftSection={Icon && <Icon size="1.2rem" stroke={1.5} />}
          active={path === pathname}
          py="sm"
        />
      )}
    </>
  );
}
