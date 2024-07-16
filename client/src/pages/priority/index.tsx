import { useEffect, useState } from "react";

import { useDebouncedValue } from "@mantine/hooks";
import { usePriorityDelete, usePrioritys } from "@/hooks/priority";

import { Card, Drawer, Grid, Group, Highlight, Text } from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";

import PriorityForm from "@/components/priority/PriorityForm";
import PageHeader from "@/components/common/PageHeader";
import InputSearch from "@/components/common/InputSearch";
import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";
import AlertErrorDialog from "@/components/common/AlertErrorDialog";
import AlertSuccessDialog from "@/components/common/AlertSuccessDialog";
import ButtonNew from "@/components/common/ButtonNew";
import ButtonEdit from "@/components/common/ButtonEdit";
import ButtonDelete from "@/components/common/ButtonDelete";

import { usePriorityStore } from "@/stores/usePriorityStore";
import { PAGE_SIZE } from "@/config";

const title = "ความเร่งด่วน";
const listItems = [{ title: title, href: "#" }];

export default function Priority() {
  const priorityStore = usePriorityStore();
  const [debounce] = useDebouncedValue(priorityStore.txtSearch, 500);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: priorityStore.sortField,
    direction: priorityStore.sortDirection,
  });
  const [opened, setOpened] = useState(false);
  const [rowId, setRowId] = useState("0");
  const setCondition = () => {
    const condition = {
      txtSearch: priorityStore.txtSearch,
      sortField: priorityStore.sortField,
      sortDirection: priorityStore.sortDirection,
      page: priorityStore.page - 1,
    };
    return condition;
  };

  const { data, isLoading, setFilter } = usePrioritys(setCondition());
  const mutationDelete = usePriorityDelete();
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
    priorityStore.setFilter({
      ...priorityStore,
      txtSearch: "",
      page: 1,
    });
  };

  useEffect(() => {
    searchData();
  }, [debounce, priorityStore.page, sortStatus]);
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
          <PriorityForm onClose={() => setOpened(false)} rowId={rowId} />
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
                placeholder="ค้นหาความเร่งด่วน"
                onChange={(e) =>
                  priorityStore.setFilter({
                    ...priorityStore,
                    txtSearch: e.target.value,
                    page: 1,
                  })
                }
                onClearSearch={clearSearchData}
                onSearchData={searchData}
                value={priorityStore.txtSearch}
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
              accessor: "name",
              title: <Text fw={700}>ชื่อความเร่งด่วน</Text>,
              width: "35%",
              sortable: true,
              render({ name }) {
                return (
                  <Highlight size="sm" highlight={priorityStore.txtSearch}>
                    {String(name)}
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
                  <ButtonEdit onClick={() => handleUpdate(String(id))} />
                  <ButtonDelete
                    onClick={() => handleDelete(String(id), String(name))}
                  />
                </Group>
              ),
            },
          ]}
          sortStatus={sortStatus}
          onSortStatusChange={(sort) => [
            setSortStatus(sort),
            priorityStore.setFilter({
              ...priorityStore,
              sortField: sort.columnAccessor,
              sortDirection: sort.direction,
            }),
          ]}
          totalRecords={data?.totalItem || 0}
          recordsPerPage={PAGE_SIZE}
          page={priorityStore.page}
          onPageChange={(p: number) =>
            priorityStore.setFilter({ ...priorityStore, page: p })
          }
          paginationText={({ from, to, totalRecords }) =>
            `แสดงข้อมูล ${from} ถึง ${to} จากทั้งหมด ${totalRecords} รายการ`
          }
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
