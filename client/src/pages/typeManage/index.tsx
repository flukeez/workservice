import { useEffect, useState } from "react";
import { sortBy } from "lodash";
import Axios from "axios";

import { useDisclosure } from "@mantine/hooks";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { Card, Group, Text, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import BreadcrumbNavigation from "@/components/breadcrumb_navigation/BreadcrumbNavigation";
import TypeMoney from "../typeMoney";

interface TypeManageInterface {
  id: number;
  code: string;
  manage_type: string;
  durable_goods: number;
  building: number;
}

export default function TypeManage() {
  const [opened, { toggle }] = useDisclosure(false);
  const [loading, setLoading] = useState(true); //ถ้าไม่รอโหลด เวลาเอา typemoney มาsort มันจะยังไม่มีค่า หรือจะเอาทั้งหมดไปใส่ใน getTypemoney ก้ได้ แต่มันจะfetch ข้อมูลบ่อย
  const [typeManage, setTypeManage] = useState<TypeManageInterface[]>([]); //ไว้เก็บข้อมูลทั้งหมด
  const [typeManageData, setTypeManageData] = useState<
    TypeManageInterface | undefined
  >(undefined); //เวลาดึงไปใช้แค่ไอดีเดียว
  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1); //เลขหน้า เริ่มจาก 1

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "code",
    direction: "asc",
  });
  const [record, setRecord] = useState<TypeManageInterface[]>([]);

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

  const updateTypeManage = (id: number) => {
    const selectTypeManage = record.find((data) => data.id === id);
    setTypeManageData(selectTypeManage);
    toggle();
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
  useEffect(() => {
    void getTypeManages();
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
          <Group position="right">
            <Button
              color="green"
              leftIcon={<IconPlus size={16} />}
              onClick={() => {
                toggle();
                setTypeManageData(undefined);
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
              width: "5%",
              sortable: true,
            },
            {
              accessor: "manage_type",
              title: "ประเภทเงิน",
              sortable: true,
              width: "35%",
              render: ({ manage_type, id }) => (
                <Text c="blue" onClick={() => updateTypeManage(id)}>
                  {manage_type}
                </Text>
              ),
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
                  <Button
                    size="xs"
                    mx="xs"
                    onClick={() => updateTypeManage(id)}
                  >
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
          totalRecords={TypeMoney.length}
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
