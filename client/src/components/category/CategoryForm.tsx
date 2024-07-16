import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Group,
  LoadingOverlay,
  Stack,
  TextInput,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCategory, useCategorySave } from "@/hooks/category";
import {
  categoryInitialValues,
  categoryYup,
} from "@/validations/category.schema";
import type { ICategoryForm } from "@/types/ICategory";

import AlertSuccessDialog from "../common/AlertSuccessDialog";
import AlertErrorDialog from "../common/AlertErrorDialog";
import ButtonSave from "../common/ButtonSave";

interface CategoryFormProps {
  onClose: () => void;
  id: string;
}
export default function CategoryForm({ onClose, id }: CategoryFormProps) {
  const { data, isLoading } = useCategory(id);
  const mutationSave = useCategorySave();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(categoryYup),
    defaultValues: categoryInitialValues,
  });
  const [showAlert, setShowAlert] = useState(false);
  const onSubmit: SubmitHandler<ICategoryForm> = async (formData) => {
    setShowAlert(false);

    try {
      const { data } = await mutationSave.mutateAsync(formData);
      if (!data.result) {
        setShowAlert(true);
        return true;
      }

      const isConfirmed = await AlertSuccessDialog({
        title: "บันทึกข้อมูลสำเร็จ",
      });
      if (isConfirmed) onClose();
    } catch (error) {
      await AlertErrorDialog({
        html: "บันทึกข้อมูลไม่สำเร็จ ให้ลองออกจากระบบ แล้วเข้าสู่ระบบใหม่",
      });
    }
  };

  useEffect(() => {
    if (data && data.result) {
      reset(data.result);
    }
  }, [data]);
  return (
    <>
      <LoadingOverlay visible={isLoading || mutationSave.isPending} />
      {showAlert && (
        <Alert
          variant="light"
          color="red"
          title="ไม่สามารถบันทึกข้อมูลได้"
          icon={<IconAlertCircle />}
          mb="sm"
        >
          รหัส <b>{getValues("code")}</b> มีแล้วในะรบบ ! กรุณาเปลี่ยนใหม่
        </Alert>
      )}
      <form onSubmit={handleSubmit((formData) => onSubmit(formData))}>
        <Stack>
          <TextInput
            label="รหัสประเภทอุปกรณ์"
            {...register("code")}
            error={errors.code?.message}
            withAsterisk
          />
          <TextInput
            label="ชื่อประเภทอุปกรณ์"
            {...register("name")}
            error={errors.name?.message}
            withAsterisk
          />

          <Group justify="right" mt={20}>
            <Button color="gray" onClick={onClose}>
              ยกเลิก
            </Button>
            <ButtonSave loading={mutationSave.isPending} />
          </Group>
        </Stack>
      </form>
    </>
  );
}
