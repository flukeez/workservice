import { useEffect, useState } from "react";
import {
  Card,
  Drawer,
  Grid,
  Group,
  Highlight,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { IconCheck } from "@tabler/icons-react";
import InputSearch from "@/components/common/InputSearch";
import PageHeader from "@/components/common/PageHeader";
import { usePositionStore } from "@/stores/usePositionStore";
import { usePositionDelete, usePositions } from "@/hooks/position";
import PositionForm from "@/components/position/PositionForm";
import AlertErrorDialog from "@/components/common/AlertErrorDialog";
import AlertSuccessDialog from "@/components/common/AlertSuccessDialog";
import ButtonNew from "@/components/common/ButtonNew";
import ButtonEdit from "@/components/common/ButtonEdit";
import ButtonDelete from "@/components/common/ButtonDelete";
import { PAGE_SIZE } from "@/config";
import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";

const title = "ตำแหน่งงาน";
const listItems = [{ title: title, href: "#" }];
export default function Position() {
  const positionStore = usePositionStore();
  const [debounce] = useDebouncedValue(positionStore.txtSearch, 500);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: positionStore.sortField,
    direction: positionStore.sortDirection,
  });
  const [opened, setOpened] = useState(false);
  const [rowId, setRowId] = useState("0");
  const setCondition = () => {
    const condition = {
      txtSearch: positionStore.txtSearch,
      sortField: positionStore.sortField,
      sortDirection: positionStore.sortDirection,
      page: positionStore.page - 1,
    };
    return condition;
  };

  const { data, isLoading, setFilter } = usePositions(setCondition());
  const mutationDelete = usePositionDelete();
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
    positionStore.setFilter({
      ...positionStore,
      txtSearch: "",
      page: 1,
    });
  };

  useEffect(() => {
    searchData();
  }, [debounce, positionStore.page, sortStatus]);
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
          <PositionForm onClose={() => setOpened(false)} rowId={rowId} />
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
                placeholder="ค้นหาประเภทตำแหน่ง"
                onChange={(e) =>
                  positionStore.setFilter({
                    ...positionStore,
                    txtSearch: e.target.value,
                    page: 1,
                  })
                }
                onClearSearch={clearSearchData}
                onSearchData={searchData}
                value={positionStore.txtSearch}
              />
            </Grid.Col>
          </Grid>
        </Card.Section>
        <ScrollArea>
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
                title: <Text fw={700}>ชื่อตำแหน่ง</Text>,
                width: "35%",
                sortable: true,
                render({ name }) {
                  return (
                    <Highlight size="sm" highlight={positionStore.txtSearch}>
                      {String(name)}
                    </Highlight>
                  );
                },
              },
              {
                accessor: "super_admin",
                title: <Text fw={700}>สิทธิ์หัวหน้างาน</Text>,
                textAlign: "center",
                sortable: true,
                width: "5%",
                render({ super_admin }) {
                  return super_admin ? <IconCheck color="green" /> : null;
                },
              },
              {
                accessor: "id",
                title: <Text fw={700}>จัดการ</Text>,
                width: "0%",
                textAlign: "center",
                render: ({ id }) => (
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
              positionStore.setFilter({
                ...positionStore,
                sortField: sort.columnAccessor,
                sortDirection: sort.direction,
              }),
            ]}
            totalRecords={data?.totalItem || 0}
            recordsPerPage={PAGE_SIZE}
            page={positionStore.page}
            onPageChange={(p: number) =>
              positionStore.setFilter({ ...positionStore, page: p })
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
        </ScrollArea>
      </Card>
    </>
  );
}
