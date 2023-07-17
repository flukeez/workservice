import { useEffect } from "react";
import { Link } from "react-router-dom";

import { IconPencil, IconX, IconPlus, IconSearch } from "@tabler/icons-react";
import {
  Container,
  Table,
  Text,
  Button,
  Grid,
  Space,
  Input,
} from "@mantine/core";
import { shallow } from "zustand/shallow";
import useTypeManageStore from "../../store/TypeManageStore";

import { createStyles } from "@mantine/core";

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

export default function TypeManage() {
  const { classes } = useStyles();

  const { fetchTypeManage, deleteTypeManage, typeManage } = useTypeManageStore(
    (state) => ({
      fetchTypeManage: state.fetchTypeManage,
      deleteTypeManage: state.deleteTypeManage,
      typeManage: state.typeManage,
    }),
    shallow
  );

  const getTypeManages = async () => {
    await fetchTypeManage();
  };

  const delTypeManages = (id: number | undefined) => {
    if (id !== undefined) {
      deleteTypeManage(id).catch((error) => {
        console.log("error =>", error);
      });
    } else {
      console.log("Invalid id");
    }
  };

  const rows = typeManage.map((value, key) => {
    return (
      <tr key={key}>
        <td className={classes.center}>{value.code}</td>
        <td>{value.manage_type}</td>
        <td className={classes.td}>{value.durable_goods}</td>
        <td className={classes.td}>{value.building}</td>
        <td className={classes.center}>
          <Button
            size="xs"
            mx="xs"
            compact
            component={Link}
            to={value.id ? `edit/${value.id.toString()}` : ""}
          >
            <IconPencil />
            แก้ไข
          </Button>
          <Button
            color="red"
            size="xs"
            compact
            onClick={() => delTypeManages(value.id)}
          >
            <IconX />
            ลบ
          </Button>
        </td>
      </tr>
    );
  });
  useEffect(() => {
    getTypeManages().catch((error) => {
      console.log("error =", error);
    });
  }, []);
  return (
    <>
      <Container fluid px="xs" className={classes.container}>
        <Grid mt="sm">
          <Grid.Col md={2}>
            <Text size="lg">ประเภทการจัดหา</Text>
          </Grid.Col>
          <Grid.Col md={"auto"} offset={9}>
            <Button
              color="green"
              size="xs"
              component={Link}
              to={"/typeManages/add"}
            >
              <IconPlus /> เพิ่มข้อมูล
            </Button>
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col md={4}>
            <Input icon={<IconSearch />} placeholder="ค้นหา ชื่อ" />
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
              {/* ค้นเจอทั้งหมด {typeManageStore.typeManage.length} รายการ */}
            </Text>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
