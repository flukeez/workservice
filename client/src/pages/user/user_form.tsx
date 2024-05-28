import PageHeader from "@/components/common/PageHeader";
import { useUser, useUserSave } from "@/hooks/user";
import { convertToNumberOrZero } from "@/utils/mynumber";
import {
  Button,
  Card,
  Divider,
  Grid,
  Group,
  InputWrapper,
  Select,
  TextInput,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

const listItems = [
  { title: "รายชื่อผู้ใช้", href: "/user" },
  { title: "ข้อมูลผู้ใช้", href: "#" },
];
const layout = {
  md: 4,
  sm: 6,
  xs: 12,
};
export default function UserForm() {
  const navigate = useNavigate();
  const params = useParams();
  const id = convertToNumberOrZero(params.id);
  const { data, isLoading } = useUser(id);
  const mutation = useUserSave();

  const [title, setTitle] = useState("");
  const handleNew = () => {
    navigate("/user/new");
  };
  useEffect(() => {
    setTitle(id ? "(รายละเอียด)" : "(เพิ่ม)");
  }, [id]);
  return (
    <>
      <PageHeader title={"ข้อมูลผู้ใช้ " + title} listItems={listItems} />
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="md">
          <Group justify="right">
            <Button
              color="green"
              leftSection={<IconPlus />}
              onClick={handleNew}
            >
              เพิ่มข้อมูล
            </Button>
          </Group>
        </Card.Section>
        <Grid mt="sm">
          <Grid.Col span={layout}>
            <TextInput
              label="เลขบัตรประชาชน"
              placeholder="กรอกเลขบัตรประชาชน"
              required
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <TextInput label="ชื่อจริง" placeholder="กรอกชื่อจริง" required />
          </Grid.Col>
          <Grid.Col span={layout}>
            <TextInput label="นามสกุล" placeholder="กรอกนามสกุล" required />
          </Grid.Col>
          <Grid.Col span={layout}>
            <TextInput label="ชื่อเล่น" placeholder="กรอกชื่อเล่น" />
          </Grid.Col>
          <Grid.Col span={layout}>
            <Select
              label="เพศ"
              placeholder="เลือกเพศ"
              data={[
                { value: "1", label: "ชาย" },
                { value: "2", label: "หญิง" },
                { value: "3", label: "ไม่ระบุ" },
              ]}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <InputWrapper label="วัน/เดือน/ปีเกิด">
              <TextInput placeholder="วัน/เดือน/ปีเกิด" />
            </InputWrapper>
          </Grid.Col>
          <Divider my="xs" label="ข้อมูลการติดต่อ" labelPosition="left" />
        </Grid>
      </Card>
    </>
  );
}
