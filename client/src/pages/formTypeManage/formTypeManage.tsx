import useTypeManageStore from "../../store/TypeManageStore";
import { Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

import {
  Container,
  Input,
  Text,
  Button,
  Grid,
  Space,
  Group,
} from "@mantine/core";
import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  container: {
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.xs,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },
}));

export default function FormTypeMange() {
  interface Inputs {
    manage_type: string;
    durable_goods: number;
    building: number;
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const { classes } = useStyles();

  const typeManageStore = useTypeManageStore();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    typeManageStore
      .addTypeManage({ ...data })
      .catch((error) => console.log("Error adding TypeManage", error));
  };

  return (
    <>
      <Container fluid px="xs" className={classes.container} pb="md">
        <Grid mt="sm">
          <Grid.Col md={2}>
            <Text size="lg">เพิ่มข้อมูลประเภทการจัดหา</Text>
          </Grid.Col>
        </Grid>

        <Space h="md" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input.Wrapper
            label="ประเภทงิน"
            required
            mx="auto"
            error={errors.manage_type && errors.manage_type.message}
          >
            <Input
              placeholder="ประเภทงิน"
              error={errors.manage_type ? errors.manage_type.message : ""}
              {...register("manage_type", {
                required: "ป้อนประเภทของเงิน",
              })}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="ครุภัณฑ์"
            required
            mx="auto"
            mt="xs"
            error={errors.durable_goods && errors.durable_goods.message}
          >
            <Input
              type="number"
              placeholder="ครุภัณฑ์"
              error={errors.durable_goods ? errors.durable_goods.message : ""}
              {...register("durable_goods", {
                required: "ระบุจำนวนครุภัณฑ์",
                min: {
                  value: 0,
                  message: "ค่าจำนวนครุภัณฑ์ต้องไม่น้อยกว่า 0",
                },
              })}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="สิ่งก่อสร้าง"
            required
            mx="auto"
            mt="xs"
            error={errors.building && errors.building.message}
          >
            <Input
              type="number"
              placeholder="สิ่งก่อสร้าง"
              error={errors.building ? errors.building.message : ""}
              {...register("building", {
                required: "ระบุจำนวนสิ่งก่อสร้าง",
                min: {
                  value: 0,
                  message: "ค่าจำนวนสิ่งก่อสร้างต้องไม่น้อยกว่า 0",
                },
              })}
            />
          </Input.Wrapper>
          <Group position="right" mt="sm">
            <Button
              variant="outline"
              color="gray"
              size="xs"
              component={Link}
              to="/typeManages"
            >
              ย้อนกลับ
            </Button>
            <Button color="green" size="xs" type="submit">
              ยืนยัน
            </Button>
          </Group>
        </form>
      </Container>
    </>
  );
}
