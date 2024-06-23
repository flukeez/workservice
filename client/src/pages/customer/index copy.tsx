import { useState, useEffect } from "react";
import Swal from "sweetalert2";

import {
  Button,
  Card,
  Grid,
  Group,
  Highlight,
  LoadingOverlay,
  Pagination,
  Table,
  Text,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDebouncedValue } from "@mantine/hooks";

import { useCustomerStore } from "@/stores/useCustomerStore";
import { useCustomers } from "@/hooks/customer/useCustomers";

import InputSearch from "@/components/common/InputSearch";
import { useCustomerDelete } from "@/hooks/customer";
import { useNavigate } from "react-router-dom";
import { dateThaiLong } from "@/utils/mydate";

export default function CustomerPage() {
  const customerStore = useCustomerStore();
  const navigate = useNavigate();

  const [opened, setOpened] = useState(false);
  const [textSearch, setTextSearch] = useState(customerStore.textSearch);
  const [debounce] = useDebouncedValue(textSearch, 500);

  const setCondition = () => {
    const condition = {
      textSearch: textSearch,
      activePage: customerStore.activePage - 1,
      limit: 10,
    };
    return condition;
  };

  const { data, isLoading, setFilter } = useCustomers(setCondition());
  const mutationDelete = useCustomerDelete();

  const handleNew = () => {
    navigate("/customer/new");
  };

  const handleEdit = (id: string) => {};

  const handleDelete = async (id: string, name: string) => {
    try {
      const dialog = await Swal.fire({
        title: "คุณต้องการลบรายการนี้ใช่หรือไม่",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
      });
      if (dialog.isConfirmed) {
        await mutationDelete.mutateAsync(id);
        Swal.fire({
          title: "ลบข้อมูลสําเร็จ",
          icon: "success",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
      });
    }
  };

  const searchData = () => {
    setFilter(setCondition());
  };
  const clearSearchData = () => {
    customerStore.setFilter({
      ...customerStore,
      textSearch: "",
      activePage: 1,
    });
    setTextSearch("");
  };

  const handleChangeTextSearch = (text: string) => {
    customerStore.setFilter({
      ...customerStore,
      textSearch: text,
      activePage: 1,
    });
    setTextSearch(text);
  };

  useEffect(() => {
    searchData();
  }, [customerStore.activePage, debounce]);

  return (
    <>
      <LoadingOverlay visible={isLoading} />

      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="md">
          <Group justify="right">
            <Button
              color="green"
              leftSection={<IconPlus size={18} />}
              onClick={handleNew}
            >
              เพิ่มข้อมูล
            </Button>
          </Group>
        </Card.Section>
        <Card.Section>
          <Grid ms="md" mt="md">
            <Grid.Col span={{ md: 4 }}>
              <InputSearch
                placeholder="ค้นหาจากชื่อลูกค้า"
                onChange={(e) => handleChangeTextSearch(e.target.value)}
                onClearSearch={clearSearchData}
                onSearchData={searchData}
                value={textSearch}
              />
            </Grid.Col>
          </Grid>
        </Card.Section>
        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          mt="md"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ชื่อลูกค้า</Table.Th>
              <Table.Th>ที่อยู่</Table.Th>
              <Table.Th>เบอร์ติดต่อ</Table.Th>
              <Table.Th>วันที่ขาย</Table.Th>
              <Table.Th>วันที่รับเงิน</Table.Th>
              <Table.Th>ราคา</Table.Th>
              <Table.Th style={{ width: "200px" }}>...</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data?.rows &&
              data.rows.map((row: any) => (
                <Table.Tr key={row.id}>
                  <Table.Td>
                    <Highlight highlight={textSearch}>{row.name}</Highlight>
                  </Table.Td>
                  <Table.Td>{row.address}</Table.Td>
                  <Table.Td>{row.tel}</Table.Td>
                  <Table.Td>{dateThaiLong(row.insale, false)}</Table.Td>
                  <Table.Td>{dateThaiLong(row.paydate, false)}</Table.Td>
                  <Table.Td>{row.price}</Table.Td>
                  <Table.Td>
                    <Group gap={4} justify="center">
                      <Button
                        variant="light"
                        size="xs"
                        onClick={() => handleEdit(row.id)}
                      >
                        แก้ไข
                      </Button>
                      <Button
                        variant="light"
                        color="red"
                        size="xs"
                        onClick={() => handleDelete(row.id)}
                      >
                        delete
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
        <Group justify="space-between" mt="sm">
          <Text size="sm">ค้นเจอทั้งหมด {data?.totalItem || 0} รายการ</Text>
          <Pagination
            total={data?.totalPage || 1}
            value={customerStore.activePage}
            onChange={(value: number) =>
              customerStore.setFilter({ ...customerStore, activePage: value })
            }
          />
        </Group>
      </Card>
    </>
  );
}
