import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
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
import { IconChevronDown, IconFolderOpen, IconPlus } from "@tabler/icons-react";
import PageHeader from "@/components/common/PageHeader";
import InputSearch from "@/components/common/InputSearch";
import FacultyForm from "@/components/faculty/FacultyForm";
import { useFacultyDelete, useFacultys } from "@/hooks/faculty";
import { useFacultyStore } from "@/stores/useFacultyStore";
import { PAGE_SIZE } from "@/config";

const title = "หน่วยงาน";
const listItems = [{ title: title, href: "#" }];
export default function Faculty() {
  const navigate = useNavigate();
  const facultyStore = useFacultyStore();
  const [debounce] = useDebouncedValue(facultyStore.txtSearch, 500);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: facultyStore.sortField,
    direction: facultyStore.sortDirection,
  });
  const [opened, setOpened] = useState(false);
  const [rowId, setRowId] = useState("0");

  const setCondition = () => {
    const condition = {
      txtSearch: facultyStore.txtSearch,
      page: facultyStore.page - 1,
      limit: PAGE_SIZE,
      sortField: sortStatus.columnAccessor,
      sortDirection: sortStatus.direction,
    };
    return condition;
  };

  const { data, isLoading, setFilter } = useFacultys(setCondition());
  const mutationDelete = useFacultyDelete();

  const handleNew = () => {
    setRowId("0");
    setOpened(true);
  };
  const handleUpdate = (id: string) => {
    setRowId(id);
    setOpened(true);
  };
  const handleDelete = async (id: string) => {
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
    facultyStore.setFilter({ ...facultyStore, txtSearch: "", page: 1 });
  };

  useEffect(() => {
    searchData();
  }, [debounce, facultyStore.page, sortStatus]);

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
          <FacultyForm onClose={() => setOpened(false)} id={rowId} />
        ) : null}
      </Drawer>
      <PageHeader title={title} listItems={listItems} />
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="md">
          <Group justify="right">
            <Button
              color="green"
              leftSection={<IconPlus size="1rem" />}
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
                placeholder="ค้นหาจากชื่อหน่วยงาน, หน่วยงานต้นสังกัด"
                onChange={(e) =>
                  facultyStore.setFilter({
                    ...facultyStore,
                    txtSearch: e.target.value,
                    page: 1,
                  })
                }
                onClearSearch={clearSearchData}
                onSearchData={searchData}
                value={facultyStore.txtSearch}
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
                title: "ชื่อหน่วยงาน",
                width: "45%",
                sortable: true,
                render({ name }) {
                  return (
                    <Highlight highlight={facultyStore.txtSearch}>
                      {String(name)}
                    </Highlight>
                  );
                },
              },
              {
                accessor: "faculty_name",
                title: "หน่วยงงานต้นสังกัด",
                width: "20%",
                sortable: true,
                render({ faculty_name }) {
                  return (
                    <Highlight highlight={facultyStore.txtSearch}>
                      {String(faculty_name || "")}
                    </Highlight>
                  );
                },
              },
              {
                accessor: "org_chart",
                title: "แผนผังองค์กร",
                width: "10%",
                textAlign: "center",
                render({ id }) {
                  return (
                    <Button
                      leftSection={<IconFolderOpen size="1.25rem" />}
                      color="cyan"
                      size="xs"
                      onClick={() => navigate("organize_chart/" + id)}
                    >
                      เรียกดู
                    </Button>
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
            onSortStatusChange={(sort) => {
              setSortStatus(sort);
              facultyStore.setFilter({
                ...facultyStore,
                sortField: sort.columnAccessor,
                sortDirection: sort.direction,
              });
            }}
            totalRecords={data?.totalItem || 0}
            recordsPerPage={PAGE_SIZE}
            page={facultyStore.page}
            onPageChange={(p: number) =>
              facultyStore.setFilter({ ...facultyStore, page: p })
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
