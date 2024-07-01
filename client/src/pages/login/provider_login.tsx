import AlertErrorDialog from "@/components/common/AlertErrorDialog";
import { WEBSITE_NAME } from "@/config";
import { useLoginProvider } from "@/hooks/login";
import { useLoginStore } from "@/stores/useLoginStore";
import { ILoginFormType, ILoginProvider } from "@/types/ILogin";
import { loginInitialValues, loginYup } from "@/validations/login.schema";
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
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconLockFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function ProviderLogin() {
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
      console.error(error);
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
          <Text size="lg" ta="center" pt="sm" pb="lg" c="gray">
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
            color="pink"
            onClick={handleSubmit(onSubmit)}
          >
            เข้าสู่ระบบ
          </Button>
        </Paper>
      </Container>
    </>
  );
}
