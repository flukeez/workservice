import { Button, Group, LoadingOverlay, Stack, TextInput } from "@mantine/core";
import { useFaculty, useFacultySave } from "@/hooks/faculty";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { facultyInitialValues, facultyYup } from "@/validations/faculty.schema";
import { useEffect } from "react";
import { IFacultyForm } from "@/types/IFaculty";
import Swal from "sweetalert2";
import DropdownFaculty from "../shared/DropdownFaculty";

interface FacultyFormProps {
  onClose: () => void;
  id: string;
}

export default function FacultyForm({ onClose, id }: FacultyFormProps) {
  const { data, isLoading, isFetching } = useFaculty(id);
  const mutationSave = useFacultySave();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    control,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(facultyYup),
    defaultValues: facultyInitialValues,
  });

  const onSubmit: SubmitHandler<IFacultyForm> = async (formData) => {
    const { data } = await mutationSave.mutateAsync(formData);
    if (data.result == "0") {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถบันทึกข้อมูลได้",
        text: `ชื่อหน่วยงาน ${formData.name} มีอยู่แล้วในระบบ`,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "บันทึกข้อมูลสําเร็จ",
      }).then((results) => {
        if (results.isConfirmed) {
          onClose();
        }
      });
    }
  };

  useEffect(() => {
    if (id !== "0") {
      reset(data?.result);
    }
  }, [id, isFetching]);
  return (
    <>
      <LoadingOverlay visible={isLoading || mutationSave.isPending} />
      <Stack>
        <TextInput
          label="ประเภทหน่วยงาน"
          placeholder="เลือกประเภทหน่วยงาน"
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
