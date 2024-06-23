import { useEffect, useState } from "react";
import {
  Card,
  Drawer,
  Grid,
  Group,
  Highlight,
  ScrollArea,
} from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useDebouncedValue } from "@mantine/hooks";
import { useIssueDelete, useIssues } from "@/hooks/issue";

import InputSearch from "@/components/common/InputSearch";
import PageHeader from "@/components/common/PageHeader";
import IssueForm from "@/components/issue/IssueForm";
import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";
import AlertErrorDialog from "@/components/common/AlertErrorDialog";
import AlertSuccessDialog from "@/components/common/AlertSuccessDialog";
import ButtonEdit from "@/components/common/ButtonEdit";
import ButtonDelete from "@/components/common/ButtonDelete";
import ButtonNew from "@/components/common/ButtonNew";

import { useIssueStore } from "@/stores/useIssueStore";
import { PAGE_SIZE } from "@/config";

const title = "ประเภทปัญหา";
const listItems = [{ title: title, href: "#" }];
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
                    <Highlight size="sm" highlight={issueStore.txtSearch}>
                      {String(name)}
                    </Highlight>
                  );
                },
              },
              {
                accessor: "issue_name",
                title: "หมวดหมู่ปัญหา",
                width: "40%",
                sortable: true,
                render({ issue_name }) {
                  return (
                    <Highlight size="sm" highlight={issueStore.txtSearch}>
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
