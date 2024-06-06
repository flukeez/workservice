import { Select } from "@mantine/core";
import { useOrgCharts } from "@/hooks/faculty/useFaculty";
import type { IConditionFilter } from "@/types/IConditionFilter";
import type { User } from "@/types/IUser";

interface FacultyUserProps {
  user: string | null;
  setUser: (position: string | null) => void;
  faculty: string | null;
  label?: string;
  error?: string;
  required?: boolean;
}
export default function DropdownFacultyUser({
  user,
  setUser,
  faculty,
  label,
  error,
  required,
}: FacultyUserProps) {
  const condition: IConditionFilter = {
    txtSearch: "",
    page: 0,
    limit: 1000,
    sortDirection: "asc",
    sortField: "firstname",
  };

  const { data } = useOrgCharts(Number(faculty), condition);
  return (
    <Select
      key={faculty}
      label={label || "บุคคล"}
      placeholder="เลือกรายชื่อบุคคล"
      value={user?.toString() || null}
      onChange={setUser}
      data={
        data?.rows &&
        data.rows.map((field: User) => ({
          value: field.id.toString(),
          label: field.firstname + " " + field.surname,
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
