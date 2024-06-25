import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import PageHeader from "@/components/common/PageHeader";
import StepperRepairStatus from "@/components/request/StepperRepairStatus";
import {
  Button,
  Card,
  Grid,
  Group,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useRequestDetails } from "@/hooks/request";
import { convertToNumberOrZero } from "@/utils/mynumber";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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
export default function RequestDetails() {
  const params = useParams();
  const id = convertToNumberOrZero(params.id);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 390px)");
  const { data, isLoading } = useRequestDetails(id);

  const { register, reset } = useForm();

  const TextLabel = ({ label }: { label: string }) => {
    return <Text ta={isMobile ? "left" : "right"}>{label} :</Text>;
  };

  useEffect(() => {
    if (data && data.result) {
      reset(data.result);
    }
  }, [data, reset]);

  return (
    <>
      <PageHeader title={title} listItems={listItems} />
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="md">
          <StepperRepairStatus status={2} />
        </Card.Section>
        <Grid mt="lg">
          <Grid.Col span={labelSize}>
            <TextLabel label="วันที่เริ่มต้น" />
          </Grid.Col>
          <Grid.Col span={inputSize}>
            <TextInput {...register("date_start")} />
          </Grid.Col>
          <Grid.Col span={labelSize}>
            <TextLabel label="ผู้แจ้ง" />
          </Grid.Col>
          <Grid.Col span={inputSize}>
            <TextInput {...register("user_name")} />
          </Grid.Col>
          <Grid.Col span={labelSize}>
            <TextLabel label="งานซ่อม" />
          </Grid.Col>
          <Grid.Col span={inputSize}>
            <TextInput {...register("request_name")} />
          </Grid.Col>
          <Grid.Col span={labelSize}>
            <TextLabel label="รายการอุปกรณ์" />
          </Grid.Col>
          <Grid.Col span={inputSize}>
            <Textarea rows={4} {...register("equip_name")} />
          </Grid.Col>
          <Grid.Col span={labelSize}>
            <TextLabel label="ผู้ซ่อม" />
          </Grid.Col>
          <Grid.Col span={inputSize}>
            <TextInput {...register("provider_name")} />
          </Grid.Col>
          <Grid.Col span={labelSize}>
            <TextLabel label="สถานะงาน" />
          </Grid.Col>
          <Grid.Col span={inputSize}>
            <TextInput {...register("status_name")} />
          </Grid.Col>
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
