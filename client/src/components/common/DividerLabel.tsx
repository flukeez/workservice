import { Divider, Text } from "@mantine/core";

export default function DividerLabel({ label }: { label: string }) {
  return (
    <Divider
      size="xs"
      mt="md"
      labelPosition="left"
      label={
        <Text size="lg" c="dimmed">
          {label}
        </Text>
      }
    />
  );
}
