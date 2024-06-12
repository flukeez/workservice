import {
  ActionIcon,
  Button,
  FileButton,
  Flex,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconCloudUpload, IconTrash } from "@tabler/icons-react";

interface FileUploadProps {
  file: unknown[];
  setFile: (file: File[] | null) => void;
  setDelete: (index: number) => void;
}

export default function ButtonFileUploadMultiple({
  file,
  setFile,
  setDelete,
}: FileUploadProps) {
  return (
    <Stack align="flex-start">
      {/* ปุ่มอัพโหลด */}
      <FileButton
        onChange={(files) => setFile(files || [])}
        accept="image/png,image/jpeg"
        multiple
      >
        {(props) => (
          <Button
            leftSection={<IconCloudUpload size="1.5rem" />}
            variant="outline"
            {...props}
          >
            อัพโหลดรูปภาพ
          </Button>
        )}
      </FileButton>

      {/* แสดงชื่อไฟล์และปุ่มลบ */}
      <Flex direction="column" gap="sm" align="flex-start">
        {file.map((fileItem, index) => (
          <Flex key={index} align="center" gap="sm">
            <Text>
              {typeof fileItem === "string"
                ? fileItem
                : (fileItem as File).name}
            </Text>
            <Tooltip label="ลบรูปภาพ">
              <ActionIcon
                variant="light"
                color="red"
                radius="xl"
                onClick={() => setDelete(index)}
              >
                <IconTrash size="1rem" />
              </ActionIcon>
            </Tooltip>
          </Flex>
        ))}
      </Flex>
    </Stack>
  );
}
