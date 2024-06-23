import { Select } from "@mantine/core";
import type { IConditionFilter } from "@/types/IConditionFilter";
import type { User } from "@/types/IUser";
import { useUserPositions } from "@/hooks/user_position";

interface FacultyUserProps {
  user: string | null;
  setUser: (position: string | null) => void;
  faculty: string | null;
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
}
export default function DropdownFacultyUser({
  user,
  setUser,
  faculty,
  label,
  error,
  required,
  placeholder,
}: FacultyUserProps) {
  const condition: IConditionFilter = {
    txtSearch: "",
    page: 0,
    limit: "1000",
    sortDirection: "asc",
    sortField: "firstname",
  };

  const { data } = useUserPositions(Number(faculty), condition);
  return (
    <Select
      key={faculty}
      label={label || "บุคคล"}
      value={user?.toString() || null}
      placeholder={placeholder}
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
