import { useEffect, useState } from "react";
import { axiosAuth } from "@/utils/axios";

import { Button, Group, LoadingOverlay, TextInput } from "@mantine/core";

interface CtypeFormProps {
  onClose: () => void;
  reFetchData: () => void;
  id?: string;
}

export function CtypeForm({ onClose, reFetchData, id }: CtypeFormProps) {
  const [ctypeName, setCtypeName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!!id) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const { data } = await axiosAuth.get("/ctype/" + id);
    setCtypeName(data?.row.name || "");

    setIsLoading(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const fromData = {
      name: ctypeName,
    };

    let response;
    if (!!id) {
      response = await axiosAuth.patch("/ctype/" + id, fromData);
    } else {
      response = await axiosAuth.post("/ctype", fromData);
    }

    console.log(response?.data);

    setIsLoading(false);
    onClose();
    reFetchData();
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <TextInput
        label="ชื่อประเภทสินค้า"
        value={ctypeName}
        onChange={(e) => setCtypeName(e.target.value)}
      />

      <Group justify="right" mt={40}>
        <Button variant="light" color="gray" size="lg" onClick={onClose}>
          ปิด
        </Button>
        <Button size="lg" onClick={handleSubmit}>
          บันทึก
        </Button>
      </Group>
    </>
  );
}
