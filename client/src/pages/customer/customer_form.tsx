import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";
import { useCustomerSave } from "@/hooks/customer";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import { yupResolver } from "@hookform/resolvers/yup";
import { customerYup } from "@/validations/customer.schema";
import { useCtype } from "@/hooks/ctype";

const url = "/customer";
const title = "เพิ่มข้อมูลลูกค้า";
const listItems = [
  { title: "รายชื่อลูกค้า", href: "/customer" },
  { title: title, href: "#" },
];

const condition = {
  activePage: 0,
  limit: 100,
};

export default function CustomerFormPage() {
  const navigate = useNavigate();
  const ctype = useCtype(condition);
  const mutationSave = useCustomerSave();

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(customerYup),
  });

  const onSubmit = async (formData: any) => {
    const { data } = await mutationSave.mutateAsync(formData);
    Swal.fire({
      icon: "success",
      title: "บันทึกข้อมูลสําเร็จ",
    }).then((results) => {
      if (results.isConfirmed) {
        navigate(url);
      }
    });
  };

  const handleNew = () => {};

  return (
    <>
      <LoadingOverlay visible={ctype.isPending} />
      <PageHeader title={title} listItems={listItems} />
      <Card withBorder>
        <Card.Section withBorder inheritPadding py="sm">
          <Group justify="right">
            <Button
              leftSection={<IconPlus size={18} />}
              color="green"
              onClick={handleNew}
            >
              เพิ่มข้อมูล
            </Button>
          </Group>
        </Card.Section>
        <Grid mt="sm">
          <Grid.Col span={6}>
            <Select
              label="ประเภทสินค้า"
              placeholder="เลือกประเภทสินค้า"
              data={
                ctype?.data?.rows &&
                ctype.data.rows.map((field: any) => ({
                  value: field.id.toString(),
                  label: field.name,
                }))
              }
              searchable
              required
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="ชื่อลูกค้า"
              {...register("name")}
              error={errors.name?.message}
              required
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Textarea
              minRows={4}
              rows={4}
              label="ที่่อยู่"
              {...register("address")}
              error={errors.address?.message}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="เบอร์โทร"
              {...register("tel")}
              error={errors.tel?.message}
              required
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="ผู้ติดต่อ"
              {...register("contact")}
              error={errors.contact?.message}
              required
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => {
                return (
                  <NumberInput
                    {...field}
                    label="ราคาขาย"
                    hideControls
                    decimalScale={2}
                    fixedDecimalScale
                    min={0}
                    thousandSeparator=","
                    rightSectionWidth={60}
                    rightSection={
                      <Badge color="gray" variant="light" radius="sm" size="lg">
                        บาท
                      </Badge>
                    }
                    rightSectionPointerEvents="none"
                    styles={{ input: { textAlign: "right" } }}
                    error={errors.price?.message}
                  />
                );
              }}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="วันที่ขาย"
              {...register("insale")}
              error={errors.insale?.message}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              label="วันที่รับเงิน"
              {...register("paydate")}
              error={errors.paydate?.message}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Textarea
              minRows={4}
              rows={4}
              label="หมายเหตุ"
              {...register("note")}
              error={errors.note?.message}
            />
          </Grid.Col>
        </Grid>
        <Card.Section withBorder inheritPadding py="sm" mt="lg">
          <Group justify="center">
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
