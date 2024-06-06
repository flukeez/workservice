import { useEffect } from "react";
import { Select } from "@mantine/core";
import { useTumbols } from "@/hooks/tumbol/useTumbol";
import type { ITumbol } from "@/types/ITumbol";

type TumbolProps = {
  tumbol: string | null;
  setTumbol: (tumbol: string | null) => void;
  amphure: string;
};
export default function DropdownTumbol({
  tumbol,
  setTumbol,
  amphure,
}: TumbolProps) {
  const { data, setFilter } = useTumbols(amphure);

  useEffect(() => {
    setFilter(amphure);
  }, [amphure]);
  return (
    <Select
      key={amphure}
      label="ตำบล"
      placeholder="เลือกตำบล"
      value={tumbol?.toString() || null}
      onChange={setTumbol}
      data={
        data?.rows &&
        data.rows.map((field: ITumbol) => ({
          value: field.id.toString(),
          label: field.tumbol_name,
        }))
      }
      searchable
      clearable
      nothingFoundMessage="ไม่พบข้อมูล"
    />
  );
}
