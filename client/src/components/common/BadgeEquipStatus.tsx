import { ColorEquipStatus } from "@/utils/colorEquipStatus";
import { Badge } from "@mantine/core";

export default function BadgeEquipStatus({ text }: { text: string }) {
  const color = ColorEquipStatus(text);
  return (
    <Badge color={color} variant="light">
      {text}
    </Badge>
  );
}
