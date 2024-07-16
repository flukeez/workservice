import { Select } from "@mantine/core";
import { useUsers } from "@/hooks/user";
import type { IConditionFilter } from "@/types/IConditionFilter";
import type { User } from "@/types/IUser";

interface UserProps {
  user: string | null;
  setUser: (position: string | null) => void;
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
}
export default function DropdownUser({
  user,
  setUser,
  label,
  error,
  required,
  placeholder,
}: UserProps) {
  const condition: IConditionFilter = {
    txtSearch: "",
    page: 0,
    limit: "1000",
    sortDirection: "asc",
    sortField: "firstname",
  };

  const { data } = useUsers(condition);
  return (
    <Select
      label={label || "บุคคล"}
      value={user?.toString() || null}
      onChange={setUser}
      placeholder={placeholder}
      data={
        data?.rows &&
        data.rows.map((field: User) => ({
          value: field.id.toString(),
          label: field.firstname + " " + field.surname,
        }))
      }
      searchable
      clearable
      withAsterisk={required}
      error={error}
      nothingFoundMessage="ไม่พบข้อมูล"
    />
  );
}
