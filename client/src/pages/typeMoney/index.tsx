import { useEffect, useState } from "react";
import { sortBy } from "lodash";
import { useDisclosure } from "@mantine/hooks";
import {
  DataTable,
  DataTableSortStatus,
  DataTablePaginationProps,
} from "mantine-datatable";
import { Card, Group, Text, Button, Grid } from "@mantine/core";
import { shallow } from "zustand/shallow";
import { IconPencil, IconX, IconPlus } from "@tabler/icons-react";

import useTypeMoneyStore from "@/store/TypeMoneyStore";
import { DrawerTypeMoneyForm } from "@/components/DrawerTypeMoneyForm/DrawerTypeMoneyForm";

interface TypeMoneyInterface {
  id?: number;
  code: string;
  money_type: string;
  durable_goods: number;
  building: number;
}

export default function TypeMoney() {
  const { fetchTypeMoney, deleteTypeMoney, typeMoney } = useTypeMoneyStore(
    (state) => ({
      fetchTypeMoney: state.fetchTypeMoney,
      deleteTypeMoney: state.deleteTypeMoney,
      typeMoney: state.typeMoney,
    }),
    shallow
  );

  const getTypeMoneys = async () => {
    await fetchTypeMoney();
  };

  const delTypeMoneys = (id: number | undefined) => {
    if (id !== undefined) {
      deleteTypeMoney(id).catch((error) => {
        console.log("error =>", error);
      });
    } else {
      console.log("Invalid id");
    }
  };

  const PAGE_SIZE = 10;

  const [opened, { toggle }] = useDisclosure(false);
  const [typeMoneyData, setTypeMoneyData] = useState<
    TypeMoneyInterface | undefined
  >(undefined);
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(typeMoney.slice(0, PAGE_SIZE));
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "index",
    direction: "desc",
  });

  useEffect(() => {
    getTypeMoneys().catch((error) => {
      console.log("error =", error);
    });

    const data = sortBy(
      typeMoney,
      sortStatus.columnAccessor
    ) as TypeMoneyInterface[];
    setRecords(sortStatus.direction === "desc" ? data.reverse() : data);

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(typeMoney.slice(from, to));
  }, [page, sortStatus]);

  return (
    <>
      <Card shadow="sm">
        <Card.Section withBorder p="sm">
          <Group position="apart">
            <Group>
              <Text size="lg">ประเภทเงิน</Text>
            </Group>
            <Group>
              <Button
                color="green"
                leftIcon={<IconPlus size={16} />}
                onClick={() => {
                  toggle();
                  setTypeMoneyData(undefined);
                }}
              >
                เพิ่มข้อมูล
              </Button>
            </Group>
          </Group>
        </Card.Section>

        <DataTable
          mt="md"
          withBorder
          withColumnBorders
          striped
          highlightOnHover
          verticalAlignment="top"
          records={records}
          columns={[
            {
              accessor: "index",
              title: "รหัส",
              textAlignment: "center",
              width: 10,
              render: ({ code }) => `${code}`,
              sortable: true,
            },
            {
              accessor: "money_type",
              title: "ประเภทเงิน",
              render: ({ money_type }) => `${money_type}`,
              width: 160,
              sortable: true,
            },
            {
              accessor: "durable_goods",
              title: "ครุภัณฑ์ (รายการ)",
              width: 40,
              textAlignment: "center",
              render: ({ durable_goods }) => `${durable_goods}`,
              // column is only visible when screen width is over `theme.breakpoints.xs`
              visibleMediaQuery: (theme) =>
                `(min-width: ${theme.breakpoints.xs})`,
              sortable: true,
            },
            {
              // "virtual column"
              accessor: "building",
              title: "สิ่งก่อสร้าง (รายการ)",
              width: 40,
              textAlignment: "center",
              // column is only visible when screen width is over `theme.breakpoints.xs`
              visibleMediaQuery: (theme) =>
                `(min-width: ${theme.breakpoints.xs})`,
              render: ({ building }) => `${building}`,
              sortable: true,
            },
            {
              // "virtual column"
              accessor: "manage",
              title: "",
              width: 40,
              textAlignment: "center",
              render: ({ id }) => (
                <>
                  <Button size="xs" mx="xs">
                    แก้ไข
                  </Button>
                  <Button color="red" size="xs">
                    ลบ
                  </Button>
                </>
              ),
            },
          ]}
          totalRecords={typeMoney.length}
          recordsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={(p) => setPage(p)}
          paginationColor="gray"
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          paginationText={({ from, to, count }) =>
            `แสดงข้อมูล ${from} ถึง ${to} จากทั้งหมด ${count} รายการ`
          }
        />
      </Card>

      <DrawerTypeMoneyForm
        opened={opened}
        onClose={toggle}
        TypeMoney={typeMoneyData}
      />
    </>
  );
}
