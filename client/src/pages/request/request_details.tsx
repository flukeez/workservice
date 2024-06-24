import PageHeader from "@/components/common/PageHeader";
import StepperRepairStatus from "@/components/request/StepperRepairStatus";
import { Card, Grid, Text, TextInput } from "@mantine/core";

const title = "รายละเอียดงานซ่อม";
const listItems = [
  { title: "รายการแจ้งซ่อม", href: "/request" },
  { title: title, href: "#" },
];
const labelSize = {
  md: 3,
  sm: 4,
  xs: 12,
};

const inputSize = {
  md: 9,
  sm: 8,
  xs: 12,
};
export default function RequestDetails() {
  return (
    <>
      <PageHeader title={title} listItems={listItems} />
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="md">
          <StepperRepairStatus status={2} />
        </Card.Section>
        <Grid mt="lg" align="flex-end">
          <Grid.Col span="content">
            <Text>งานซ่อม :</Text>
          </Grid.Col>
          <Grid.Col span={inputSize}>
            <TextInput />
          </Grid.Col>
        </Grid>
      </Card>
    </>
  );
}
