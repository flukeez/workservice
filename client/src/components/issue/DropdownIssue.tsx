import { useIssues } from "@/hooks/issue";
import { IIssue } from "@/types/IIssue";
import { Select } from "@mantine/core";

interface IssueProps {
  issue: string | null;
  setIssue: (issue: string | null) => void;
  error?: string;
}

export default function DropdownIssue({ issue, setIssue, error }: IssueProps) {
  const condition = {
    page: 0,
    limit: 1000,
    sortDirection: "asc",
    sortField: "name",
  };

  const { data } = useIssues(condition);

  return (
    <Select
      label="ประเภทปัญหา"
      placeholder="เลือกประเภทปัญหา"
      value={issue}
      onChange={setIssue}
      data={
        data?.rows &&
        data.rows.map((field: IIssue) => ({
          value: field.id.toString(),
          label: field.name,
        }))
      }
      searchable
      clearable
      error={error}
      required
      nothingFoundMessage="ไม่พบข้อมูล"
    />
  );
}
