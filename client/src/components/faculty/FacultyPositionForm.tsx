import { useOrgChart } from "@/hooks/faculty/useFaculty";
import {
  facultyPositionInitialValues,
  facultyPositionYup,
} from "@/validations/faculty.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Button, Group, LoadingOverlay, Stack } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import DropdownUser from "../user/DropdownUser";
import DropdownPosition from "../position/DropdownPosition";
import type { IFacultyPositionForm } from "@/types/IFaculty";
import { useFacultyPositionSave } from "@/hooks/faculty/useFacultyMutate";
import Swal from "sweetalert2";

interface FacultyPositionFormProps {
  onClose: () => void;
  id: string;
  fac_id: number;
  type: number;
}
export default function FacultyPositionForm({
  onClose,
  id,
  fac_id,
  type,
}: FacultyPositionFormProps) {
  const { data, isLoading } = useOrgChart(fac_id, id);
  const mutationSave = useFacultyPositionSave();
  const [showAlert, setShowAlert] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(facultyPositionYup),
    defaultValues: facultyPositionInitialValues,
  });

  const onSubmit: SubmitHandler<IFacultyPositionForm> = async (formData) => {
    const newFormData = { ...formData, type, fac_id: fac_id.toString() };
    console.log(newFormData);
    const { data } = await mutationSave.mutateAsync(newFormData);
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
      <LoadingOverlay visible={isLoading} />
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
          <Button onClick={handleSubmit(onSubmit)}>บันทึก</Button>
        </Group>
      </Stack>
    </>
  );
}
