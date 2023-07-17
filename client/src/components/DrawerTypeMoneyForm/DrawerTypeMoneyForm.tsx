import useTypeMoneyStore from "../../store/TypeMoneyStore";
import { useForm, SubmitHandler } from "react-hook-form";

import { Drawer, Text, Input, Group, Button } from "@mantine/core";
import { useEffect } from "react";

interface TypeMoneyInterFace {
  id?: number;
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
    reset();
  };

  const typeMoneyStore = useTypeMoneyStore();

  //submit
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (TypeMoney && typeof TypeMoney.id === "number") {
      typeMoneyStore
        .updateTypeMoney(TypeMoney.id, { ...data })
        .catch((error) => console.log("Error updating TypeMoney:", error));
    } else {
      typeMoneyStore
        .addTypeMoney({ ...data })
        .catch((error) => console.log("Error adding TypeMoney:", error));
    }

    handleDrawerClose();
  };

  useEffect(() => {
    if (TypeMoney) {
      reset(TypeMoney);
    } else {
      reset();
    }
  }, [TypeMoney]);

  return (
    <Drawer.Root
      opened={opened}
      onClose={() => handleDrawerClose}
      position="top"
      size={340}
    >
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input.Wrapper
              label="ประเภทงิน"
              required
              mx="auto"
              error={errors.money_type && errors.money_type.message}
            >
              <Input
                placeholder="ประเภทงิน"
                error={errors.money_type ? errors.money_type.message : ""}
                {...register("money_type", {
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
                onClick={handleDrawerClose}
              >
                ยกเลิก
              </Button>
              <Button color="green" size="xs" type="submit">
                ยืนยัน
              </Button>
            </Group>
          </form>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}
