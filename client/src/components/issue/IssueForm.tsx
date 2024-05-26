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
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { issueInitialValues, issueYup } from "@/validations/issue.schema";
import { useIssue, useIssueSave } from "@/hooks/issue";
import { IIssueForm } from "@/types/IIssue";
import DropdownIssue from "../shared/DropdownIssue";

interface IssueFormProps {
  onClose: () => void;
  rowId: string;
}

export default function IssueForm({ onClose, rowId }: IssueFormProps) {
  const { data, isLoading } = useIssue(rowId);
  const mutationSave = useIssueSave();

  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors },
    control,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(issueYup),
    defaultValues: issueInitialValues,
  });
  const [showAlert, setShowAlert] = useState(false);
  const onSubmit: SubmitHandler<IIssueForm> = async (formData) => {
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
          label="ชื่อปัญหา"
          {...register("name")}
          placeholder="กรอกชื่อประเภทปัญหา"
          error={errors.name?.message}
          required
        />
        <Controller
          name="issue_id"
          control={control}
          render={({ field }) => {
            const handleSelectChange = (value: string | null) => {
              field.onChange(value);
            };
            return (
              <DropdownIssue
                issue={field.value ? field.value : null}
                setIssue={handleSelectChange}
                error={errors.issue_id?.message}
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
