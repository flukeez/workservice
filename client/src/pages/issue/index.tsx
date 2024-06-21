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
        title={`${title} ${rowId !== "0" ? "(แก้ไข)" : "(เพิ่ม)"}`}
        size="lg"
        position="right"
        closeOnClickOutside={false}
        offset={8}
        radius="md"
      >
        {opened ? (
          <IssueForm onClose={() => setOpened(false)} rowId={rowId} />
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
              issueStore.setFilter({
                ...issueStore,
                sortField: sort.columnAccessor,
                sortDirection: sort.direction,
              }),
            ]}
            totalRecords={data?.totalItem || 0}
            recordsPerPage={PAGE_SIZE}
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
