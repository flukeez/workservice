import { Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import TableProvider from "./TableProvider";
import { useEffect, useState } from "react";

interface ModalProviderProps {
  provider: string;
  setProvider: (provider: string | null) => void;
  error?: string;
  issue_id: string | null;
}
export default function ModalProvider({
  provider,
  setProvider,
  error,
  issue_id,
}: ModalProviderProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [issue, setIssue] = useState("");
  const [provName, setProvName] = useState("");

  const handleSelectName = (value: { name: string; id: string }) => {
    setProvider(value.id);
    setProvName(value.name);
    close();
  };

  useEffect(() => {
    //ทำงี้เพราะเวลาผู้ใ้ชเปลี่ยนประเภทปัญหา จะได้ไม่ต้องดึงข้อมูลบ่อย
    //จะดึงก็ต่อเมื่อเปิด modal
    setIssue(issue_id || "");
  }, [opened]);
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="รายชื่อผู้ซ่อม"
        size="70rem"
        closeOnClickOutside={false}
      >
        <TableProvider
          provider={provider}
          setProvider={handleSelectName}
          issue_id={issue}
          provName={provName}
        />
      </Modal>
      <TextInput
        placeholder="เลือกผู้ซ่อม"
        value={provName}
        error={error}
        onClick={open}
      />
    </>
  );
}
