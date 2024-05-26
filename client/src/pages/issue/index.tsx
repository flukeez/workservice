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
import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { useIssueDelete, useIssues } from "@/hooks/issue";
import { useIssueStore } from "@/stores/useIssueStore";
import InputSearch from "@/components/common/InputSearch";
import PageHeader from "@/components/common/PageHeader";
import IssueForm from "@/components/issue/IssueForm";

const title = "ประเภทปัญหา";
const listItems = [{ title: title, href: "#" }];
const Page_size = 10;
export default function Issue() {
  const issueStore = useIssueStore();
  const [debounce] = useDebouncedValue(issueStore.txtSearch, 500);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: issueStore.sortField,
    direction: issueStore.sortDirection,
  });
  const [opened, setOpened] = useState(false);
  const [rowId, setRowId] = useState("0");
  const setCondition = () => {
    const condition = {
      txtSearch: issueStore.txtSearch,
      sortField: issueStore.sortField,
      sortDirection: issueStore.sortDirection,
      page: issueStore.page - 1,
      limit: Page_size,
    };
    return condition;
  };

  const { data, isLoading, setFilter } = useIssues(setCondition());
  const mutationDelete = useIssueDelete();
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
    issueStore.setFilter({
      ...issueStore,
      txtSearch: "",
      page: 1,
    });
  };

  useEffect(() => {
    searchData();
  }, [debounce, issueStore.page, sortStatus]);
  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={title}
        position="right"
      >
        {opened ? (
          <IssueForm onClose={() => setOpened(false)} rowId={rowId} />
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
                placeholder="ค้นหาประเภทปัญหา"
                onChange={(e) =>
                  issueStore.setFilter({
                    ...issueStore,
                    txtSearch: e.target.value,
                    page: 1,
                  })
                }
                onClearSearch={clearSearchData}
                onSearchData={searchData}
                value={issueStore.txtSearch}
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
                title: "ชื่อปัญหา",
                width: "45%",
                sortable: true,
                render({ name }) {
                  return (
                    <Highlight highlight={issueStore.txtSearch}>
                      {String(name)}
                    </Highlight>
                  );
                },
              },
              {
                accessor: "issue_name",
                title: "ประเภทปัญหา",
                width: "40%",
                sortable: true,
                render({ issue_name }) {
                  return (
                    <Highlight highlight={issueStore.txtSearch}>
                      {String(issue_name || "")}
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
              issueStore.setFilter({
                ...issueStore,
                sortField: sort.columnAccessor,
                sortDirection: sort.direction,
              }),
            ]}
            totalRecords={data?.totalItem || 0}
            recordsPerPage={Page_size}
            page={issueStore.page}
            onPageChange={(p: number) =>
              issueStore.setFilter({ ...issueStore, page: p })
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
