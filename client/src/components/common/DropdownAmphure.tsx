import { Select } from "@mantine/core";
import { useAmphures } from "@/hooks/amphure";
import type { IAmphure } from "@/types/IAmphure";

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
  const { data } = useAmphures(province);

  return (
    <Select
      label="อำเภอ"
      placeholder="เลือกอำเภอ"
      value={amphure?.toString()}
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
