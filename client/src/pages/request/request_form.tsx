import PageHeader from "@/components/common/PageHeader";
import DropdownIssue from "@/components/issue/DropdownIssue";
import { Button, Card, Grid, Group, Textarea, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import ModalEquipment from "../equipment/ModalEquipment";

const title = "แจ้งซ่อม";
const listItems = [{ title: title, href: "#" }];
const layout = {
  md: 6,
  sm: 6,
  xs: 12,
};
export default function RequestForm() {
  const handleNew = () => {};
  return (
    <>
      <PageHeader title={title} listItems={listItems} />
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="md">
          <Group justify="right">
            <Button
              color="green"
              leftSection={<IconPlus size="1rem" />}
              onClick={handleNew}
            >
              รายการใหม่
            </Button>
          </Group>
        </Card.Section>
        <Grid mt="sm">
          <Grid.Col>
            <TextInput label="งานซ่อม" placeholder="กรอกชื่องานซ่อม" required />
          </Grid.Col>
        </Grid>
        <Grid mt="sm">
          <Grid.Col span={layout}>
            <DropdownIssue
              issue={null}
              setIssue={() => console.log("test")}
              required={true}
              label="ประเภทงาน"
              placeholder="เลือกประเภทงาน"
              issue_type={"0"}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <DropdownIssue
              issue={null}
              setIssue={() => console.log("test")}
              issue_type={"1"}
            />
          </Grid.Col>
        </Grid>
        <Grid mt="md">
          <Grid.Col>
            <ModalEquipment />
          </Grid.Col>
        </Grid>
        <Grid mt="sm">
          <Grid.Col>
            <Textarea label="รายการอุปกรณ์" variant="filled" rows={5} />
          </Grid.Col>
        </Grid>
      </Card>
    </>
  );
}
