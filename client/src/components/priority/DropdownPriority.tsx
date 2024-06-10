import { usePrioritys } from "@/hooks/priority";
import type { IConditionFilter } from "@/types/IConditionFilter";
import type { IPriority } from "@/types/IPriority";
import { Select } from "@mantine/core";

interface PriorityProps {
  priority: string | null;
  setPriority: (priority: string | null) => void;
  label?: string;
  error?: string;
  required?: boolean;
}
export default function DropdownPriority({
  priority,
  setPriority,
  label,
  error,
  required,
}: PriorityProps) {
  const condition: IConditionFilter = {
    txtSearch: "",
    page: 0,
    limit: 1000,
    sortDirection: "asc",
    sortField: "name",
  };
  const { data } = usePrioritys(condition);
  return (
    <Select
      label={label || "ความเร่งด่วน"}
      placeholder="เลือกความเร่งด่วน"
      value={priority?.toString() || ""}
      onChange={setPriority}
      data={
        data?.rows &&
        data.rows.map((field: IPriority) => ({
          value: field.id.toString(),
          label: field.name,
        }))
      }
      searchable
      clearable
      required={required}
      error={error}
      nothingFoundMessage="ไม่พบข้อมูล"
    />
  );
}
