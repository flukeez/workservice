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
import { useEquipStatus, useEquipStatusSave } from "@/hooks/equip_status";
import {
  equipStatusInitialValues,
  equipStatusYup,
} from "@/validations/equipstatus.schema";
import type { IEquipStatusForm } from "@/types/IEquipStatus";
import AlertSuccessDialog from "../common/AlertSuccessDialog";
import AlertErrorDialog from "../common/AlertErrorDialog";
import ButtonSave from "../common/ButtonSave";

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
    resolver: yupResolver(equipStatusYup),
    defaultValues: equipStatusInitialValues,
  });
  const [showAlert, setShowAlert] = useState(false);
  const onSubmit: SubmitHandler<IEquipStatusForm> = async (formData) => {
    setShowAlert(false);

    try {
      const { data } = await mutationSave.mutateAsync(formData);
      console.log(data.result);
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
          ชื่อ <b>{getValues("name")}</b> มีแล้วในะรบบ ! กรุณาเปลี่ยนชื่อใหม่
        </Alert>
      )}
      <form onSubmit={handleSubmit((formData) => onSubmit(formData))}>
        <Stack>
          <TextInput
            label="ชื่อสถานะอุปกรณ์"
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
