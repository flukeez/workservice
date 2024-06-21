import { useEffect, useState } from "react";
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
import { useDebouncedValue } from "@mantine/hooks";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useEquipStatues, useEquipStatusDelete } from "@/hooks/equip_status";
import { useEquipStatusStore } from "@/stores/useEquipStatusStore";
import InputSearch from "@/components/common/InputSearch";
import PageHeader from "@/components/common/PageHeader";
import EquipStatusForm from "@/components/equip_status/EquipStatusForm";
import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";
import AlertErrorDialog from "@/components/common/AlertErrorDialog";
import AlertSuccessDialog from "@/components/common/AlertSuccessDialog";
import ButtonNew from "@/components/common/ButtonNew";
import { PAGE_SIZE } from "@/config";

const title = "สถานะอุปกรณ์";
const listItems = [{ title: title, href: "#" }];
export default function EquipStatus() {
  const equipStatusStore = useEquipStatusStore();
  const [debounce] = useDebouncedValue(equipStatusStore.txtSearch, 500);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: equipStatusStore.sortField,
    direction: equipStatusStore.sortDirection,
  });
  const [opened, setOpened] = useState(false);
  const [rowId, setRowId] = useState("0");
  const setCondition = () => {
    const condition = {
      txtSearch: equipStatusStore.txtSearch,
      sortField: equipStatusStore.sortField,
      sortDirection: equipStatusStore.sortDirection,
      page: equipStatusStore.page - 1,
    };
    return condition;
  };

  const { data, isLoading, setFilter } = useEquipStatues(setCondition());
  const mutationDelete = useEquipStatusDelete();
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
    equipStatusStore.setFilter({
      ...equipStatusStore,
      txtSearch: "",
      page: 1,
    });
  };

  useEffect(() => {
    searchData();
  }, [debounce, equipStatusStore.page, sortStatus]);
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
          <EquipStatusForm onClose={() => setOpened(false)} id={rowId} />
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
                placeholder="ค้นหาจากชื่อสถานะอุปกรณ์"
                onChange={(e) =>
                  equipStatusStore.setFilter({
                    ...equipStatusStore,
                    txtSearch: e.target.value,
                    page: 1,
                  })
                }
                onClearSearch={clearSearchData}
                onSearchData={searchData}
                value={equipStatusStore.txtSearch}
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
              width: "80%",
              title: <Text fw={700}>ชื่อสถานะอุปกรณ์</Text>,
              sortable: true,
              render({ name }) {
                return (
                  <Highlight highlight={equipStatusStore.txtSearch}>
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
              render: ({ id }) => (
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
            equipStatusStore.setFilter({
              ...equipStatusStore,
              sortField: sort.columnAccessor,
              sortDirection: sort.direction,
            }),
          ]}
          totalRecords={data?.totalItem || 0}
          recordsPerPage={PAGE_SIZE}
          page={equipStatusStore.page}
          onPageChange={(p: number) =>
            equipStatusStore.setFilter({ ...equipStatusStore, page: p })
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
