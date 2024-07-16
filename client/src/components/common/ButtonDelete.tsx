import { Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

interface Props {
  onClick: () => void;
}
export default function ButtonDelete({
  onClick,
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button variant="subtle" color="red" size="compact-md" onClick={onClick}>
      <IconTrash size={"18"} />
    </Button>
  );
}
