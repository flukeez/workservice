import { useCategories } from "@/hooks/category";
import { IConditionFilter } from "@/types/IConditionFilter";
import { ICategory } from "@/types/ICategory";
import { Select } from "@mantine/core";

interface CategoryProps {
  category: string | null;
  setCategory: (category: string | null) => void;
  label?: string;
  error?: string;
  required?: boolean;
}
export default function DropdownCategory({
  category,
  setCategory,
  label,
  error,
  required,
}: CategoryProps) {
  const condition: IConditionFilter = {
    txtSearch: "",
    page: 0,
    limit: 1000,
    sortDirection: "asc",
    sortField: "name",
  };

  const { data } = useCategories(condition);
  return (
    <Select
      label={label}
      placeholder="เลือกหมวดหมู่อุปกรณ์"
      value={category?.toString()}
      onChange={setCategory}
      data={
        data?.rows &&
        data.rows.map((field: ICategory) => ({
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
