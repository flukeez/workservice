import { Group, Highlight } from "@mantine/core";

interface EquipmentLabelProps {
  code: string;
  name: string;
  serial: string;
  highlight: string;
}
export default function EquipmentLabel({
  code,
  name,
  serial,
  highlight,
}: EquipmentLabelProps) {
  let label = code && `${code} - `;
  label += name;
  return (
    <Group>
      <Highlight size="sm" highlight={highlight}>
        {label}
      </Highlight>
      {serial !== "null" ? (
        <Highlight
          size="sm"
          highlight={highlight}
          c="dimmed"
        >{`[${serial}]`}</Highlight>
      ) : null}
    </Group>
  );
}
