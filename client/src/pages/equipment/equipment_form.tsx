import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  Divider,
  FileButton,
  Grid,
  Group,
  InputWrapper,
  LoadingOverlay,
  NumberInput,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  IconCloudUpload,
  IconDeviceFloppy,
  IconPlus,
} from "@tabler/icons-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEquipment } from "@/hooks/equipment";
import {
  equipmentInitialValues,
  equipmentYup,
} from "@/validations/equipment.schema";
import { convertToNumberOrZero } from "@/utils/mynumber";
import { dateToText } from "@/utils/mydate";
import type { IEquipmentForm } from "@/types/IEquipment";
import DropdownCategory from "@/components/category/DropdownCategory";
import InputDate from "@/components/common/InputDate";
import PageHeader from "@/components/common/PageHeader";
import DropdownFaculty from "@/components/faculty/DropdownFaculty";
import DropdownFacultyUser from "@/components/faculty/DropdownFacultyUser";
import { useEquipmentSave } from "@/hooks/equipment/useEquipmentMutate";
import Swal from "sweetalert2";

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
    mode: "onChange",
    resolver: yupResolver(equipmentYup),
    defaultValues: equipmentInitialValues,
  });

  const mutationSave = useEquipmentSave();

  const onSubmit = async (formData: IEquipmentForm) => {
    const { data } = await mutationSave.mutateAsync(formData);
    try {
      if (data.result) {
        Swal.fire({
          icon: "success",
          title: "บันทึกข้อมูลสําเร็จ",
        }).then((results) => {
          if (results.isConfirmed) {
            navigate("/equipment");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "มีข้อมูลอยู่แล้วในระบบ ไม่สามารถบันทึกข้อมูลได้",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง",
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
            <TextInput
              label="รหัสอุปกรณ์"
              placeholder="กรอกรหัสอุปกรณ์"
              {...register("code")}
              error={errors.code?.message}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <TextInput
              label="ชื่ออุปกรณ์"
              placeholder="กรอกชื่ออุปกรณ์"
              required
              {...register("name")}
              error={errors.name?.message}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <TextInput
              label="ซีเรียลนัมเบอร์"
              placeholder="กรอกซีเรียลนัมเบอร์"
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
                  setValue("cate_id", value || "");
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
                  setValue("faculty_id", value || "");
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
                  setValue("user_id", value || "");
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
              placeholder="กรอกข้อมูลการรับประกัน"
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
          <Grid.Col span={layout}>
            <Controller
              name="image"
              control={control}
              render={({ field }) => {
                const handleSelectChange = (value: File | null) => {
                  field.onChange(value);
                };
                return (
                  <Group wrap="nowrap">
                    <FileButton
                      onChange={handleSelectChange}
                      accept="image/png,image/jpeg"
                    >
                      {(props) => (
                        <Button
                          leftSection={<IconCloudUpload size="1.5rem" />}
                          variant="outline"
                          {...props}
                        >
                          อัพโหลดรูปภาพ
                        </Button>
                      )}
                    </FileButton>
                    <Text>
                      {field.value instanceof File && field.value.name}
                    </Text>
                  </Group>
                );
              }}
            />
          </Grid.Col>
        </Grid>
        <Card.Section withBorder inheritPadding py="md" mt="lg">
          <Group justify="center">
            <Button size="lg" color="gray" onClick={() => navigate("/user")}>
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
      </Card>
    </>
  );
}
