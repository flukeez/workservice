import { ActionIcon, Group, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconList, IconX } from "@tabler/icons-react";
import TableEquipment from "./TableEquipment";

interface ModalEquipmentProps {
  equip: string[];
  setEquip: (value: string[]) => void;
}
export default function ModalEquipment({
  equip,
  setEquip,
}: ModalEquipmentProps) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal opened={opened} onClose={close} title="รายการอุปกรณ์" size="70rem">
        <TableEquipment equip={equip} setEquip={setEquip} />
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
