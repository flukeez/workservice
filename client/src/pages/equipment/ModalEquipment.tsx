import {
  ActionIcon,
  Button,
  FocusTrap,
  Group,
  Input,
  Modal,
  Select,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconList, IconTable, IconX } from "@tabler/icons-react";

export default function ModalEquipment() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal opened={opened} onClose={close} title="รายการอุปกรณ์" size="70rem">
        <FocusTrap.InitialFocus />
        <TextInput label="First input" placeholder="First input" />
        <TextInput
          data-autofocus
          label="Input with initial focus"
          placeholder="It has data-autofocus attribute"
          mt="md"
        />
      </Modal>

      <TextInput
        label="อุปกร์ที่แจ้งซ่อม"
        placeholder="เลือกอุปกรณ์ที่แจ้งซ่อม"
        onClick={open}
        rightSection={
          <Group gap={3}>
            <ActionIcon onClick={open} variant="light">
              <IconList size={18} />
            </ActionIcon>
            <ActionIcon onClick={open} variant="light" color="gray">
              <IconX size={18} />
            </ActionIcon>
          </Group>
        }
        rightSectionWidth={70}
        required
      />
    </>
  );
}
