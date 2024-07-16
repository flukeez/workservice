import { Button } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";

interface Props {
  children?: React.ReactNode;
  loading?: boolean;
  color?: string;
}
export default function ButtonSave({
  children = "บันทึกข้อมูล",
  loading = false,
  color = "blue",
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      loading={loading}
      color={color}
      leftSection={<IconDeviceFloppy />}
      type="submit"
    >
      {children}
    </Button>
  );
}
