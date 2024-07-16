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
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { issueInitialValues, issueYup } from "@/validations/issue.schema";
import { useIssue, useIssueSave } from "@/hooks/issue";
import { IIssueForm } from "@/types/IIssue";
import DropdownIssue from "./DropdownIssue";
import AlertSuccessDialog from "../common/AlertSuccessDialog";
import AlertErrorDialog from "../common/AlertErrorDialog";
import ButtonSave from "../common/ButtonSave";

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
    resolver: yupResolver(issueYup),
    defaultValues: issueInitialValues,
  });
  const [showAlert, setShowAlert] = useState(false);
  const onSubmit: SubmitHandler<IIssueForm> = async (formData) => {
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
            label="ชื่อปัญหา"
            {...register("name")}
            placeholder="กรอกชื่อประเภทปัญหา"
            error={errors.name?.message}
            withAsterisk
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
                  label="หมวดหมู่ปัญหา"
                  issue_type="0"
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
