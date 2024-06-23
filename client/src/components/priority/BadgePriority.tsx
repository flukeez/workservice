import { Badge } from "@mantine/core";

export default function BadgePriority({ text }: { text: string }) {
  let color = "";
  switch (text) {
    case "ด่วนมาก":
      color = "red";
      break;
    case "ด่วน":
      color = "yellow";
      break;
    case "ปกติ":
      color = "green";
      break;
    default:
      color = "gray";
  }

  return text ? (
    <Badge color={color} variant="light" size="sm">
      {text}
    </Badge>
  ) : null;
}
