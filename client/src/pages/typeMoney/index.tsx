import { useEffect, useState } from "react";

import { IconPencil, IconX, IconPlus } from "@tabler/icons-react";
import { Container, Table, Text, Button, Grid, Space } from "@mantine/core";
import useTypeMoneyStore from "../../store/TypeMoneyStore";

import { createStyles, getStylesRef, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { DrawerTypeMoneyForm } from "../../components/DrawerTypeMoneyForm/DrawerTypeMoneyForm";

const useStyles = createStyles((theme) => ({
  container: {
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.xs,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },
  thead: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[4],
  },
  center: {
    textAlign: "center",
  },
  td: {
    textAlign: "center",
    color: theme.colors.blue[8],
  },
}));

interface typeMoneyInterface {
  id?: number;
  code: string;
  money_type: string;
  durable_goods: number;
  building: number;
}

export default function TypeMoney() {
  const { classes } = useStyles();

  const typeMoneyStore = useTypeMoneyStore();

  const getTypeMoneys = async () => {
    await typeMoneyStore.fetchTypeMoney();
  };

  const delTypeMoneys = (id: number | undefined) => {
    if (id !== undefined) {
      typeMoneyStore.deleteTypeMoney(id).catch((error) => {
        console.log("error =>", error);
      });
    } else {
      console.log("Invalid id");
    }
  };

  const [opened, { toggle }] = useDisclosure(false);
  const [typeMoney, setTypeMoney] = useState<typeMoneyInterface | undefined>(
    undefined
  );

  const rows = typeMoneyStore.typeMoney.map((value, key) => {
    return (
      <tr key={key}>
        <td className={classes.center}>{value.code}</td>
        <td>{value.money_type}</td>
        <td className={classes.td}>{value.durable_goods}</td>
        <td className={classes.td}>{value.building}</td>
        <td className={classes.center}>
          <Button
            size="xs"
            mx="xs"
            compact
            onClick={() => {
              setTypeMoney(value);
              toggle();
            }}
          >
            <IconPencil />
            แก้ไข
          </Button>
          <Button
            color="red"
            size="xs"
            compact
            onClick={() => delTypeMoneys(value.id)}
          >
            <IconX />
            ลบ
          </Button>
        </td>
      </tr>
    );
  });
  useEffect(() => {
    getTypeMoneys().catch((error) => {
      console.log("error =", error);
    });
  }, []);
  return (
    <>
      <Container fluid px="xs" className={classes.container}>
        <Grid mt="sm">
          <Grid.Col md={2}>
            <Text size="lg">ประเภทเงิน</Text>
          </Grid.Col>
          <Grid.Col md={"auto"} offset={9}>
            <Button
              color="green"
              size="xs"
              onClick={() => {
                toggle(), setTypeMoney(undefined);
              }}
            >
              <IconPlus /> เพิ่มข้อมูล
            </Button>
          </Grid.Col>
        </Grid>
        <Space h="md" />

        <Table striped highlightOnHover withColumnBorders>
          <thead className={classes.thead}>
            <tr>
              <th>
                <Text ta="center">รหัส</Text>
              </th>
              <th>
                <Text>ประเภทการจัดหา</Text>
              </th>
              <th>
                <Text ta="center" color="blue.8">
                  ครุภัณฑ์ (รายการ)
                </Text>
              </th>
              <th>
                <Text ta="center" color="blue.8">
                  สิ่งก่อสร้าง (รายการ)
                </Text>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <Grid mt="sm" justify="flex-end">
          <Grid.Col span={10}></Grid.Col>
          <Grid.Col span="auto">
            <Text ta="right">
              ค้นเจอทั้งหมด {typeMoneyStore.typeMoney.length} รายการ
            </Text>
          </Grid.Col>
        </Grid>
      </Container>

      <DrawerTypeMoneyForm
        opened={opened}
        onClose={toggle}
        TypeMoney={typeMoney}
      />
    </>
  );
}
