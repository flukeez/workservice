import { useDisclosure } from "@mantine/hooks";
import { Drawer } from "@mantine/core";

export default function TypeMoneyForm() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Drawer
      opened={opened}
      onClose={close}
      title="Authentication"
      overlayProps={{ opacity: 0.5, blur: 4 }}
    >
      {/* Drawer content */}
    </Drawer>
  );
}
