import { useEffect, useState } from "react";
import Swal from "sweetalert2";
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
    mode: "onChange",
    resolver: yupResolver(categoryYup),
    defaultValues: categoryInitialValues,
  });
  const [showAlert, setShowAlert] = useState(false);
  const onSubmit: SubmitHandler<ICategoryForm> = async (formData) => {
    const { data } = await mutationSave.mutateAsync(formData);
    try {
      if (data.result) {
        setShowAlert(false);
        Swal.fire({
          icon: "success",
          title: "บันทึกข้อมูลสําเร็จ",
        }).then((results) => {
          if (results.isConfirmed) {
            onClose();
          }
        });
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
          ข้อมูล
          <b>
            &nbsp;
            {getValues("code")}&nbsp;
            {getValues("name")}&nbsp;
          </b>
          มีแล้วในะรบบ ! กรุณาเปลี่ยนใหม่
        </Alert>
      )}
      <Stack>
        <TextInput
          label="รหัสประเภทอุปกรณ์"
          placeholder="กรอกรหัสประเภทอุปกรณ์"
          {...register("code")}
          error={errors.code?.message}
        />
        <TextInput
          label="ชื่อประเภทอุปกรณ์"
          placeholder="กรอกชื่อประเภทอุปกรณ์"
          {...register("name")}
          error={errors.name?.message}
          required
        />

        <Group justify="right" mt={20}>
          <Button color="gray" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button onClick={handleSubmit(onSubmit)}>บันทึก</Button>
        </Group>
      </Stack>
    </>
  );
}
