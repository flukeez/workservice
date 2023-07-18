import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Axios from "axios";

import { Drawer, Text, Input, Group, Button } from "@mantine/core";

import { initialTypeMoney } from "@/initial/initialTypeMoney";

interface TypeMoneyInterFace {
  id?: number;
  code: string;
  money_type: string;
  durable_goods: number;
  building: number;
}

export function DrawerTypeMoneyForm({
  opened,
  onClose,
  TypeMoney,
}: {
  opened: boolean;
  onClose: () => void;
  TypeMoney?: TypeMoneyInterFace;
}) {
  interface Inputs {
    code: string;
    money_type: string;
    durable_goods: number;
    building: number;
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const handleDrawerClose = () => {
    onClose();
    reset(initialTypeMoney);
  };

  //submit
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (TypeMoney && typeof TypeMoney.id === "number") {
        const response = await Axios.put(
          `http://localhost:4000/api/typeMoneys/${TypeMoney.id}`,
          data
        );
      } else {
        const response = await Axios.post(
          "http://localhost:4000/api/typeMoneys/create",
          data
        );
      }
      handleDrawerClose();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (TypeMoney) {
      reset(TypeMoney);
    } else {
      reset();
    }
  }, [TypeMoney]);

  return (
    <Drawer.Root opened={opened} onClose={handleDrawerClose} position="right">
      <Drawer.Overlay />
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>
            <Text size="xl" fw={700}>
              {TypeMoney ? "แก้ไขข้อมูลประเภทเงิน" : "เพิ่มข้อมูลประเภทเงิน"}
            </Text>
          </Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body>
          {/* ส่วนของฟอร์ม */}
          <Input.Wrapper
            label="รหัส"
            required
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
            label="ประเภทเงิน"
            required
            mt="xs"
            error={errors.money_type && errors.money_type.message}
          >
            <Input
              placeholder="ประเภทเงิน"
              error={errors.money_type ? errors.money_type.message : ""}
              {...register("money_type", {
                required: "ป้อนประเภทของเงิน",
              })}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="ครุภัณฑ์"
            required
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
              onClick={handleDrawerClose}
            >
              ยกเลิก
            </Button>
            <Button color="blue" size="xs" onClick={handleSubmit(onSubmit)}>
              ยืนยัน
            </Button>
          </Group>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}
