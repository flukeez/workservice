import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Alert,
  Button,
  Group,
  LoadingOverlay,
  Stack,
  TextInput,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { facultyInitialValues, facultyYup } from "@/validations/faculty.schema";
import { useFaculty, useFacultySave } from "@/hooks/faculty";
import type { IFacultyForm } from "@/types/IFaculty";
import DropdownFaculty from "./DropdownFaculty";

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
    mode: "onChange",
    resolver: yupResolver(facultyYup),
    defaultValues: facultyInitialValues,
  });
  const [showAlert, setShowAlert] = useState(false);
  const onSubmit: SubmitHandler<IFacultyForm> = async (formData) => {
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
          label="ชื่อหน่วยงาน"
          placeholder="กรอกชื่อหน่วยงาน"
          {...register("name")}
          error={errors.name?.message}
          required
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
          <Button onClick={handleSubmit(onSubmit)}>บันทึก</Button>
        </Group>
      </Stack>
    </>
  );
}
