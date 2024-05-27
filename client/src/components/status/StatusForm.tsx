import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Button,
  Group,
  LoadingOverlay,
  Stack,
  TextInput,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useStatus, useStatusSave } from "@/hooks/status";
import { statusInitialValues, statusYup } from "@/validations/status.schema";
import type { IStatusForm } from "@/types/IStatus";

interface StatusProps {
  onClose: () => void;
  rowId: string;
}
export default function StatusForm({ rowId, onClose }: StatusProps) {
  const { data, isLoading } = useStatus(rowId);
  const mutationSave = useStatusSave();
  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(statusYup),
    defaultValues: statusInitialValues,
  });
  const [showAlert, setShowAlert] = useState(false);
  const onSubmit: SubmitHandler<IStatusForm> = async (formData) => {
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
          ชื่อ <b>{getValues("name")}</b> มีแล้วในะรบบ ! กรุณาเปลี่ยนชื่อใหม่
        </Alert>
      )}
      <Stack>
        <TextInput
          label="ชื่อสถานะงาน"
          {...register("name")}
          placeholder="กรอกชื่อสถานะงาน"
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
