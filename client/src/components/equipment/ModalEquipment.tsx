import { ActionIcon, Group, Modal, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconList, IconX } from "@tabler/icons-react";
import TableEquipment from "./TableEquipment";
import { useState } from "react";

interface ModalEquipmentProps {
  equip: string[];
  setEquip: (equip: string[]) => void;
  error?: string;
}
export default function ModalEquipment({
  equip,
  setEquip,
  error,
}: ModalEquipmentProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [equipment, setEquipment] = useState<string[]>([]);

  const handleSelectName = (selectName: string[]) => {
    if (
      selectName.every((equipName: string) => equipment.includes(equipName))
    ) {
      // ถ้ามี ลบออก
      const updatedEquipment = equipment.filter((equipName: string) =>
        selectName.includes(equipName)
      );
      setEquipment(updatedEquipment);
    } else {
      // ถ้าไม่มีให้เพิ่มตัวที่ขาดไป
      const updatedEquipment = selectName.filter(
        (equipName: string) => !equipment.includes(equipName)
      );
      setEquipment([...equipment, ...updatedEquipment]);
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="รายการอุปกรณ์" size="70rem">
        <TableEquipment
          equip={equip}
          setEquip={setEquip}
          setEquipName={handleSelectName}
          onClose={close}
        />
      </Modal>
      <Textarea
        label="อุปกร์ที่แจ้งซ่อม"
        placeholder="เลือกอุปกรณ์ที่แจ้งซ่อม"
        onClick={open}
        value={equipment.join(", ")}
        autosize
        maxRows={5}
        // rightSectionProps={{
        //   style: {
        //     display: "flex",
        //     alignItems: "flex-start",
        //     marginTop: "0.1rem",
        //     marginRight: "0.5rem",
        //   },
        // }}
        rightSection={
          <Group gap={3} align="top">
            <ActionIcon onClick={open} variant="light">
              <IconList size={18} />
            </ActionIcon>
            <ActionIcon
              onClick={() => {
                setEquip([""]), setEquipment([]);
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
        error={error}
      />
    </>
  );
}
