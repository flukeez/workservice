import { useEffect, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useCategories, useCategoryDelete } from "@/hooks/category";

import {
  Button,
  Card,
  Drawer,
  Grid,
  Group,
  Highlight,
  Text,
} from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { IconEdit, IconTrash } from "@tabler/icons-react";

import { useCategoryStore } from "@/stores/useCategoryStore";

import CategoryForm from "@/components/category/CategoryForm";
import InputSearch from "@/components/common/InputSearch";
import PageHeader from "@/components/common/PageHeader";
import ButtonNew from "@/components/common/ButtonNew";
import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";
import AlertErrorDialog from "@/components/common/AlertErrorDialog";
import AlertSuccessDialog from "@/components/common/AlertSuccessDialog";
import { PAGE_SIZE } from "@/config";

const title = "ประเภทอุปกรณ์";
const listItems = [{ title: title, href: "#" }];

export default function Category() {
  const categoryStore = useCategoryStore();
  const [debounce] = useDebouncedValue(categoryStore.txtSearch, 500);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: categoryStore.sortField,
    direction: categoryStore.sortDirection,
  });
  const [opened, setOpened] = useState(false);
  const [rowId, setRowId] = useState("0");
  const setCondition = () => {
    const condition = {
      txtSearch: categoryStore.txtSearch,
      sortField: categoryStore.sortField,
      sortDirection: categoryStore.sortDirection,
      page: categoryStore.page - 1,
    };
    return condition;
  };

  const { data, isLoading, setFilter } = useCategories(setCondition());
  const mutationDelete = useCategoryDelete();
  const handleNew = () => {
    setRowId("0");
    setOpened(true);
  };
  const handleUpdate = (id: string) => {
    setRowId(id);
    setOpened(true);
  };
  const handleDelete = async (id: string, name: string) => {
    const isConfirmed = await ConfirmDeleteDialog({
      html: `คุณต้องการลบรายการนี่ใช่หรือไม่<p>${name}</p>`,
    });

    if (isConfirmed) {
      try {
        const { data } = await mutationDelete.mutateAsync(id);
        if (data.message === "failed") {
          // จัดการกรณีลบไม่สำเร็จ (ถ้ามี)
          await AlertErrorDialog({ title: "ลบข้อมูลไม่สำเร็จ !!" });
        } else {
          await AlertSuccessDialog({ title: "ลบข้อมูลสำเร็จ" });
        }
      } catch (error) {
        await AlertErrorDialog({
          html: "ลบข้อมูลไม่สำเร็จ เนื่องจากหมดเวลาเชื่อมต่อ ให้ออกจากระบบ แล้วเข้าใหม่",
        });
      }
    }
  };

  const searchData = () => {
    setFilter(setCondition());
  };

  const clearSearchData = () => {
    categoryStore.setFilter({
      ...categoryStore,
      txtSearch: "",
      page: 1,
    });
  };

  useEffect(() => {
    searchData();
  }, [debounce, categoryStore.page, sortStatus]);
  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={`${title} ${rowId !== "0" ? "(แก้ไข)" : "(เพิ่ม)"}`}
        size="lg"
        position="right"
        closeOnClickOutside={false}
        offset={8}
        radius="md"
      >
        {opened ? (
          <CategoryForm onClose={() => setOpened(false)} id={rowId} />
        ) : null}
      </Drawer>
      <PageHeader title={title} listItems={listItems} />
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="md">
          <Group justify="right">
            <ButtonNew onClick={handleNew}>เพิ่มข้อมูล</ButtonNew>
          </Group>
        </Card.Section>
        <Card.Section>
          <Grid mx="md" mt="md">
            <Grid.Col span={{ md: 4 }}>
              <InputSearch
                placeholder="ค้นหาจากรหัส, ชื่อประเภทอุปกรณ์"
                onChange={(e) =>
                  categoryStore.setFilter({
                    ...categoryStore,
                    txtSearch: e.target.value,
                    page: 1,
                  })
                }
                onClearSearch={clearSearchData}
                onSearchData={searchData}
                value={categoryStore.txtSearch}
              />
            </Grid.Col>
          </Grid>
        </Card.Section>
        <DataTable
          mt="md"
          withTableBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          records={data?.rows}
          columns={[
            {
              accessor: "code",
              width: "15%",
              title: (
                <Text ml={24} fw={700}>
                  รหัส
                </Text>
              ),
              sortable: true,
              textAlign: "center",
              render({ code }) {
                return (
                  <Highlight highlight={categoryStore.txtSearch}>
                    {String(code)}
                  </Highlight>
                );
              },
            },
            {
              accessor: "issue_name",
              title: "ชื่อประเภทอุปกรณ์",
              sortable: true,
              render({ name }) {
                return (
                  <Highlight highlight={categoryStore.txtSearch}>
                    {String(name || "")}
                  </Highlight>
                );
              },
            },
            {
              accessor: "id",
              title: "จัดการ",
              width: "0%",
              textAlign: "center",
              render: ({ id, name }) => (
                <Group justify="center" gap={3} wrap="nowrap">
                  <Button
                    variant="subtle"
                    size="compact-md"
                    onClick={() => handleUpdate(String(id))}
                  >
                    <IconEdit size={"18"} />
                  </Button>
                  <Button
                    variant="subtle"
                    size="compact-md"
                    color="red"
                    onClick={() => handleDelete(String(id), String(name))}
                  >
                    <IconTrash size={"18"} />
                  </Button>
                </Group>
              ),
            },
          ]}
          sortStatus={sortStatus}
          onSortStatusChange={(sort) => [
            setSortStatus(sort),
            categoryStore.setFilter({
              ...categoryStore,
              sortField: sort.columnAccessor,
              sortDirection: sort.direction,
            }),
          ]}
          totalRecords={data?.totalItem || 0}
          recordsPerPage={PAGE_SIZE}
          page={categoryStore.page}
          onPageChange={(p: number) =>
            categoryStore.setFilter({ ...categoryStore, page: p })
          }
          paginationText={({ from, to, totalRecords }) =>
            `แสดงข้อมูล ${from} ถึง ${to} จากทั้งหมด ${totalRecords} รายการ`
          }
          paginationActiveBackgroundColor="gray"
          noRecordsText="ไม่พบรายการ"
          noRecordsIcon={<></>}
          minHeight={120}
          fetching={isLoading}
          pinLastColumn
          pinFirstColumn
        />
      </Card>
    </>
  );
}
