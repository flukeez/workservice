import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Controller, useForm } from "react-hook-form";
import { useProvider, useProviderSave } from "@/hooks/provider";
import {
  providerInitialValues,
  providerYup,
} from "@/validations/provider.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import type { IProviderForm } from "@/types/IProvider";

import {
  Button,
  Card,
  Grid,
  Group,
  LoadingOverlay,
  PasswordInput,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";

import AlertErrorDialog from "@/components/common/AlertErrorDialog";
import AlertSuccessDialog from "@/components/common/AlertSuccessDialog";
import ButtonFileUpload from "@/components/common/ButtonFileUpload";
import ButtonNew from "@/components/common/ButtonNew";
import DividerLabel from "@/components/common/DividerLabel";
import DropdownAmphure from "@/components/common/DropdownAmphure";
import DropdownProvince from "@/components/common/DropdownProvince";
import DropdownTumbol from "@/components/common/DropdownTumbol";
import ImagePreview from "@/components/common/ImagePreview";
import PageHeader from "@/components/common/PageHeader";
import DropdownIssueMultiple from "@/components/issue/DropdownIssueMultiple";
import PasswordTooltip from "@/components/user/PasswordTooltip";

import { convertToNumberOrZero } from "@/utils/mynumber";

const layout = {
  md: 4,
  sm: 6,
  xs: 12,
};

const listItems = [
  { title: "รายชื่อผู้ซ่อม", href: "/provider" },
  { title: "ข้อมูลผู้ซ่อม", href: "#" },
];
export default function ProviderForm() {
  const navigate = useNavigate();
  const params = useParams();
  const id = convertToNumberOrZero(params.id);
  const { data, isLoading, setFilter } = useProvider(id);
  const mutationSave = useProviderSave();

  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(providerYup),
    defaultValues: providerInitialValues,
  });

  const [title, setTitle] = useState("");

  const onSubmit = async (formData: IProviderForm) => {
    try {
      const { data } = await mutationSave.mutateAsync(formData);
      if (data.result) {
        const isConfirmed = await AlertSuccessDialog({
          title: "บันทึกข้อมูลสำเร็จ",
        });
        if (isConfirmed) navigate("/provider");
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
    setFilter(0);
    navigate("/provider/new");
  };
  useEffect(() => {
    setTitle(id ? "(รายละเอียด)" : "(เพิ่ม)");
  }, [id]);

  useEffect(() => {
    if (data && data.result) {
      reset(data.result);
    } else {
      reset(providerInitialValues);
    }
  }, [data]);

  return (
    <>
      <PageHeader title={"ข้อมูลผู้ซ่อม " + title} listItems={listItems} />
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="md">
          <Group justify="right">
            <ButtonNew onClick={() => handleNew()}>เพิ่มข้อมูล</ButtonNew>
          </Group>
        </Card.Section>
        <LoadingOverlay visible={isLoading || mutationSave.isPending} />
        <DividerLabel label="ข้อมูลพื้นฐาน" />
        <Grid mt="sm">
          <Grid.Col span={12}>
            <TextInput
              label="ชื่อผู้ซ่อม"
              placeholder="ชื่อผู้ซ่อม"
              withAsterisk
              {...register("name")}
              error={errors.name?.message}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              rows={4}
              label="คำอธิบาย"
              placeholder="คำอธิบาย"
              {...register("details")}
              error={errors.details?.message}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="ที่อยู่"
              rows={3}
              placeholder="กรอกที่อยู่"
              withAsterisk
              {...register("address")}
              error={errors.address?.message}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <Controller
              name="province_id"
              control={control}
              render={({ field }) => {
                const handleSelectChange = (value: string | null) => {
                  field.onChange(value || "");
                  setValue("amphure_id", "");
                  setValue("tumbol_id", "");
                };
                return (
                  <DropdownProvince
                    province={field.value}
                    setProvince={handleSelectChange}
                    require={true}
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
                  setValue("tumbol_id", "");
                  field.onChange(value || "");
                };
                return (
                  <DropdownAmphure
                    amphure={field.value}
                    setAmphure={handleSelectChange}
                    province={watch("province_id") || ""}
                    require={true}
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
                    require={true}
                  />
                );
              }}
            />
          </Grid.Col>
        </Grid>
        <DividerLabel label="ประเภทงานที่ถนัด" />
        <Grid mt="sm">
          <Grid.Col span={12}>
            <Controller
              name="issue_id"
              control={control}
              render={({ field }) => {
                const handleSelectChange = (value: string[] | undefined) => {
                  if (value && value.length >= 6) {
                    AlertErrorDialog({
                      html: "เลือกได้ไม่เกิน 5 ประเภทงาน",
                    });
                    return;
                  }
                  field.onChange(value);
                };
                return (
                  <DropdownIssueMultiple
                    issue={field.value}
                    setIssue={handleSelectChange}
                    label="ประเภทงานที่ถนัด"
                    placeholder="เลือกประเภทงานที่ถนัด"
                    error={errors.issue_id?.message}
                  />
                );
              }}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              rows={3}
              label="รายละเอียด"
              placeholder="กรอกรายละเอียด"
            />
          </Grid.Col>
        </Grid>
        <DividerLabel label="ข้อมูลการติดต่อ" />
        <Grid mt="sm">
          <Grid.Col span={layout}>
            <TextInput
              label="เบอร์โทรศัพท์"
              placeholder="กรอกเบอร์โทรศัพท์"
              {...register("phone")}
              error={errors.phone?.message}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <TextInput
              label="อีเมล"
              placeholder="กรอกอีเมล"
              {...register("email")}
              error={errors.email?.message}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <TextInput
              label="ไลน์ไอดี"
              placeholder="กรอกไลน์ไอดี"
              {...register("line")}
              error={errors.line?.message}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <TextInput
              label="LINE Token"
              placeholder="กรอก LINE Token"
              {...register("line_token")}
              error={errors.line_token?.message}
            />
          </Grid.Col>
        </Grid>
        <DividerLabel label="ข้อมูลเข้าใช้งาน" />
        <Grid mt="sm">
          <Grid.Col span={layout}>
            <TextInput
              label="ชื่อผู้ใช้"
              placeholder="กรอกชื่อผู้ใช้"
              required
              {...register("username")}
              error={errors.username?.message}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <PasswordInput
              label={
                <Group justify="left" gap="xs">
                  <Text size="sm">รหัสผ่าน</Text>
                  {id ? (
                    <PasswordTooltip />
                  ) : (
                    <Text fw={500} size="sm" c="red">
                      *
                    </Text>
                  )}
                </Group>
              }
              placeholder="กรอกรหัสผ่าน"
              {...register("password")}
              error={errors.password?.message}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <PasswordInput
              label="ยืนยันรหัสผ่าน"
              placeholder="กรอกรหัสผ่าน"
              required={!id}
              {...register("con_password")}
              error={errors.con_password?.message}
            />
          </Grid.Col>
        </Grid>
        <DividerLabel label="รูปประจำตัว" />
        <Grid mt="sm">
          {watch("image") && (
            <Grid.Col span={layout}>
              <ImagePreview folder="provider" image={watch("image")} />
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
              onClick={() => navigate("/provider")}
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
      </Card>
    </>
  );
}
