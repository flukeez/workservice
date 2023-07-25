import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sortBy } from "lodash";
import Axios from "axios";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useDebouncedValue } from "@mantine/hooks";
import { Card, Group, Text, Button, Input } from "@mantine/core";
import { IconSearch, IconPlus, IconX } from "@tabler/icons-react";

import BreadcrumbNavigation from "@/components/breadcrumb_navigation/BreadcrumbNavigation";

interface TypeManageInterface {
  id: number;
  code: string;
  manage_type: string;
  durable_goods: number;
  building: number;
}

export default function TypeManage() {
  const [loading, setLoading] = useState(true); //ถ้าไม่รอโหลด เวลาเอา typemoney มาsort มันจะยังไม่มีค่า หรือจะเอาทั้งหมดไปใส่ใน getTypemoney ก้ได้ แต่มันจะfetch ข้อมูลบ่อย
  const [typeManage, setTypeManage] = useState<TypeManageInterface[]>([]); //ไว้เก็บข้อมูลทั้งหมด
  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1); //เลขหน้า เริ่มจาก 1

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "code",
    direction: "asc",
  });
  const [record, setRecord] = useState<TypeManageInterface[]>([]);

  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue(search, 200);

  const getTypeManages = async () => {
    try {
      const response = await Axios.get<{ rows: TypeManageInterface[] }>(
        "http://localhost:4000/api/typeManages"
      );
      setTypeManage(response.data.rows);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTypeManage = async (id: number) => {
    try {
      const response = await Axios.delete(
        `http://localhost:4000/api/typeManages/${id}`
      );
      setRecord(record.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const searchTypeMoney = async (searchTxt: string) => {
    try {
      setLoading(true);
      const response = await Axios.get<{ row: TypeManageInterface[] }>(
        `http://localhost:4000/api/typeManages/search/${searchTxt}`
      );
      setTypeManage(response.data.row);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const queryClient = new QueryClient();
  const query = useQuery({ queryKey: ["typeManage"], queryFn: getTypeManages });

  const resetSearch = () => {
    // void getTypeManages();
    setSearch("");
    setLoading(true);
  };
  useEffect(() => {
    // void getTypeManages();
  }, []);

  useEffect(() => {
    if (!loading) {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE;
      const sortData = sortBy(typeManage, sortStatus.columnAccessor);
      const sortedData =
        sortStatus.direction === "desc" ? sortData.reverse() : sortData;
      const paginatedData = sortedData.slice(from, to);
      setRecord(paginatedData);
    }
  }, [loading, page, sortStatus]);

  return (
    <>
      <BreadcrumbNavigation label="ประเภทการจัดการ" />
      <Card shadow="xs" mt="sm">
        <Card.Section withBorder p="sm">
          {JSON.stringify(query.data)}
          <Group position="apart">
            <Input
              placeholder="ค้นหา รหัส, ชื่อ"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              rightSection={
                <>
                  <IconSearch
                    size="1rem"
                    onClick={() => void searchTypeMoney(debounced)}
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
              component={Link}
              to="add"
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
              width: "5%",
              sortable: true,
            },
            {
              accessor: "manage_type",
              title: "ประเภทเงิน",
              sortable: true,
              width: "35%",
              render: ({ manage_type, id }) => <Text>{manage_type}</Text>,
            },
            {
              accessor: "durable_goods",
              title: "ครุภัณฑ์ (รายการ)",
              textAlignment: "center",
              sortable: true,
              width: "10%",
            },
            {
              accessor: "building",
              title: "สิ่งก่อสร้าง (รายการ)",
              textAlignment: "center",
              sortable: true,
              width: "10%",
            },
            {
              accessor: "id",
              title: "...",
              width: "10%",
              textAlignment: "center",
              render: ({ id }) => (
                <>
                  <Button size="xs" mx="xs" component={Link} to={`edit/${id}`}>
                    แก้ไข
                  </Button>
                  <Button
                    color="red"
                    size="xs"
                    onClick={() => void deleteTypeManage(id)}
                  >
                    ลบ
                  </Button>
                </>
              ),
            },
          ]}
          totalRecords={typeManage.length}
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
    </>
  );
}
