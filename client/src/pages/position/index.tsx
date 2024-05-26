import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Button,
  Card,
  Drawer,
  Grid,
  Group,
  Highlight,
  Menu,
  ScrollArea,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { IconCheck, IconChevronDown, IconPlus } from "@tabler/icons-react";
import InputSearch from "@/components/common/InputSearch";
import PageHeader from "@/components/common/PageHeader";
import { usePositionStore } from "@/stores/usePositionStore";
import { usePositionDelete, usePositions } from "@/hooks/position";
import PositionForm from "@/components/position/PositionForm";

const title = "ตำแหน่งงาน";
const listItems = [{ title: title, href: "#" }];
const Page_size = 10;
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
      limit: Page_size,
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
  const handleDelete = async (id: string) => {
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
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง",
      });
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
        title={title}
        position="right"
      >
        {opened ? (
          <PositionForm onClose={() => setOpened(false)} rowId={rowId} />
        ) : null}
      </Drawer>
      <PageHeader title={title} listItems={listItems} />
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="md">
          <Group justify="right">
            <Button
              color="green"
              leftSection={<IconPlus />}
              onClick={handleNew}
            >
              เพิ่มข้อมูล
            </Button>
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
                title: "ชื่อตำแหน่ง",
                width: "35%",
                sortable: true,
                render({ name }) {
                  return (
                    <Highlight highlight={positionStore.txtSearch}>
                      {String(name)}
                    </Highlight>
                  );
                },
              },
              {
                accessor: "faculty_name",
                title: "หน่วยงาน",
                width: "30%",
                sortable: true,
              },
              {
                accessor: "super_admin",
                title: "สิทธิ์หัวหน้างาน",
                textAlign: "center",
                sortable: true,
                width: "20%",
                render({ super_admin }) {
                  return super_admin ? <IconCheck color="green" /> : null;
                },
              },
              {
                accessor: "id",
                title: "จัดการ",
                width: "0%",
                textAlign: "center",
                render: ({ id }) => (
                  <>
                    <Menu withArrow position="bottom">
                      <Menu.Target>
                        <Button
                          hiddenFrom="md"
                          color="blue"
                          rightSection={
                            <IconChevronDown size="1.05rem" stroke={1.5} />
                          }
                          pr={12}
                          size="xs"
                        >
                          จัดการ
                        </Button>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item onClick={() => handleUpdate(String(id))}>
                          แก้ไข
                        </Menu.Item>
                        <Menu.Item
                          onClick={() => {
                            handleDelete(String(id));
                          }}
                        >
                          ลบ
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                    <Group justify="center" visibleFrom="md" wrap="nowrap">
                      <Button
                        size="xs"
                        mx="xs"
                        onClick={() => handleUpdate(String(id))}
                      >
                        แก้ไข
                      </Button>
                      <Button
                        color="red"
                        size="xs"
                        onClick={() => handleDelete(String(id))}
                      >
                        ลบ
                      </Button>
                    </Group>
                  </>
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
            recordsPerPage={Page_size}
            page={positionStore.page}
            onPageChange={(p: number) =>
              positionStore.setFilter({ ...positionStore, page: p })
            }
            paginationText={({ from, to, totalRecords }) =>
              `แสดงข้อมูล ${from} ถึง ${to} จากทั้งหมด ${totalRecords} รายการ`
            }
            paginationActiveBackgroundColor="gray"
            noRecordsText="ไม่พบรายการ"
            noRecordsIcon={<></>}
            minHeight={120}
            fetching={isLoading}
          />
        </ScrollArea>
      </Card>
    </>
  );
}
