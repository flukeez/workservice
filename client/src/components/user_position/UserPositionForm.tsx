import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Button, Group, LoadingOverlay, Stack } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import {
  facultyPositionInitialValues,
  facultyPositionYup,
} from "@/validations/faculty.schema";
import DropdownUser from "../user/DropdownUser";
import DropdownPosition from "../position/DropdownPosition";
import ButtonSave from "../common/ButtonSave";
import { IUserPositionForm } from "@/types/IUserPosition";
import AlertSuccessDialog from "../common/AlertSuccessDialog";
import AlertErrorDialog from "../common/AlertErrorDialog";
import { useUserPosition, useUserPositionSave } from "@/hooks/user_position";

interface FacultyPositionFormProps {
  onClose: () => void;
  id: string;
  fac_id: number;
  type: number;
}
export default function UserPositionForm({
  onClose,
  id,
  fac_id,
}: FacultyPositionFormProps) {
  const { data, isLoading } = useUserPosition(id);
  const mutationSave = useUserPositionSave();
  const [showAlert, setShowAlert] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(facultyPositionYup),
    defaultValues: facultyPositionInitialValues,
  });

  const onSubmit = async (formData: IUserPositionForm) => {
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
    setValue("fac_id", fac_id.toString());
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
          บุคคลนี้มีตำแหน่งในหน่วยงานแล้ว !
        </Alert>
      )}
      <form onSubmit={handleSubmit((formData) => onSubmit(formData))}>
        <Stack>
          <Controller
            name="user_id"
            control={control}
            render={({ field }) => {
              const handleSelectChange = (value: string | null) => {
                field.onChange(value);
              };
              return (
                <DropdownUser
                  user={field.value}
                  setUser={handleSelectChange}
                  required={true}
                  error={errors.user_id?.message}
                />
              );
            }}
          />
          <Controller
            name="pos_id"
            control={control}
            render={({ field }) => {
              const handleSelectChange = (value: string | null) => {
                field.onChange(value);
              };
              return (
                <DropdownPosition
                  position={field.value}
                  setPosition={handleSelectChange}
                  error={errors.pos_id?.message}
                />
              );
            }}
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
