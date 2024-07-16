import { Badge, NumberInput } from "@mantine/core";

interface InputPriceProps {
  error?: string;
  label?: string;
  placeholder?: string;
  value: number;
  onChange: (value: string | number) => void;
  filled?: string;
}
export default function InputPrice({
  error,
  label,
  value,
  placeholder,
  onChange,
  filled,
}: InputPriceProps) {
  return (
    <NumberInput
      label={label ?? "ราคา"}
      value={value}
      onChange={onChange}
      placeholder={placeholder ?? "กรอกราคา"}
      hideControls
      decimalScale={2}
      fixedDecimalScale
      min={0}
      thousandSeparator=","
      rightSectionWidth={60}
      rightSection={
        <Badge color="gray" variant="light" radius="sm" size="lg">
          บาท
        </Badge>
      }
      rightSectionPointerEvents="none"
      styles={{ input: { textAlign: "right" } }}
      error={error}
      variant={filled}
    />
  );
}
