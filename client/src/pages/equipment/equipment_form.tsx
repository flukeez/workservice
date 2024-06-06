import DropdownCategory from "@/components/category/DropdownCategory";
import InputDate from "@/components/common/InputDate";
import PageHeader from "@/components/common/PageHeader";
import { useEquipment } from "@/hooks/equipment";
import { convertToNumberOrZero } from "@/utils/mynumber";
import {
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  InputWrapper,
  LoadingOverlay,
  NumberInput,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const listItems = [
  { title: "รายอุปกรณ์", href: "/user" },
  { title: "ข้อมูลอุปกรณ์", href: "#" },
];

const layout = {
  md: 4,
  sm: 6,
  xs: 12,
};

export default function EquipmentForm() {
  const navigate = useNavigate();
  const params = useParams();
  const id = convertToNumberOrZero(params.id);
  const { data, isLoading, setFilter } = useEquipment(id);
  const [title, setTitle] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [warrantyStart, setWarrantyStart] = useState("");
  const [warrantyEnd, setWarrantyEnd] = useState("");

  const handleNew = () => {
    navigate("/equipment/create");
  };
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  useEffect(() => {
    setTitle(id ? "(รายละเอียด)" : "(เพิ่ม)");
  }, [id]);
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <PageHeader title={"ข้อมูลอุปกรณ์ " + title} listItems={listItems} />
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
        <Divider
          size="xs"
          mt="md"
          labelPosition="left"
          label={
            <Text size="lg" c="dimmed">
              ข้อมูลพื้นฐาน
            </Text>
          }
        />
        <Grid mt="sm">
          <Grid.Col span={layout}>
            <TextInput label="รหัสอุปกรณ์" placeholder="กรอกรหัสอุปกรณ์" />
          </Grid.Col>
          <Grid.Col span={layout}>
            <TextInput
              label="ชื่ออุปกรณ์"
              placeholder="กรอกชื่ออุปกรณ์"
              required
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <TextInput
              label="ซีเรียลนัมเบอร์"
              placeholder="กรอกซีเรียลนัมเบอร์"
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <Controller
              name="cate_id"
              control={control}
              render={({ field }) => {
                const handleSelectChange = (value: string | null) => {
                  field.onChange(value || "");
                };
                return (
                  <DropdownCategory
                    label="หมวดหมู่อุปกรณ์"
                    category={field.value}
                    setCategory={handleSelectChange}
                  />
                );
              }}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => {
                return (
                  <NumberInput
                    {...field}
                    label="ราคา"
                    hideControls
                    decimalScale={2}
                    fixedDecimalScale
                    required
                    min={0}
                    placeholder="กรอกราคาอุปกรณ์"
                    thousandSeparator=","
                    rightSectionWidth={60}
                    rightSection={
                      <Badge color="gray" variant="light" radius="sm" size="lg">
                        บาท
                      </Badge>
                    }
                    rightSectionPointerEvents="none"
                    styles={{ input: { textAlign: "right" } }}
                    // error={errors.price?.message}
                  />
                );
              }}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <InputWrapper label="วันเริ่มต้นใช้งาน">
              <InputDate
                textValue={dateStart}
                onChangeText={(value: string) => [setDateStart(value)]}
              />
            </InputWrapper>
          </Grid.Col>
          <Grid.Col>
            <Textarea rows={3} label="รายละเอียด" />
          </Grid.Col>
        </Grid>
        <Divider
          size="xs"
          mt="md"
          labelPosition="left"
          label={
            <Text size="lg" c="dimmed">
              ผู้รับผิดชอบ
            </Text>
          }
        />
      </Card>
    </>
  );
}
