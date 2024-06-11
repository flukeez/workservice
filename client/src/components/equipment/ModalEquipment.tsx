import { ActionIcon, Group, Modal, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconList, IconX } from "@tabler/icons-react";
import TableEquipment from "./TableEquipment";
import { useState } from "react";

interface ModalEquipmentProps {
  equip: string[];
  setEquip: (value: string[]) => void;
}
export default function ModalEquipment({
  equip,
  setEquip,
}: ModalEquipmentProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [equipment, setEquipment] = useState<string[]>([]);
  return (
    <>
      <Modal opened={opened} onClose={close} title="รายการอุปกรณ์" size="70rem">
        <TableEquipment
          equip={equip}
          setEquip={setEquip}
          setEquipName={setEquipment}
          onClose={close}
        />
      </Modal>

      <Textarea
        label="อุปกร์ที่แจ้งซ่อม"
        placeholder="เลือกอุปกรณ์ที่แจ้งซ่อม"
        onClick={open}
        value={equipment}
        rightSection={
          <Group gap={3} align="top">
            <ActionIcon onClick={open} variant="light">
              <IconList size={18} />
            </ActionIcon>
            <ActionIcon
              onClick={() => {
                setEquip([]), setEquipment([]);
              }}
              variant="light"
              color="gray"
            >
              <IconX size={18} />
            </ActionIcon>
          </Group>
        }
        rightSectionWidth={90}
        required
      />
    </>
  );
}
