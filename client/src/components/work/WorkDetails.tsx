import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRequestDetails } from "@/hooks/request";

import {
  Grid,
  List,
  LoadingOverlay,
  ScrollArea,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import ImageAlbumPreview from "../common/ImageAlbumPreview";
import { dateThaiLong } from "@/utils/mydate";

const labelSize = {
  md: 2,
  sm: 4,
  xs: 12,
};
const inputSize = {
  md: 9,
  sm: 8,
  xs: 12,
};
const offsetSize = {
  md: 1,
  sm: 0,
  xs: 0,
};

const TextLabel = ({
  label,
  isMobile,
}: {
  label: string;
  isMobile: boolean;
}) => {
  return <Text ta={isMobile ? "left" : "right"}>{label} :</Text>;
};

const ListEquipment = ({ equip }: { equip: string[] }) => {
  return (
    <List size="sm" withPadding bg="gray.1" p="sm">
      {equip?.map((item) => (
        <List.Item key={item}>{item}</List.Item>
      ))}
    </List>
  );
};

export default function WorkDetailsComp({
  id,
  setStatus,
}: {
  id: number;
  setStatus?: (status: string) => void;
}) {
  const isMobile = useMediaQuery("(max-width: 390px)");
  const { data, isLoading } = useRequestDetails(id);
  const { register, reset, getValues } = useForm();

  useEffect(() => {
    if (data && data.result) {
      reset(data.result);
      if (setStatus) {
        setStatus(data.result.status_id);
      }
    }
  }, [data]);
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Grid mt="lg">
        {[
          ["วันที่แจ้ง", "date_start", "DateInput"],
          ["หน่วยงาน", "faculty_name"],
          ["ผู้แจ้ง", "user_name"],
          ["งานซ่อม", "request_name"],
          ["รายละเอียด", "request_details", "Textarea"],
          ["ประเภทงาน", "issue_name"],
          ["ประเภทปัญหา", "issue_sub_name"],
          ["สถานะงาน", "status_name"],
          ["ความเร่งด่วน", "priority_name"],
          ["รายการอุปกรณ์", "equip_name", "ListEquipment"],
        ].map(([label, value, component = "TextInput"], key) => (
          <React.Fragment key={key}>
            <Grid.Col span={labelSize}>
              <TextLabel label={label} isMobile={isMobile || false} />
            </Grid.Col>
            <Grid.Col span={inputSize}>
              {component === "Textarea" ? (
                <Textarea
                  {...register(value)}
                  readOnly
                  variant="filled"
                  rows={3}
                />
              ) : component === "DateInput" ? (
                <TextInput
                  value={dateThaiLong(getValues("date_start"))}
                  readOnly
                  variant="filled"
                />
              ) : component === "ListEquipment" ? (
                <ScrollArea>
                  <ListEquipment equip={getValues(value)} />
                </ScrollArea>
              ) : (
                <TextInput {...register(value)} readOnly variant="filled" />
              )}
            </Grid.Col>
            <Grid.Col span={offsetSize} />
          </React.Fragment>
        ))}
        <Grid.Col span={labelSize}>
          <TextLabel label={"รูปภาพ"} isMobile={isMobile || false} />
        </Grid.Col>
        <Grid.Col span={inputSize}>
          {getValues("image") ? (
            <ImageAlbumPreview
              folder="request"
              images={String(getValues("image")).split(",") || []}
            />
          ) : (
            <TextInput variant="filled" readOnly />
          )}
        </Grid.Col>
      </Grid>
    </>
  );
}
