import { useEffect, useState } from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFaculty, useFacultySave } from "@/hooks/faculty";
import { facultyInitialValues, facultyYup } from "@/validations/faculty.schema";
import type { IFacultyForm } from "@/types/IFaculty";

import {
  Alert,
  Button,
  Group,
  LoadingOverlay,
  Stack,
  TextInput,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

import DropdownFaculty from "./DropdownFaculty";
import ButtonSave from "../common/ButtonSave";
import AlertErrorDialog from "../common/AlertErrorDialog";
import AlertSuccessDialog from "../common/AlertSuccessDialog";

interface FacultyFormProps {
  onClose: () => void;
  id: string;
}

export default function FacultyForm({ onClose, id }: FacultyFormProps) {
  const { data, isLoading } = useFaculty(id);
  const mutationSave = useFacultySave();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    control,
    getValues,
  } = useForm({
    resolver: yupResolver(facultyYup),
    defaultValues: facultyInitialValues,
  });
  const [showAlert, setShowAlert] = useState(false);
  const onSubmit: SubmitHandler<IFacultyForm> = async (formData) => {
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
            label="ชื่อหน่วยงาน"
            {...register("name")}
            error={errors.name?.message}
            withAsterisk
          />
          <Controller
            name="faculty_id"
            control={control}
            render={({ field }) => {
              const handleSelectChange = (value: string | null) => {
                field.onChange(value);
              };
              return (
                <DropdownFaculty
                  label="หน่วยงานต้นสังกัด"
                  faculty={field.value}
                  setFaculty={handleSelectChange}
                  error={errors.faculty_id?.message}
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
