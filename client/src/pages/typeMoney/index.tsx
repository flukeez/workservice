import { useEffect, useState } from "react";
import { sortBy } from "lodash";
import Axios from "axios";

import { useDisclosure, useDebouncedValue } from "@mantine/hooks";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { Card, Group, Text, Button, Input } from "@mantine/core";
import { IconSearch, IconPlus, IconX } from "@tabler/icons-react";

import { DrawerTypeMoneyForm } from "@/pages/typeMoney/components/DrawerTypeMoneyForm";
import BreadcrumbNavigation from "@/components/breadcrumb_navigation/BreadcrumbNavigation";

interface TypeMoneyInterface {
  id: number;
  code: string;
  money_type: string;
  durable_goods: number;
  building: number;
}

export default function TypeMoney() {
  const [opened, { toggle }] = useDisclosure(false);
  const [loading, setLoading] = useState(true); //ถ้าไม่รอโหลด เวลาเอา typemoney มาsort มันจะยังไม่มีค่า หรือจะเอาทั้งหมดไปใส่ใน getTypemoney ก้ได้ แต่มันจะfetch ข้อมูลบ่อย
  const [typeMoney, setTypeMoney] = useState<TypeMoneyInterface[]>([]); //ไว้เก็บข้อมูลทั้งหมด
  const [typeMoneyData, setTypeMoneyData] = useState<number | undefined>(
    undefined
  ); //เวลาดึงไปใช้แค่ไอดีเดียว
  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1); //เลขหน้า เริ่มจาก 1

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "code",
    direction: "asc",
  });
  const [record, setRecord] = useState<TypeMoneyInterface[]>([]);

  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue(search, 200);

  const getTypeMoneys = async () => {
    try {
      setLoading(true);
      const response = await Axios.get<{ rows: TypeMoneyInterface[] }>(
        "http://localhost:4000/api/typeMoneys"
      );
      setTypeMoney(response.data.rows);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const updateTypeMoney = (id: number) => {
    setTypeMoneyData(id);
    toggle();
  };

  const deleteTypeMoney = async (id: number) => {
    try {
      const response = await Axios.delete(
        `http://localhost:4000/api/typeMoneys/${id}`
      );
      void getTypeMoneys();
    } catch (error) {
      console.log(error);
    }
  };

  const searchTypeMoney = async (searchTxt: string) => {
    try {
      setLoading(true);
      const response = await Axios.get<{ row: TypeMoneyInterface[] }>(
        `http://localhost:4000/api/typeMoneys/search/${searchTxt}`
      );
      setTypeMoney(response.data.row);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const resetSearch = () => {
    void getTypeMoneys();
    setSearch("");
  };

  useEffect(() => {
    void getTypeMoneys();
  }, []);

  useEffect(() => {
    if (!loading) {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE;
      const sortData = sortBy(typeMoney, sortStatus.columnAccessor);
      const sortedData =
        sortStatus.direction === "desc" ? sortData.reverse() : sortData;
      const paginatedData = sortedData.slice(from, to);
      setRecord(paginatedData);
    }
  }, [loading, page, sortStatus]);

  return (
    <>
      <BreadcrumbNavigation label={"ประเภทเงิน"} />
      <Card shadow="xs" mt="sm">
        <Card.Section withBorder p="sm">
          <Group position="apart">
            <Input
              placeholder="ค้นหา รหัส, ชื่อ"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              rightSection={
                <>
                  <IconSearch
                    size="1rem"
                    onClick={() => searchTypeMoney(debounced)}
                    style={{
                      display: "block",
                      opacity: 0.3,
                      cursor: "pointer",
                    }}
                  />
                  <IconX
                    size="1rem"
                    style={{
                      display: "block",
                      opacity: 0.3,
                      cursor: "pointer",
                    }}
                    onClick={() => resetSearch()}
                  />
                </>
              }
            />
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
        </Card.Section>

        <DataTable
          mt="md"
          withBorder
          withColumnBorders
          minHeight={150}
          striped
          highlightOnHover
          records={record}
          columns={[
            {
              accessor: "code",
              title: "รหัส",
              textAlignment: "center",
              width: "10%",
              sortable: true,
            },
            {
              accessor: "money_type",
              title: "ประเภทเงิน",
              sortable: true,
              width: "35%",
              render: ({ money_type, id }) => (
                <Text onClick={() => updateTypeMoney(id)}>{money_type}</Text>
              ),
            },
            {
              accessor: "durable_goods",
              title: "ครุภัณฑ์ (รายการ)",
              textAlignment: "center",
              sortable: true,
              width: "20%",
            },
            {
              accessor: "building",
              title: "สิ่งก่อสร้าง (รายการ)",
              textAlignment: "center",
              sortable: true,
              width: "20%",
            },
            {
              accessor: "id",
              title: "...",
              width: "15%",
              textAlignment: "center",
              render: ({ id }) => (
                <>
                  <Button size="xs" mx="xs" onClick={() => updateTypeMoney(id)}>
                    แก้ไข
                  </Button>
                  <Button
                    color="red"
                    size="xs"
                    onClick={() => void deleteTypeMoney(id)}
                  >
                    ลบ
                  </Button>
                </>
              ),
            },
          ]}
          totalRecords={typeMoney.length}
          recordsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={(p: number) => setPage(p)}
          paginationColor="dark.2"
          paginationText={({ from, to, totalRecords }) =>
            `แสดงข้อมูล ${from} ถึง ${to} จากทั้งหมด ${totalRecords} รายการ`
          }
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
        />
      </Card>

      <DrawerTypeMoneyForm
        opened={opened}
        onClose={toggle}
        id={typeMoneyData}
        getTypeMoneys={getTypeMoneys}
      />
    </>
  );
}
