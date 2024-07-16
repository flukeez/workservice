import { Button } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";

interface Props {
  onClick: () => void;
}
export default function ButtonEdit({
  onClick,
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button variant="subtle" size="compact-md" onClick={onClick}>
      <IconEdit size={"18"} />
    </Button>
  );
}
