import { useEffect, useState } from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useUser, useUserSave } from "@/hooks/user";
import { useImage } from "@/hooks/image";
import { yupResolver } from "@hookform/resolvers/yup";
import { userInitialValues, userYup } from "@/validations/user.schema";
import type { IUserForm } from "@/types/IUser";

import { useNavigate, useParams } from "react-router-dom";

import {
  Button,
  Card,
  Grid,
  Group,
  InputWrapper,
  LoadingOverlay,
  PasswordInput,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";

import DropdownAmphure from "@/components/common/DropdownAmphure";
import DropdownProvince from "@/components/common/DropdownProvince";
import DropdownTumbol from "@/components/common/DropdownTumbol";
import InputDate from "@/components/common/InputDate";
import PageHeader from "@/components/common/PageHeader";
import ImagePreview from "@/components/common/ImagePreview";
import ButtonFileUpload from "@/components/common/ButtonFileUpload";
import AlertErrorDialog from "@/components/common/AlertErrorDialog";
import AlertSuccessDialog from "@/components/common/AlertSuccessDialog";
import ButtonNew from "@/components/common/ButtonNew";
import DividerLabel from "@/components/common/DividerLabel";

import PasswordTooltip from "@/components/user/PasswordTooltip";
import { checkThaiID } from "@/utils/checkThaiID";
import { convertToNumberOrZero } from "@/utils/mynumber";
import { dateToText } from "@/utils/mydate";

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
  const { data, isLoading, setFilter } = useUser(id);
  const imageFile = useImage("user", "");
  const mutationSave = useUserSave();
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userYup),
    defaultValues: userInitialValues,
  });
  const [title, setTitle] = useState("");
  const [birthday, setBirthday] = useState("");
  const handleNew = () => {
    navigate("/user/new");
    setFilter(0);
    imageFile.setFilter("");
  };

  const onSubmit: SubmitHandler<IUserForm> = async (formData) => {
    const id_card = checkThaiID(formData.id_card);
    if (!id_card) {
      await AlertErrorDialog({
        html: "เลขบัตรประชาชนไม่ถูกต้อง",
      });
      return;
    }
    try {
      const { data } = await mutationSave.mutateAsync(formData);
      if (data.result) {
        const isConfirmed = await AlertSuccessDialog({
          title: "บันทึกข้อมูลสำเร็จ",
        });
        if (isConfirmed) navigate("/user");
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
  useEffect(() => {
    setTitle(id ? "(รายละเอียด)" : "(เพิ่ม)");
  }, [id]);

  useEffect(() => {
    if (data && data.result) {
      reset(data.result);
      imageFile.setFilter(data.result.image);
      setBirthday(dateToText(data.result.birthday));
    } else {
      reset(userInitialValues);
      setBirthday("");
    }
  }, [data]);

  return (
    <>
      <LoadingOverlay
        visible={isLoading || mutationSave.isPending || imageFile.isLoading}
      />
      <PageHeader title={"ข้อมูลผู้ใช้ " + title} listItems={listItems} />
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="md">
          <Group justify="right">
            <ButtonNew onClick={handleNew}>เพิ่มข้อมูล</ButtonNew>
          </Group>
        </Card.Section>
        <DividerLabel label="ข้อมูลพื้นฐาน" />
        <Grid mt="sm">
          <Grid.Col span={layout}>
            <TextInput
              label="เลขบัตรประชาชน"
              placeholder="กรอกเลขบัตรประชาชน"
              required
              {...register("id_card")}
              error={errors.id_card?.message}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <TextInput
              label="ชื่อจริง"
              placeholder="กรอกชื่อจริง"
              required
              {...register("firstname")}
              error={errors.firstname?.message}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <TextInput
              label="นามสกุล"
              placeholder="กรอกนามสกุล"
              required
              {...register("surname")}
              error={errors.surname?.message}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <TextInput
              label="ชื่อเล่น"
              placeholder="กรอกชื่อเล่น"
              {...register("nickname")}
              error={errors.nickname?.message}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <Controller
              name="sex"
              control={control}
              render={({ field }) => {
                const handleSelectChange = (value: string | null) => {
                  field.onChange(value || "");
                };
                return (
                  <Select
                    {...field}
                    label="เพศ"
                    placeholder="เลือกเพศ"
                    data={[
                      { value: "1", label: "ชาย" },
                      { value: "2", label: "หญิง" },
                      { value: "3", label: "ไม่ระบุ" },
                    ]}
                    onChange={handleSelectChange}
                    clearable
                    error={errors.sex?.message}
                  />
                );
              }}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <InputWrapper label="วัน/เดือน/ปีเกิด">
              <InputDate
                textValue={birthday}
                onChangeText={(value: string) => [
                  setBirthday(value),
                  setValue("birthday", value),
                ]}
              />
            </InputWrapper>
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="ที่อยู่"
              rows={3}
              placeholder="กรอกที่อยู่"
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
        <DividerLabel label="ข้อมูลการติดต่อ" />
        <Grid mt="sm">
          <Grid.Col span={layout}>
            <TextInput
              label="เบอร์โทรศัพท์"
              placeholder="กรอกเบอร์โทรศัพท์"
              {...register("phone")}
              error={errors.phone?.message}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <TextInput
              label="อีเมล"
              placeholder="กรอกอีเมล"
              {...register("email")}
              error={errors.email?.message}
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
              <ImagePreview folder="user" image={watch("image")} />
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
