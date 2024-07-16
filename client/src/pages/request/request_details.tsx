import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import PageHeader from "@/components/common/PageHeader";
import StepperRepairStatus from "@/components/request/StepperRepairStatus";
import {
  Button,
  Card,
  Grid,
  Group,
  List,
  LoadingOverlay,
  ScrollArea,
  Text,
  TextInput,
} from "@mantine/core";
import { useRequestDetails } from "@/hooks/request";
import { convertToNumberOrZero } from "@/utils/mynumber";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { dateThaiLong } from "@/utils/mydate";

const title = "รายละเอียดงานซ่อม";
const listItems = [
  { title: "รายการแจ้งซ่อม", href: "/request" },
  { title: title, href: "#" },
];

const labelSize = {
  md: 2,
  sm: 4,
  xs: 12,
};
const inputSize = {
  md: 10,
  sm: 8,
  xs: 12,
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

export default function RequestDetails() {
  const params = useParams();
  const id = convertToNumberOrZero(params.id);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 390px)");
  const { data, isLoading } = useRequestDetails(id);

  const { register, reset, getValues } = useForm();

  useEffect(() => {
    if (data && data.result) {
      reset(data.result);
    }
  }, [data]);

  return (
    <>
      <PageHeader title={title} listItems={listItems} />
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="md">
          <StepperRepairStatus id={id} />
        </Card.Section>
        <LoadingOverlay visible={isLoading} />
        <Grid mt="lg">
          {[
            ["วันที่แจ้ง", "date_start", "DateInput"],
            ["งานซ่อม", "request_name"],
            ["ประเภทงาน", "issue_name"],
            ["ประเภทปัญหา", "issue_sub_name"],
            ["ความเร่งด่วน", "priority_name"],
            ["รายการอุปกรณ์", "equip_name", "ListEquipment"],
            ["ผู้ซ่อม", "provider_name", "ProviderInput"],
            ["สถานะงาน", "status_name"],
          ].map(([label, value, component = "TextInput"], key) => (
            <React.Fragment key={key}>
              <Grid.Col span={labelSize}>
                <TextLabel label={label} isMobile={isMobile || false} />
              </Grid.Col>
              <Grid.Col span={inputSize}>
                {component === "ProviderInput" ? (
                  <TextInput
                    value={getValues(value) || "ยังไม่มีผู้ซ่อม"}
                    readOnly
                    variant="filled"
                  />
                ) : component === "ListEquipment" ? (
                  <ScrollArea>
                    <ListEquipment equip={getValues(value)} />
                  </ScrollArea>
                ) : component === "DateInput" ? (
                  <TextInput
                    value={dateThaiLong(getValues("date_start"))}
                    readOnly
                    variant="filled"
                  />
                ) : (
                  <TextInput {...register(value)} readOnly variant="filled" />
                )}
              </Grid.Col>
            </React.Fragment>
          ))}
        </Grid>
        <Card.Section withBorder inheritPadding py="md" mt="lg">
          <Group justify="center">
            <Button size="lg" color="gray" onClick={() => navigate("/request")}>
              ย้อนกลับ
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </>
  );
}
