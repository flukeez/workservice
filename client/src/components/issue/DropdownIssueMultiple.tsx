import { MultiSelect } from "@mantine/core";
import { useIssues } from "@/hooks/issue";
import type { IConditionFilter } from "@/types/IConditionFilter";
import type { IIssue, IIssueFilter } from "@/types/IIssue";

interface IssueProps {
  issue: string[] | undefined;
  setIssue: (issue: string[] | undefined) => void;
  error?: string;
  required?: boolean;
  label?: string;
  placeholder?: string;
}

export default function DropdownIssueMultiple({
  issue,
  setIssue,
  error,
  required,
  label,
  placeholder,
}: IssueProps) {
  const setCondition = () => {
    const condition: IConditionFilter & IIssueFilter = {
      txtSearch: "",
      page: 0,
      sortDirection: "asc",
      sortField: "name",
      issueType: "0",
    };
    return condition;
  };

  const { data } = useIssues(setCondition());

  return (
    <MultiSelect
      label={label || "ประเภทปัญหา"}
      placeholder={placeholder || "เลือกประเภทปัญหา"}
      value={issue || undefined}
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
