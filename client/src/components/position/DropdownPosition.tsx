import { Select } from "@mantine/core";
import { usePositions } from "@/hooks/position";
import type { IConditionFilter } from "@/types/IConditionFilter";
import type { IPosition } from "@/types/IPosition";

interface PositionProps {
  position: string | null;
  setPosition: (position: string | null) => void;
  label?: string;
  error?: string;
}
export default function DropdownPosition({
  position,
  setPosition,
  label,
  error,
}: PositionProps) {
  const condition: IConditionFilter = {
    txtSearch: "",
    page: 0,
    limit: "1000",
    sortDirection: "asc",
    sortField: "name",
  };

  const { data } = usePositions(condition);
  return (
    <Select
      label={label || "ตำแหน่งงาน"}
      value={position?.toString()}
      onChange={setPosition}
      data={
        data?.rows &&
        data.rows.map((field: IPosition) => ({
          value: field.id.toString(),
          label: field.name,
        }))
      }
      searchable
      clearable
      error={error}
      nothingFoundMessage="ไม่พบข้อมูล"
    />
  );
}
