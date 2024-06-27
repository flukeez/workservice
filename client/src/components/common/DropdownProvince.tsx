import { Select } from "@mantine/core";
import { useProvinces } from "@/hooks/province";
import { IProvince } from "@/types/IProvince";

interface ProvinceProps {
  province: string | null;
  setProvince: (province: string | null) => void;
  error?: string;
  require?: boolean;
}
export default function DropdownProvince({
  province,
  setProvince,
  error,
  require,
}: ProvinceProps) {
  const { data } = useProvinces();
  return (
    <Select
      label="จังหวัด"
      placeholder="เลือกจังหวัด"
      value={province?.toString() || null}
      onChange={setProvince}
      data={
        data?.rows &&
        data.rows.map((field: IProvince) => ({
          value: field.id.toString(),
          label: field.province_name,
        }))
      }
      searchable
      clearable
      error={error}
      nothingFoundMessage="ไม่พบข้อมูล"
      withAsterisk={require}
    />
  );
}
