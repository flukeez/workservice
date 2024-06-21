import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

interface Props {
  children: React.ReactNode;
  loading?: boolean;
  color?: string;
  onClick: () => void;
}
export default function ButtonNew({
  children,
  loading = false,
  color = "green",
  onClick,
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      loading={loading}
      color={color}
      leftSection={<IconPlus size={18} />}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
