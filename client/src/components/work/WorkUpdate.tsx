import { Button, Divider, Grid, Group, Text, TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import DropdownStatus from "../status/DropdownStatus";
import { Controller, useForm } from "react-hook-form";
import { initialWorkValues, workYup } from "@/validations/work.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import AlertErrorDialog from "../common/AlertErrorDialog";
import InputPrice from "../common/InputPrice";
import ButtonFileUpload from "../common/ButtonFileUpload";
import ImagePreview from "../common/ImagePreview";
import { useWorkUpdateMutation } from "@/hooks/work";
import { IWorkForm } from "@/types/IWork";
import { useNavigate } from "react-router-dom";
import AlertSuccessDialog from "../common/AlertSuccessDialog";

const labelSize = {
  md: 2,
  sm: 4,
  xs: 12,
};
const inputSize = {
  md: 9,
  sm: 8,
  xs: 12,
};
const offsetSize = {
  md: 1,
  sm: 0,
  xs: 0,
};
const TextLabel = ({
  label,
  isMobile,
}: {
  label: string;
  isMobile: boolean;
}) => {
  return <Text ta={isMobile ? "left" : "right"}>{label} :</Text>;
};

export default function WorkUpdate({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 390px)");
  const {
    handleSubmit,
    register,
    setValue,
    control,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(workYup),
    defaultValues: initialWorkValues,
  });
  const mutation = useWorkUpdateMutation();

  const onSubmit = async (formData: IWorkForm) => {
    if (formData.status_id == status) {
      AlertErrorDialog({
        title: "ไม่สามารถเปลี่ยนสถานะงานซ่อมได้",
        html: "กรุณาเลือกสถานะงานซ่อมใหม่",
      });
      return;
    }
    try {
      const { data } = await mutation.mutateAsync(formData);
      if (data.result) {
        const isConfirmed = await AlertSuccessDialog({
          title: "บันทึกข้อมูลสำเร็จ",
        });
        if (isConfirmed) navigate(-1);
      } else {
        await AlertErrorDialog({
          html: "งานซ่อมนี้ดำเนินการเรียบร้อยแล้ว ไม่สามารถเปลี่ยนสถานะได้",
        });
      }
    } catch (error) {
      console.error(error);
      await AlertErrorDialog({
        html: "บันทึกข้อมูลไม่สำเร็จ ให้ลองออกจากระบบ แล้วเข้าสู่ระบบใหม่",
      });
    }
  };
  //กำหนดสถานะปัจจุบัน ได้มาจากหน้ารายละเอียดส่งมา props
  useEffect(() => {
    setValue("status_id", status);
    setValue("request_id", id);
  }, [status]);

  useEffect(() => {
    const cost =
      Number(watch("request_cost")) +
      Number(watch("parts_cost")) +
      Number(watch("other_cost"));
    const vat = cost * 0.07;
    setValue("vat", vat);
    setValue("total_cost", cost + vat);
  }, [watch("request_cost"), watch("parts_cost"), watch("other_cost")]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid mt="lg">
        {/* //สถานงานซ่อม */}
        <Grid.Col span={labelSize}>
          <TextLabel isMobile={isMobile || false} label="สถานงานซ่อม" />
        </Grid.Col>
        <Grid.Col span={inputSize}>
          <Controller
            name="status_id"
            control={control}
            render={({ field }) => {
              const handleSelectChange = (value: string | null) => {
                if (value && value <= status) {
                  AlertErrorDialog({
                    html: "ไม่สามารถเปลี่ยนเป็นสถานะงานที่ดำเนินการไปแล้วได้",
                  });
                  return;
                }
                field.onChange(value);
              };
              return (
                <DropdownStatus
                  status={field.value}
                  setStatus={handleSelectChange}
                  label=""
                  error={errors.status_id?.message}
                />
              );
            }}
          />
        </Grid.Col>
        <Grid.Col span={offsetSize}></Grid.Col>
        {/* //รายละเอียด */}
        <Grid.Col span={labelSize}>
          <TextLabel isMobile={isMobile || false} label="รายละเอียด" />
        </Grid.Col>
        <Grid.Col span={inputSize}>
          <TextInput
            {...register("details")}
            placeholder="กรอกรายละเอียด"
            error={errors.details?.message}
          />
        </Grid.Col>
        <Grid.Col span={offsetSize}></Grid.Col>
        {/* สำหรับส่งงานซ่อม */}
        {watch("status_id") === "8" ? (
          <>
            {/* ค่าซ่อม */}
            <Grid.Col span={labelSize}>
              <TextLabel isMobile={isMobile || false} label="ค่าซ่อม" />
            </Grid.Col>
            <Grid.Col span={inputSize}>
              <Controller
                name="request_cost"
                control={control}
                render={({ field }) => {
                  return (
                    <InputPrice
                      label=""
                      value={field.value || 0}
                      onChange={field.onChange}
                      error={errors.request_cost?.message}
                    />
                  );
                }}
              />
            </Grid.Col>
            <Grid.Col span={offsetSize}></Grid.Col>
            {/* ค่าอะไหล่ */}
            <Grid.Col span={labelSize}>
              <TextLabel isMobile={isMobile || false} label="ค่าอะไหล่" />
            </Grid.Col>
            <Grid.Col span={inputSize}>
              <Controller
                name="parts_cost"
                control={control}
                render={({ field }) => {
                  return (
                    <InputPrice
                      label=""
                      value={field.value || 0}
                      onChange={field.onChange}
                      error={errors.parts_cost?.message}
                    />
                  );
                }}
              />
            </Grid.Col>
            <Grid.Col span={offsetSize} />
            {/* ค่าใช้จ่ายอื่น ๆ */}
            <Grid.Col span={labelSize}>
              <TextLabel
                isMobile={isMobile || false}
                label="ค่าใช้จ่ายอื่น ๆ"
              />
            </Grid.Col>
            <Grid.Col span={inputSize}>
              <Controller
                name="other_cost"
                control={control}
                render={({ field }) => {
                  return (
                    <InputPrice
                      label=""
                      value={field.value || 0}
                      onChange={field.onChange}
                      error={errors.other_cost?.message}
                    />
                  );
                }}
              />
            </Grid.Col>
            <Grid.Col span={offsetSize} />
            {/* ภาษี */}
            <Grid.Col span={labelSize}>
              <TextLabel isMobile={isMobile || false} label="ภาษี" />
            </Grid.Col>
            <Grid.Col span={inputSize}>
              <InputPrice
                label=""
                value={getValues("vat") || 0}
                onChange={() => {}}
                filled="filled"
              />
            </Grid.Col>
            <Grid.Col span={offsetSize} />
            {/* รวม */}
            <Grid.Col span={labelSize}>
              <TextLabel isMobile={isMobile || false} label="รวมเป็นเงิน" />
            </Grid.Col>
            <Grid.Col span={inputSize}>
              <InputPrice
                label=""
                value={getValues("total_cost") || 0}
                onChange={() => {}}
                filled="filled"
              />
            </Grid.Col>
            <Grid.Col span={offsetSize} />
          </>
        ) : null}
        {/* รูปภาพ */}
        <Grid.Col span={labelSize}>
          <TextLabel isMobile={isMobile || false} label="รูปภาพ" />
        </Grid.Col>
        <Grid.Col span={inputSize}>
          <Group align="flex-start">
            {watch("image") && (
              <ImagePreview folder={"request/" + id} image={watch("image")} />
            )}
            <Controller
              name="image"
              control={control}
              render={({ field }) => {
                const handleDelete = () => {
                  field.onChange(null);
                };
                return (
                  <ButtonFileUpload
                    file={field.value}
                    setFile={field.onChange}
                    setDelete={handleDelete}
                  />
                );
              }}
            />
          </Group>
        </Grid.Col>
      </Grid>
      <Divider mt="md" />
      <Group justify="center" mt="md">
        <Button size="lg" color="gray" onClick={() => navigate(-1)}>
          ย้อนกลับ
        </Button>
        <Button size="lg" color="blue" type="submit">
          ยืนยัน
        </Button>
      </Group>
    </form>
  );
}
