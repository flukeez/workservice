import { Breadcrumbs, Anchor, Group, Text } from "@mantine/core";
import { useLocation } from "react-router-dom";

interface BreadcrumbNavigationProps {
  label: string;
}

export default function BreadcrumbNavigation({
  label,
}: BreadcrumbNavigationProps) {
  const location = useLocation();

  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter((path) => path !== "");

    const breadcrumbs = paths.map((path, index) => {
      const link = `/${paths.slice(0, index + 1).join("/")}`;
      return { label: path, link };
    });

    breadcrumbs.unshift({ label: "หน้าแรก", link: "/" });

    const breadcrumbsTag = breadcrumbs.map((item, index) => (
      <Anchor key={index} href={item.link}>
        {item.label}
      </Anchor>
    ));

    return breadcrumbsTag;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <Group position="apart">
      <Text size="lg">{label}</Text>
      <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
    </Group>
  );
}
