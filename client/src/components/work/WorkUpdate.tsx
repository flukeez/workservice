import { Grid, Text, TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import DropdownStatus from "../status/DropdownStatus";
import { Controller, useForm } from "react-hook-form";
import { workYup } from "@/validations/work.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import AlertErrorDialog from "../common/AlertErrorDialog";
import InputPrice from "../common/InputPrice";

const labelSize = {
  md: 2,
  sm: 4,
  xs: 12,
};
const inputSize = {
  md: 8,
  sm: 8,
  xs: 12,
};
const offsetSize = {
  md: 2,
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
  const isMobile = useMediaQuery("(max-width: 390px)");
  const {
    handleSubmit,
    register,
    reset,
    control,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(workYup),
  });
  //กำหนดสถานะปัจจุบัน ได้มาจากหน้ารายละเอียดส่งมา props
  useEffect(() => {
    reset({ status_id: status });
  }, [status]);
  return (
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
        <TextInput {...register("details")} placeholder="กรอกรายละเอียด" />
      </Grid.Col>
      <Grid.Col span={offsetSize}></Grid.Col>
      {/* รูปภาพ */}
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
                  />
                );
              }}
            />
          </Grid.Col>
          <Grid.Col span={offsetSize}></Grid.Col> {/* ค่าอะไหล่ */}
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
                  />
                );
              }}
            />
          </Grid.Col>
          <Grid.Col span={offsetSize}></Grid.Col>{" "}
        </>
      ) : null}
    </Grid>
  );
}
