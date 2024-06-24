import { useIssues } from "@/hooks/issue";
import { IConditionFilter } from "@/types/IConditionFilter";
import type { IIssue, IIssueFilter } from "@/types/IIssue";
import { Select } from "@mantine/core";
import { useEffect } from "react";

interface IssueProps {
  issue: string | null;
  setIssue: (issue: string | null) => void;
  error?: string;
  issue_type?: string; //แสดงประเภทหมวดหมู่หลักหรือย่อย
  issue_id?: string; //ไอดีของหมวดหมู่หลัก
  required?: boolean;
  label?: string;
  placeholder?: string;
  keys?: string; //ไว้รเรนเดอร์
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
  const setCondition = () => {
    const condition: IConditionFilter & IIssueFilter = {
      txtSearch: "",
      page: 0,
      sortDirection: "asc",
      sortField: "name",
      issueId: issue_id,
      issueType: issue_type,
    };
    return condition;
  };

  const { data, setFilter } = useIssues(setCondition());

  useEffect(() => {
    setFilter(setCondition());
  }, [issue_id]);
  return (
    <Select
      label={label || "ประเภทปัญหา"}
      placeholder={placeholder || "เลือกประเภทปัญหา"}
      value={issue?.toString() || null}
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
