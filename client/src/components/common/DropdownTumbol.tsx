import { useTumbols } from "@/hooks/tumbol/useTumbol";
import { ITumbol } from "@/types/ITumbol";
import { Select } from "@mantine/core";

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
  const { data } = useTumbols(amphure);

  return (
    <Select
      label="ตำบล"
      placeholder="เลือกตำบล"
      value={tumbol?.toString()}
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
