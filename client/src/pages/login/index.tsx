import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Space,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconLockFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import { useLogin } from "@/hooks/login";
import { useLoginStore } from "@/stores/useLoginStore";
import { loginInitialValues, loginYup } from "@/validations/login.schema";
import type { ILogin, ILoginFormType } from "@/types/ILogin";
import { WEBSITE_NAME } from "@/config";

export default function Login() {
  const navigate = useNavigate();
  const mutationLogin = useLogin();
  const loginStore = useLoginStore();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(loginYup),
    defaultValues: loginInitialValues,
  });
  const [showAlert, setShowAlert] = useState(false);

  const onSubmit = async (formData: ILoginFormType) => {
    try {
      const { data } = await mutationLogin.mutateAsync(formData);
      if (data.result) {
        const user = data.result;
        setShowAlert(false);
        const userData: ILogin = jwtDecode(user.token);
        loginStore.setFilter({
          ...loginStore,
          token: user.token,
          refresh_token: user.refresh_token,
          fullname: userData.firstname + " " + userData.surname,
          image: userData.image,
        });
        navigate("/");
        // Swal.fire({
        //   icon: "success",
        //   title: "เข้าสู่ระบบสําเร็จ",
        // }).then((results) => {
        //   if (results.isConfirmed) {
        //     navigate("/");
        //   }
        // });
      } else {
        setShowAlert(true);
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
  return (
    <>
      <LoadingOverlay visible={mutationLogin.isPending} />
      <Container w={"35rem"}>
        <Paper shadow="md" px={30} py={40} radius="md">
          <Title ta="center" pb="xl" c="gray.8">
            {WEBSITE_NAME}
          </Title>
          {showAlert ? (
            <Alert
              variant="light"
              color="red"
              title="ผิดพลาด"
              icon={<IconAlertCircle />}
              mb="sm"
            >
              ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง
            </Alert>
          ) : null}
          <Space h="xl" />
          <TextInput
            leftSection={<IconUserFilled size="1rem" />}
            placeholder="ชื่อผู้ใช้งาน"
            {...register("username")}
            error={errors.username?.message}
          />
          <PasswordInput
            mt="lg"
            leftSection={<IconLockFilled size="1rem" />}
            placeholder="รหัสผ่าน"
            {...register("password")}
            error={errors.password?.message}
          />
          <Group justify="space-between" mt="lg">
            <Checkbox label="จดจำฉันไว้" />
            <Anchor component="button" size="sm">
              ลืมรหัสผ่าน
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" onClick={handleSubmit(onSubmit)}>
            เข้าสู่ระบบ
          </Button>
        </Paper>
      </Container>
    </>
  );
}
