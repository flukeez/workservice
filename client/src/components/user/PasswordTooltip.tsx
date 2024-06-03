import { Tooltip } from "@mantine/core";
import { IconHelp } from "@tabler/icons-react";

export default function PasswordTooltip() {
  return (
    <Tooltip label="รหัสผ่านหากไม่ต้องการแก้ไขให้เว้นว่างไว้">
      <IconHelp size="1.2rem" color="gray" />
    </Tooltip>
  );
}
