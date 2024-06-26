import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePosition, usePositionSave } from "@/hooks/position";
import {
  Alert,
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  Stack,
  TextInput,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import {
  positionInitialValues,
  positionYup,
} from "@/validations/position.schema";
import type { IPositionForm } from "@/types/IPosition";

interface PositionProps {
  onClose: () => void;
  rowId: string;
}

export default function PositionForm({ rowId, onClose }: PositionProps) {
  const { data, isLoading } = usePosition(rowId);
  const mutationSave = usePositionSave();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    getValues,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(positionYup),
    defaultValues: positionInitialValues,
  });
  const [showAlert, setShowAlert] = useState(false);
  const onSubmit: SubmitHandler<IPositionForm> = async (formData) => {
    try {
      const { data } = await mutationSave.mutateAsync(formData);
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
      console.error("error");
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
          label="ชื่อตำแหน่ง"
          {...register("name")}
          placeholder="กรอกชื่อตำแหน่ง"
          error={errors.name?.message}
          required
        />
        <Checkbox label="สิทธิ์หัวหน้างาน" {...register("super_admin")} />
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
