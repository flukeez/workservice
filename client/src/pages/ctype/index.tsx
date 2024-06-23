import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Drawer,
  Grid,
  Group,
  LoadingOverlay,
  Pagination,
  Table,
  Text,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import { axiosAuth } from "@/utils/axios";
import { CtypeForm } from "@/components/ctype/CtypeForm";
import { useCtype } from "@/hooks/ctype/useCtype";
import InputSearch from "@/components/common/InputSearch";
import { useDebouncedValue } from "@mantine/hooks";

export default function Ctype() {
  const [opened, setOpened] = useState(false);
  const [page, setPage] = useState(1);
  const [rowId, setRowId] = useState("");
  const [textSearch, setTextSearch] = useState("");
  const [debounce] = useDebouncedValue(textSearch, 500);

  const setCondition = () => {
    const condition = {
      textSearch: textSearch,
      activePage: page - 1,
      limit: 10,
    };
    return condition;
  };

  const { data, isLoading, setFilter } = useCtype(setCondition());

  const handleNew = () => {
    setRowId("");
    setOpened(true);
  };
  const handleEdit = (id: string) => {
    setRowId(id);
    setOpened(true);
  };
  const handleDelete = async (id: string, name: string) => {
    await axiosAuth.delete("/ctype/" + id);
  };

  const searchData = () => {
    setFilter(setCondition());
  };
  const clearSearchData = () => {
    setTextSearch("");
  };

  useEffect(() => {
    searchData();
  }, [page, debounce]);

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      {/* <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="ประเภทสินค้า"
        position="right"
      >
        {opened ? (
          <CtypeForm
            onClose={() => setOpened(false)}
            reFetchData={fetchData}
            id={rowId}
          />
        ) : null}
      </Drawer> */}

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
          <Grid ms="sm" mt="md">
            <Grid.Col span={{ md: 4 }}>
              <InputSearch
                placeholder="ค้นหาจากชื่อประเภท"
                onChange={(e) => [setPage(1), setTextSearch(e.target.value)]}
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
              <Table.Th>ID</Table.Th>
              <Table.Th>ชื่อประเภท</Table.Th>
              <Table.Th style={{ width: "200px" }}>...</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data?.rows &&
              data.rows.map((row: any) => (
                <Table.Tr key={row.id}>
                  <Table.Td>{row.id}</Table.Td>
                  <Table.Td>{row.name}</Table.Td>
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
            value={page}
            onChange={setPage}
          />
        </Group>
      </Card>
    </>
  );
}
