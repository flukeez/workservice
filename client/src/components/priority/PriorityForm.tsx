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
import { usePriority, usePrioritySave } from "@/hooks/priority";
import {
  priorityInitialValues,
  priorityYup,
} from "@/validations/priority.schema";
import type { IPriorityForm } from "@/types/IPriority";

interface PriorityProps {
  onClose: () => void;
  rowId: string;
}
export default function PriorityForm({ rowId, onClose }: PriorityProps) {
  const { data, isLoading } = usePriority(rowId);
  const mutationSave = usePrioritySave();
  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(priorityYup),
    defaultValues: priorityInitialValues,
  });
  const [showAlert, setShowAlert] = useState(false);
  const onSubmit: SubmitHandler<IPriorityForm> = async (formData) => {
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
          label="ชื่อความสำคัญ"
          {...register("name")}
          placeholder="กรอกชื่อความสำคัญ"
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
