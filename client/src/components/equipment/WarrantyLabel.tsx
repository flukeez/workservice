import { Flex, Text } from "@mantine/core";
import { dateDiff, dateThaiLong, dateToText, timeToNow } from "@/utils/mydate";

interface WarrantyLabelProps {
  warranty: string;
  warranty_end: string;
  date_start: string;
}

export default function WarrantyLabel({
  warranty,
  warranty_end,
  date_start,
}: WarrantyLabelProps) {
  const toNow = dateDiff(String(warranty_end));

  const getWarrantyText = () => {
    if (toNow < 0 && toNow > -31) {
      return (
        <Text size="sm" color="red">
          หมดประกัน
        </Text>
      );
    } else if (toNow < 31) {
      return (
        <Text size="sm" color="red">
          สิ้นสุดรับประกัน : {timeToNow(String(warranty_end))}
        </Text>
      );
    } else {
      return (
        <Text size="sm" color="dimmed">
          สิ้นสุดรับประกัน : {dateToText(String(warranty_end))}
        </Text>
      );
    }
  };

  return (
    <Flex
      gap="xs"
      justify="flex-start"
      align="flex-start"
      direction="column"
      wrap="nowrap"
    >
      <Text size="sm">{dateThaiLong(String(date_start))}</Text>
      {warranty && (
        <Text fs="italic" size="sm" c="gray">
          การรับประกัน : {warranty}
        </Text>
      )}
      {warranty_end && getWarrantyText()}
    </Flex>
  );
}
