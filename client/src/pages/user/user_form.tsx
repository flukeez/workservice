import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Button,
  Card,
  Divider,
  FileButton,
  Grid,
  Group,
  Image,
  InputWrapper,
  LoadingOverlay,
  PasswordInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  IconCloudUpload,
  IconDeviceFloppy,
  IconPlus,
} from "@tabler/icons-react";
import DropdownAmphure from "@/components/common/DropdownAmphure";
import DropdownProvince from "@/components/common/DropdownProvince";
import DropdownTumbol from "@/components/common/DropdownTumbol";
import InputDate from "@/components/common/InputDate";
import PageHeader from "@/components/common/PageHeader";
import PasswordTooltip from "@/components/user/PasswordTooltip";
import { checkThaiID } from "@/utils/checkThaiID";
import { convertToNumberOrZero } from "@/utils/mynumber";
import { yupResolver } from "@hookform/resolvers/yup";
import { userInitialValues, userYup } from "@/validations/user.schema";
import { useUser, useUserSave } from "@/hooks/user";
import { useImage } from "@/hooks/image";
import type { IUserForm } from "@/types/IUser";
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
    mode: "onChange",
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
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เลขบัตรประชาชนไม่ถูกต้อง",
      });
      return;
    }
    const { data } = await mutationSave.mutateAsync(formData);
    try {
      if (data.result) {
        Swal.fire({
          icon: "success",
          title: "บันทึกข้อมูลสําเร็จ",
        }).then((results) => {
          if (results.isConfirmed) {
            navigate("/user");
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
              {...register("username")}
              error={errors.username?.message}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <PasswordInput
              label={
                <Group>
                  <Text>รหัสผ่าน</Text>
                  {id ? (
                    <PasswordTooltip />
                  ) : (
                    <Text fw={500} color="red">
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
        <Divider
          size="xs"
          mt="md"
          labelPosition="left"
          label={
            <Text size="lg" c="dimmed">
              รูปประจำตัว
            </Text>
          }
        />
        <Grid mt="sm">
          <Grid.Col>
            <Group align="flex-end">
              {imageFile.data instanceof Blob && (
                <Stack>
                  <Text>รูปประจำตัวเดิม</Text>
                  <Image
                    radius="md"
                    h={200}
                    w="auto"
                    src={URL.createObjectURL(imageFile.data)}
                  />
                </Stack>
              )}
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
                            อัพโหลดรูปประจำตัว
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
            </Group>
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
