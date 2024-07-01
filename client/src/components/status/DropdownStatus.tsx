import { Select } from "@mantine/core";

import type { IConditionFilter } from "@/types/IConditionFilter";
import type { IPriority } from "@/types/IPriority";
import { useStatuses } from "@/hooks/status";

interface StatusProps {
  status: string | null;
  setStatus: (status: string | null) => void;
  label?: string;
  error?: string;
  required?: boolean;
}
export default function DropdownStatus({
  status,
  setStatus,
  label,
  error,
  required,
}: StatusProps) {
  const condition: IConditionFilter = {
    txtSearch: "",
    page: 0,
    sortDirection: "asc",
    sortField: "id",
  };
  const { data } = useStatuses(condition);
  return (
    <Select
      label={label ?? "สถานะงาน"}
      placeholder="เลือกสถานะงาน"
      value={status?.toString() || null}
      onChange={setStatus}
      data={
        data?.rows &&
        data.rows.map((field: IPriority) => ({
          value: field.id.toString(),
          label: field.name,
        }))
      }
      searchable
      required={required}
      error={error}
      nothingFoundMessage="ไม่พบข้อมูล"
    />
  );
}
