import { Badge } from "@mantine/core";
import { ColorProviderStatus } from "@/utils/colorProviderStatus";

export default function BadgeProviderStatus({ status }: { status: string }) {
  const [color, text] = ColorProviderStatus(status);
  return (
    <Badge color={color} variant="light">
      {text}
    </Badge>
  );
}
