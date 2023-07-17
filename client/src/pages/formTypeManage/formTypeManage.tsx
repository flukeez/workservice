import useTypeManageStore from "../../store/TypeManageStore";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { useEffect } from "react";

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
    code: string;
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
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (id) {
      const parsedId = Number(id);
      typeManageStore
        .updateTypeManage(parsedId, { ...data })
        .catch((error) => console.log("Error updating TypeManage:", error));
    } else {
      typeManageStore
        .addTypeManage({ ...data })
        .catch((error) => console.log("Error adding TypeManage", error));
    }

    navigate("/typeManages");
  };

  useEffect(() => {
    if (id) {
      const parsedId = Number(id);
      const typeManageData = typeManageStore.typeManage.filter(
        (state) => state.id == parsedId
      );
      reset(...typeManageData);
    }
  }, []);

  return (
    <>
      <Container fluid px="xs" className={classes.container} pb="md">
        <Grid mt="sm">
          <Grid.Col md={2}>
            <Text size="lg">
              {id ? "แก้ไขข้อมูลประเภทการจัดการ" : "ประเภทการจัดหา"}
            </Text>
          </Grid.Col>
        </Grid>

        <Space h="md" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input.Wrapper
            label="รหัส"
            required
            mx="auto"
            error={errors.code && errors.code.message}
          >
            <Input
              placeholder="รหัส"
              error={errors.code ? errors.code.message : ""}
              {...register("code", {
                required: "ป้อนรหัส",
              })}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="ประเภทการจัดหา"
            required
            mx="auto"
            error={errors.manage_type && errors.manage_type.message}
          >
            <Input
              placeholder="ประเภทการจัดหา"
              error={errors.manage_type ? errors.manage_type.message : ""}
              {...register("manage_type", {
                required: "ป้อนประเภทของการจัดหา",
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
