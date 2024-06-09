import { useIssues } from "@/hooks/issue";
import { IConditionFilter } from "@/types/IConditionFilter";
import type { IIssue, IIssueFilter } from "@/types/IIssue";
import { Select } from "@mantine/core";

interface IssueProps {
  issue: string | null;
  setIssue: (issue: string | null) => void;
  error?: string;
  issue_type?: string;
  issue_id?: string;
  required?: boolean;
  label?: string;
  placeholder?: string;
}

export default function DropdownIssue({
  issue,
  setIssue,
  error,
  issue_id,
  issue_type,
  required,
  label,
  placeholder,
}: IssueProps) {
  const condition: IConditionFilter & IIssueFilter = {
    txtSearch: "",
    page: 0,
    limit: 1000,
    sortDirection: "asc",
    sortField: "name",
    issueId: issue_id,
    issueType: issue_type,
  };

  const { data } = useIssues(condition);

  return (
    <Select
      label={label || "ประเภทปัญหา"}
      placeholder={placeholder || "เลือกประเภทปัญหา"}
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
      required={required || false}
      nothingFoundMessage="ไม่พบข้อมูล"
    />
  );
}
