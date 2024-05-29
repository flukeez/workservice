import DropdownAmphure from "@/components/common/DropdownAmphure";
import DropdownProvince from "@/components/common/DropdownProvince";
import DropdownTumbol from "@/components/common/DropdownTumbol";
import PageHeader from "@/components/common/PageHeader";
import { useUser, useUserSave } from "@/hooks/user";
import { convertToNumberOrZero } from "@/utils/mynumber";
import { userYup } from "@/validations/user.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Card,
  Divider,
  Grid,
  Group,
  InputWrapper,
  PasswordInput,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

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
  const { control, register, watch, setValue } = useForm({
    mode: "onChange",
    resolver: yupResolver(userYup),
  });
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
              {...register("id_card")}
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
          <Grid.Col span={12}>
            <Textarea label="ที่อยู่" rows={3} placeholder="กรอกที่อยู่" />
          </Grid.Col>
          <Grid.Col span={layout}>
            <Controller
              name="province_id"
              control={control}
              render={({ field }) => {
                const handleSelectChange = (value: string | null) => {
                  field.onChange(value || "");
                  setValue("amphure_id", value || "");
                };
                return (
                  <DropdownProvince
                    province={field.value}
                    setProvince={handleSelectChange}
                  />
                );
              }}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <Controller
              name="amphure_id"
              control={control}
              render={({ field }) => {
                const handleSelectChange = (value: string | null) => {
                  console.log("test");
                  field.onChange(value || "");
                };
                return (
                  <DropdownAmphure
                    amphure={field.value}
                    setAmphure={handleSelectChange}
                    province={watch("province_id") || ""}
                  />
                );
              }}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <Controller
              name="tumbol_id"
              control={control}
              render={({ field }) => {
                const handleSelectChange = (value: string | null) => {
                  field.onChange(value || "");
                };
                return (
                  <DropdownTumbol
                    tumbol={field.value}
                    setTumbol={handleSelectChange}
                    amphure={watch("amphure_id") || ""}
                  />
                );
              }}
            />
          </Grid.Col>
        </Grid>
        <Divider
          size="xs"
          mt="md"
          labelPosition="left"
          label={
            <Text size="lg" c="dimmed">
              ข้อมูลการติดต่อ
            </Text>
          }
        />
        <Grid mt="sm">
          <Grid.Col span={layout}>
            <TextInput label="เบอร์โทรศัพท์" placeholder="กรอกเบอร์โทรศัพท์" />
          </Grid.Col>
          <Grid.Col span={layout}>
            <TextInput label="อีเมล" placeholder="กรอกอีเมล" />
          </Grid.Col>
          <Grid.Col span={layout}>
            <TextInput label="ไลน์ไอดี" placeholder="กรอกไลน์ไอดี" />
          </Grid.Col>
          <Grid.Col span={layout}>
            <TextInput label="LINE Token" placeholder="กรอก LINE Token" />
          </Grid.Col>
        </Grid>
        <Divider
          size="xs"
          mt="md"
          labelPosition="left"
          label={
            <Text size="lg" c="dimmed">
              ข้อมูลเข้าใช้งาน
            </Text>
          }
        />
        <Grid mt="sm">
          <Grid.Col span={layout}>
            <TextInput
              label="ชื่อผู้ใช้"
              placeholder="กรอกชื่อผู้ใช้"
              required
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <PasswordInput
              label="รหัสผ่าน"
              placeholder="กรอกรหัสผ่าน"
              required
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <PasswordInput
              label="ยืนยันรหัสผ่าน"
              placeholder="กรอกรหัสผ่าน"
              required
            />
          </Grid.Col>
        </Grid>
      </Card>
    </>
  );
}
