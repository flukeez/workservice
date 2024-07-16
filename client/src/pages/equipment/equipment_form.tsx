import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { IconDeviceFloppy } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { useEquipment, useEquipmentSave } from "@/hooks/equipment";
import {
  equipmentInitialValues,
  equipmentYup,
} from "@/validations/equipment.schema";

import { convertToNumberOrZero } from "@/utils/mynumber";
import { dateToText } from "@/utils/mydate";

import DropdownCategory from "@/components/category/DropdownCategory";
import InputDate from "@/components/common/InputDate";
import PageHeader from "@/components/common/PageHeader";
import DropdownFaculty from "@/components/faculty/DropdownFaculty";
import DropdownFacultyUser from "@/components/faculty/DropdownFacultyUser";
import ImagePreview from "@/components/common/ImagePreview";
import ButtonFileUpload from "@/components/common/ButtonFileUpload";
import type { IEquipmentForm } from "@/types/IEquipment";
import ButtonNew from "@/components/common/ButtonNew";
import AlertSuccessDialog from "@/components/common/AlertSuccessDialog";
import AlertErrorDialog from "@/components/common/AlertErrorDialog";

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
  const [warrantyStart, setWarrantyStart] = useState("");
  const [warrantyEnd, setWarrantyEnd] = useState("");

  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(equipmentYup),
    defaultValues: equipmentInitialValues,
  });

  const mutationSave = useEquipmentSave();

  const onSubmit = async (formData: IEquipmentForm) => {
    try {
      const { data } = await mutationSave.mutateAsync(formData);
      if (data.result) {
        const isConfirmed = await AlertSuccessDialog({
          title: "บันทึกข้อมูลสำเร็จ",
        });
        if (isConfirmed) navigate("/equipment");
      } else {
        await AlertErrorDialog({
          html: "มีข้อมูลอยู่แล้วในระบบ ไม่สามารถบันทึกข้อมูลได้",
        });
      }
    } catch (error) {
      console.error(error);
      await AlertErrorDialog({
        html: "บันทึกข้อมูลไม่สำเร็จ ให้ลองออกจากระบบ แล้วเข้าสู่ระบบใหม่",
      });
    }
  };
  const handleNew = () => {
    navigate("/equipment/create");
    setFilter(0);
  };
  useEffect(() => {
    setTitle(id ? "(รายละเอียด)" : "(เพิ่ม)");
  }, [id]);

  useEffect(() => {
    if (data && data.result) {
      reset(data.result);
      setDateStart(dateToText(data.result.date_start));
      setWarrantyStart(dateToText(data.result.warranty_start));
      setWarrantyEnd(dateToText(data.result.warranty_end));
    } else {
      reset(equipmentInitialValues);
      setDateStart("");
      setWarrantyStart("");
      setWarrantyEnd("");
    }
  }, [data]);
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <PageHeader title={"ข้อมูลอุปกรณ์ " + title} listItems={listItems} />
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="md">
          <Group justify="right">
            <ButtonNew onClick={handleNew}>เพิ่มข้อมูล</ButtonNew>
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
        <form onSubmit={handleSubmit((formData) => onSubmit(formData))}>
          <Grid mt="sm">
            <Grid.Col span={layout}>
              <TextInput
                label="รหัสอุปกรณ์"
                {...register("code")}
                error={errors.code?.message}
                withAsterisk
              />
            </Grid.Col>
            <Grid.Col span={layout}>
              <TextInput
                label="ชื่ออุปกรณ์"
                required
                {...register("name")}
                error={errors.name?.message}
              />
            </Grid.Col>
            <Grid.Col span={layout}>
              <TextInput
                label="ซีเรียลนัมเบอร์"
                {...register("serial")}
                error={errors.serial?.message}
              />
            </Grid.Col>
            <Grid.Col span={layout}>
              <Controller
                name="cate_id"
                control={control}
                render={({ field }) => {
                  const handleSelectChange = (value: string | null) => {
                    field.onChange(value);
                  };
                  return (
                    <DropdownCategory
                      label="หมวดหมู่อุปกรณ์"
                      category={field.value}
                      setCategory={handleSelectChange}
                      error={errors.cate_id?.message}
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
                      thousandSeparator=","
                      rightSectionWidth={60}
                      rightSection={
                        <Badge
                          color="gray"
                          variant="light"
                          radius="sm"
                          size="lg"
                        >
                          บาท
                        </Badge>
                      }
                      rightSectionPointerEvents="none"
                      styles={{ input: { textAlign: "right" } }}
                      error={errors.price?.message}
                    />
                  );
                }}
              />
            </Grid.Col>
            <Grid.Col span={layout}>
              <InputWrapper label="วันเริ่มต้นใช้งาน" required>
                <InputDate
                  textValue={dateStart}
                  onChangeText={(value: string) => [
                    setDateStart(value),
                    setValue("date_start", value),
                  ]}
                  isError={errors.date_start?.message}
                />
              </InputWrapper>
            </Grid.Col>
            <Grid.Col>
              <Textarea
                rows={3}
                label="รายละเอียด"
                {...register("details")}
                error={errors.details?.message}
              />
            </Grid.Col>
          </Grid>
          <Divider
            size="xs"
            mt="md"
            labelPosition="left"
            label={
              <Text size="lg" c="dimmed">
                ผู้ดูแล
              </Text>
            }
          />
          <Grid mt="sm">
            <Grid.Col span={layout}>
              <Controller
                name="faculty_id"
                control={control}
                render={({ field }) => {
                  const handleSelectChange = (value: string | null) => {
                    field.onChange(value || "");
                    setValue("user_id", "");
                  };
                  return (
                    <DropdownFaculty
                      label="หน่วยงาน"
                      faculty={field.value}
                      setFaculty={handleSelectChange}
                      error={errors.faculty_id?.message}
                    />
                  );
                }}
              />
            </Grid.Col>
            <Grid.Col span={layout}>
              <Controller
                name="user_id"
                control={control}
                render={({ field }) => {
                  const handleSelectChange = (value: string | null) => {
                    field.onChange(value || "");
                  };
                  return (
                    <DropdownFacultyUser
                      label="ผู้ดูแล"
                      user={field.value}
                      setUser={handleSelectChange}
                      faculty={watch("faculty_id") || "0"}
                      error={errors.user_id?.message}
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
                การรับประกัน
              </Text>
            }
          />
          <Grid mt="sm">
            <Grid.Col span={layout}>
              <TextInput
                label="การรับประกัน"
                {...register("warranty")}
                error={errors.warranty?.message}
              />
            </Grid.Col>
            <Grid.Col span={layout}>
              <InputWrapper label="วันเริ่มต้นการประกัน">
                <InputDate
                  textValue={warrantyStart}
                  onChangeText={(value: string) => [
                    setWarrantyStart(value),
                    setValue("warranty_start", value),
                  ]}
                />
              </InputWrapper>
            </Grid.Col>
            <Grid.Col span={layout}>
              <InputWrapper label="วันสิ้นสุดการประกัน">
                <InputDate
                  textValue={warrantyEnd}
                  onChangeText={(value: string) => [
                    setWarrantyEnd(value),
                    setValue("warranty_end", value),
                  ]}
                />
              </InputWrapper>
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
          <Grid mt="sm">
            {watch("image") && (
              <Grid.Col span={layout}>
                <ImagePreview folder="equipment" image={watch("image")} />
              </Grid.Col>
            )}
            <Grid.Col span={layout}>
              <Controller
                name="image"
                control={control}
                render={({ field }) => {
                  const handleSelectChange = (value: File | null) => {
                    field.onChange(value);
                  };
                  const handleDelete = () => {
                    handleSelectChange(null);
                  };
                  return (
                    <ButtonFileUpload
                      file={field.value}
                      setFile={handleSelectChange}
                      setDelete={handleDelete}
                    />
                  );
                }}
              />
            </Grid.Col>
          </Grid>
          <Card.Section withBorder inheritPadding py="md" mt="lg">
            <Group justify="center">
              <Button
                size="lg"
                color="gray"
                onClick={() => navigate("/equipment")}
              >
                ยกเลิก
              </Button>
              <Button
                leftSection={<IconDeviceFloppy />}
                size="lg"
                onClick={handleSubmit(onSubmit)}
              >
                บันทึกข้อมูล
              </Button>
            </Group>
          </Card.Section>
        </form>
      </Card>
    </>
  );
}
