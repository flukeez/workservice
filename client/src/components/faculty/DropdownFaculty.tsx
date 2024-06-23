import { Select } from "@mantine/core";
import { useFacultys } from "@/hooks/faculty";
import type { IConditionFilter } from "@/types/IConditionFilter";
import type { IFaculty } from "@/types/IFaculty";

interface FacultyProps {
  faculty: string | null;
  setFaculty: (faculty: string | null) => void;
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
}
export default function DropdownFaculty({
  faculty,
  setFaculty,
  label,
  error,
  required,
  placeholder,
}: FacultyProps) {
  const condition: IConditionFilter = {
    txtSearch: "",
    page: 0,
    limit: "1000",
    sortDirection: "asc",
    sortField: "name",
  };

  const { data } = useFacultys(condition);
  return (
    <Select
      label={label}
      value={faculty?.toString()}
      onChange={setFaculty}
      placeholder={placeholder}
      data={
        data?.rows &&
        data.rows.map((field: IFaculty) => ({
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
