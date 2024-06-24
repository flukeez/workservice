import { useNavigate, useParams } from "react-router-dom";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { requestInitialValues, requestYup } from "@/validations/request.schema";
import { useRequest, useRequestSave } from "@/hooks/request";
import type { IRequestForm } from "@/types/IRequest";

import {
  Button,
  Card,
  Divider,
  Grid,
  Group,
  LoadingOverlay,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";

import AlertErrorDialog from "@/components/common/AlertErrorDialog";
import AlertSuccessDialog from "@/components/common/AlertSuccessDialog";
import ButtonFileUploadMultiple from "@/components/common/ButtonFileUploadMultiple";
import ImageAlbumPreview from "@/components/common/ImageAlbumPreview";
import PageHeader from "@/components/common/PageHeader";
import ModalEquipment from "@/components/equipment/ModalEquipment";
import DropdownIssue from "@/components/issue/DropdownIssue";
import DropdownPriority from "@/components/priority/DropdownPriority";
import { useEffect } from "react";
import { convertToNumberOrZero } from "@/utils/mynumber";

const title = "แจ้งซ่อม";
const listItems = [{ title: title, href: "#" }];
const layout = {
  md: 4,
  sm: 12,
  xs: 12,
};
export default function RequestForm() {
  const navigate = useNavigate();
  const mutationSave = useRequestSave();
  const params = useParams();
  const id = convertToNumberOrZero(params.id);

  const { data, isLoading, setFilter } = useRequest(id);
  const handleNew = () => {
    setFilter(0);
  };
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(requestYup),
    defaultValues: requestInitialValues,
  });

  const onSubmit = async (formData: IRequestForm) => {
    try {
      const { data } = await mutationSave.mutateAsync(formData);
      if (data.result) {
        const isConfirmed = await AlertSuccessDialog({
          title: "บันทึกข้อมูลสำเร็จ",
        });
        if (isConfirmed) navigate("/request");
      } else {
        await AlertErrorDialog({
          html: "มีข้อมูลอยู่แล้วในระบบ ไม่สามารถบันทึกข้อมูลได้",
        });
      }
    } catch (error) {
      console.log(error);
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
      <PageHeader title={title} listItems={listItems} />
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="md">
          <Group justify="right">
            <Button
              color="green"
              leftSection={<IconPlus size="1rem" />}
              onClick={handleNew}
            >
              รายการใหม่
            </Button>
          </Group>
        </Card.Section>
        <LoadingOverlay visible={isLoading || mutationSave.isPending} />
        <Grid mt="sm">
          <Grid.Col>
            <TextInput
              label="งานซ่อม"
              placeholder="กรอกชื่องานซ่อม"
              required
              {...register("name")}
              error={errors.name?.message}
            />
          </Grid.Col>
        </Grid>
        <Grid mt="sm">
          <Grid.Col span={layout}>
            <Controller
              name="issue_id"
              control={control}
              render={({ field }) => {
                const handleSelectChange = (value: string | null) => {
                  field.onChange(value);
                  setValue("issue_sub_id", "");
                };
                return (
                  <DropdownIssue
                    issue={field.value}
                    setIssue={handleSelectChange}
                    required={true}
                    label="ประเภทงาน"
                    placeholder="เลือกประเภทงาน"
                    issue_type={"0"}
                    error={errors.issue_id?.message}
                  />
                );
              }}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <Controller
              name="issue_sub_id"
              control={control}
              render={({ field }) => {
                const handleSelectChange = (value: string | null) => {
                  field.onChange(value);
                };
                return (
                  <DropdownIssue
                    issue={field.value}
                    setIssue={handleSelectChange}
                    issue_type={"1"}
                    error={errors.issue_sub_id?.message}
                    issue_id={watch("issue_id")}
                  />
                );
              }}
            />
          </Grid.Col>
          <Grid.Col span={layout}>
            <Controller
              name="priority_id"
              control={control}
              render={({ field }) => {
                const handleSelectChange = (value: string | null) => {
                  field.onChange(value);
                };
                return (
                  <DropdownPriority
                    priority={field.value}
                    setPriority={handleSelectChange}
                    required={true}
                    error={errors.priority_id?.message}
                  />
                );
              }}
            />
          </Grid.Col>
        </Grid>
        <Grid mt="md">
          <Grid.Col>
            <Controller
              name="equip_id"
              control={control}
              render={({ field }) => {
                const handleSelectChange = (value: string[]) => {
                  field.onChange(value);
                };
                return (
                  <ModalEquipment
                    equip={
                      Array.isArray(field.value)
                        ? field.value
                        : String(field.value).split(",")
                    }
                    setEquip={handleSelectChange}
                    error={errors.equip_id?.message}
                    id={getValues("id") || 0}
                  />
                );
              }}
            />
          </Grid.Col>
        </Grid>
        <Grid mt="md">
          <Grid.Col>
            <Textarea
              label="หมายเหตุ"
              rows={3}
              placeholder="ระบุรายละเอียดงานซ่อม"
              {...register("details")}
              error={errors.details?.message}
            />
          </Grid.Col>
        </Grid>
        <Divider
          size="xs"
          mt="md"
          labelPosition="left"
          label={
            <Text size="lg" c="dimmed">
              รูปภาพ
            </Text>
          }
        />
        <Grid mt="sm">
          {Array.isArray(watch("image")) && watch("image").length > 0 && (
            <Grid.Col span={layout}>
              <ImageAlbumPreview folder="request" images={watch("image")} />
            </Grid.Col>
          )}
          <Grid.Col span={layout}>
            <Controller
              name="image"
              control={control}
              render={({ field }) => {
                const handleSelectChange = (value: File[] | null) => {
                  if (value === null) return;
                  //เช็คจำนวนภาพ
                  if (value.length + field.value.length > 5) {
                    return AlertErrorDialog({
                      html: "สามารถเพิ่มได้ไม่เกิน 5 รูป",
                    });
                  }
                  field.onChange([...field.value, ...value]);
                };
                const handleDelete = (index: number) => {
                  field.onChange(field.value.filter((_, i) => i !== index));
                };
                return (
                  <ButtonFileUploadMultiple
                    file={field.value}
                    setFile={handleSelectChange}
                    setDelete={handleDelete}
                  />
                );
              }}
            />
          </Grid.Col>
        </Grid>
        <Card.Section withBorder inheritPadding py="md" mt="lg">
          <Group justify="center">
            <Button
              size="lg"
              color="gray"
              // onClick={() => navigate("/equipment")}
            >
              ยกเลิก
            </Button>
            <Button
              leftSection={<IconDeviceFloppy />}
              size="lg"
              onClick={handleSubmit(onSubmit)}
            >
              บันทึกข้อมูล
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </>
  );
}
