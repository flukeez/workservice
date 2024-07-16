import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePosition, usePositionSave } from "@/hooks/position";
import {
  positionInitialValues,
  positionYup,
} from "@/validations/position.schema";
import type { IPositionForm } from "@/types/IPosition";
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
import AlertSuccessDialog from "../common/AlertSuccessDialog";
import AlertErrorDialog from "../common/AlertErrorDialog";
import ButtonSave from "../common/ButtonSave";

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
    resolver: yupResolver(positionYup),
    defaultValues: positionInitialValues,
  });
  const [showAlert, setShowAlert] = useState(false);
  const onSubmit: SubmitHandler<IPositionForm> = async (formData) => {
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
          ชื่อ <b>{getValues("name")}</b> มีแล้วในะรบบ ! กรุณาเปลี่ยนชื่อใหม่
        </Alert>
      )}
      <form onSubmit={handleSubmit((formData) => onSubmit(formData))}>
        <Stack>
          <TextInput
            label="ชื่อตำแหน่ง"
            {...register("name")}
            error={errors.name?.message}
            withAsterisk
          />
          <Checkbox label="สิทธิ์หัวหน้างาน" {...register("super_admin")} />
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
