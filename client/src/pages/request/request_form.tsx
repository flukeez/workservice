import PageHeader from "@/components/common/PageHeader";
import ModalEquipment from "@/components/equipment/ModalEquipment";
import DropdownIssue from "@/components/issue/DropdownIssue";
import DropdownPriority from "@/components/priority/DropdownPriority";
import type { IRequest } from "@/types/IRequest";
import { requestYup } from "@/validations/request.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";

const title = "แจ้งซ่อม";
const listItems = [{ title: title, href: "#" }];
const layout = {
  md: 4,
  sm: 6,
  xs: 12,
};
export default function RequestForm() {
  const handleNew = () => {};
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
    resolver: yupResolver(requestYup),
  });

  const onSubmit = (formData: IRequest) => {
    console.log(formData);
  };
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
            <TextInput
              label="งานซ่อม"
              placeholder="กรอกชื่องานซ่อม"
              required
              {...register("name")}
              error={errors.name?.message}
            />
          </Grid.Col>
        </Grid>
        <Grid mt="sm">
          <Grid.Col span={layout}>
            <Controller
              name="issue_id"
              control={control}
              render={({ field }) => {
                const handleSelectChange = (value: string | null) => {
                  field.onChange(value);
                  setValue("issue_sub_id", "");
                };
                return (
                  <DropdownIssue
                    issue={field.value}
                    setIssue={handleSelectChange}
                    required={true}
                    label="ประเภทงาน"
                    placeholder="เลือกประเภทงาน"
                    issue_type={"0"}
                    error={errors.issue_id?.message}
                  />
                );
              }}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <Controller
              name="issue_sub_id"
              control={control}
              render={({ field }) => {
                const handleSelectChange = (value: string | null) => {
                  field.onChange(value);
                };
                return (
                  <DropdownIssue
                    issue={field.value}
                    setIssue={handleSelectChange}
                    issue_type={"1"}
                    error={errors.issue_sub_id?.message}
                    issue_id={watch("issue_id")}
                    keys={"issue_sub_id" + watch("issue_id")}
                  />
                );
              }}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <Controller
              name="priority_id"
              control={control}
              render={({ field }) => {
                const handleSelectChange = (value: string | null) => {
                  field.onChange(value);
                };
                return (
                  <DropdownPriority
                    priority={field.value}
                    setPriority={handleSelectChange}
                    required={true}
                  />
                );
              }}
            />
          </Grid.Col>
        </Grid>
        <Grid mt="md">
          <Grid.Col>
            <Controller
              name="equip_id"
              control={control}
              render={({ field }) => {
                const handleSelectChange = (value: string[] | null) => {
                  field.onChange(value);
                };
                return (
                  <ModalEquipment
                    equip={field.value}
                    setEquip={handleSelectChange}
                  />
                );
              }}
            />
          </Grid.Col>
        </Grid>
        <Grid mt="md">
          <Grid.Col>
            <Textarea label="รายการอุปกรณ์" variant="filled" rows={5} />
          </Grid.Col>
        </Grid>
        <Grid mt="md">
          <Grid.Col>
            <Textarea label="หมายเหตุ" rows={3} />
          </Grid.Col>
        </Grid>
        <Divider
          size="xs"
          mt="md"
          labelPosition="left"
          label={
            <Text size="lg" c="dimmed">
              รูปภาพ
            </Text>
          }
        />
        <Card.Section withBorder inheritPadding py="md" mt="lg">
          <Group justify="center">
            <Button
              size="lg"
              color="gray"
              // onClick={() => navigate("/equipment")}
            >
              ยกเลิก
            </Button>
            <Button
              leftSection={<IconDeviceFloppy />}
              size="lg"
              // onClick={handleSubmit(onSubmit)}
            >
              บันทึกข้อมูล
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </>
  );
}
