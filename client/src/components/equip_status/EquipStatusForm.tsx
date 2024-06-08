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
import { useEquipStatus, useEquipStatusSave } from "@/hooks/equip_status";
import {
  equipStatusInitialValues,
  equipStatusYup,
} from "@/validations/equipstatus.schema";
import type { IEquipStatusForm } from "@/types/IEquipStatus";

interface EquipStatusFormProps {
  onClose: () => void;
  id: string;
}
export default function EquipStatusForm({ onClose, id }: EquipStatusFormProps) {
  const { data, isLoading } = useEquipStatus(id);
  const mutationSave = useEquipStatusSave();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    getValues,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(equipStatusYup),
    defaultValues: equipStatusInitialValues,
  });
  const [showAlert, setShowAlert] = useState(false);
  const onSubmit: SubmitHandler<IEquipStatusForm> = async (formData) => {
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
          label="ชื่อสถานะอุปกรณ์"
          placeholder="กรอกชื่อสถานะอุปกรณ์"
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
