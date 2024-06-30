import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLoginProvider } from "@/hooks/login";
import { loginInitialValues, loginYup } from "@/validations/login.schema";
import type { ILoginFormType, ILoginProvider } from "@/types/ILogin";
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
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconLockFilled,
  IconUserFilled,
} from "@tabler/icons-react";

import AlertErrorDialog from "@/components/common/AlertErrorDialog";

import { WEBSITE_NAME } from "@/config";
import { useLoginStore } from "@/stores/useLoginStore";
import { jwtDecode } from "jwt-decode";

export default function LoginProvider() {
  const navigate = useNavigate();
  const mutationLogin = useLoginProvider();
  const loginStore = useLoginStore();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
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
        const userData: ILoginProvider = jwtDecode(user.token);
        loginStore.setFilter({
          ...loginStore,
          token: user.token,
          fullname: userData.name,
          image: userData.image,
        });
        navigate("/");
      } else {
        setShowAlert(true);
      }
    } catch (error) {
      await AlertErrorDialog({
        html: "ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง",
      });
    }
  };
  return (
    <>
      <LoadingOverlay visible={mutationLogin.isPending} />
      <Container w={"35rem"}>
        <Paper shadow="md" px={30} py={40} radius="md">
          <Title ta="center" c="gray.8">
            {WEBSITE_NAME}
          </Title>
          <Text ta="center" pb="md" mt="sm" size="lg" c="gray">
            สำหรับผู้ซ่อม
          </Text>
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
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <Button
              fullWidth
              mt="xl"
              loading={mutationLogin.isPending}
              color="pink"
              type="submit"
            >
              เข้าสู่ระบบ
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
}
