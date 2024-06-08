import {
  ActionIcon,
  Button,
  FileButton,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconCloudUpload, IconTrash } from "@tabler/icons-react";

interface FileUploadProps {
  file: unknown;
  setFile: (file: File | null) => void;
  setDelete: () => void;
}

export default function ButtonFileUpload({
  file,
  setFile,
  setDelete,
}: FileUploadProps) {
  return (
    <Group>
      <FileButton onChange={setFile} accept="image/png,image/jpeg">
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
      {!!file && <Text>{String(file instanceof File ? file.name : file)}</Text>}
      {!!file && (
        <Tooltip label="ลบรูปภาพ">
          <ActionIcon
            variant="light"
            color="red"
            radius="xl"
            onClick={setDelete}
          >
            <IconTrash size="1rem" />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  );
}
