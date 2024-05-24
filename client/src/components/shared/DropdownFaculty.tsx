import { useFacultys } from "@/hooks/faculty";
import { IFaculty } from "@/types/IFaculty";
import { Select } from "@mantine/core";

interface FacultyProps {
  faculty: string | null;
  setFaculty: (faculty: string | null) => void;
  error?: string;
}
export default function DropdownFaculty({
  faculty,
  setFaculty,
  error,
}: FacultyProps) {
  const condition = {
    page: 0,
    limit: 1000,
    sortDirection: "asc",
    sortField: "id",
  };

  const { data } = useFacultys(condition);
  return (
    <Select
      label="หน่วยงานต้นสังกัด"
      placeholder="เลือกหน่วยงานต้นสังกัด"
      value={faculty}
      onChange={setFaculty}
      data={
        data?.rows &&
        data.rows.map((field: IFaculty) => ({
          value: field.id.toString(),
          label: field.name,
        }))
      }
      searchable
      clearable
      required
      error={error}
      nothingFoundMessage="ไม่พบข้อมูล"
    />
  );
}
