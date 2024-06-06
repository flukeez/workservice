import { Select } from "@mantine/core";
import { useAmphures } from "@/hooks/amphure";
import type { IAmphure } from "@/types/IAmphure";
import { useEffect } from "react";

type AmphureProps = {
  amphure: string | null;
  setAmphure: (amphure: string | null) => void;
  province: string;
};
export default function DropdownAmphure({
  amphure,
  setAmphure,
  province,
}: AmphureProps) {
  const { data, setFilter } = useAmphures(province);

  useEffect(() => {
    setFilter(province);
  }, [province]);

  return (
    <Select
      key={province}
      label="อำเภอ"
      placeholder="เลือกอำเภอ"
      value={amphure?.toString() || null}
      onChange={setAmphure}
      data={
        data?.rows &&
        data.rows.map((field: IAmphure) => ({
          value: field.id.toString(),
          label: field.amphure_name,
        }))
      }
      searchable
      clearable
      nothingFoundMessage="ไม่พบข้อมูล"
    />
  );
}
