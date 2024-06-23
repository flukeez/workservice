import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { Card, Grid, Group, Highlight, ScrollArea, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { timeFormNow } from "@/utils/mydate";
import { useUserStore } from "@/stores/useUserStore";
import { useUserDelete, useUsers } from "@/hooks/user";
import InputSearch from "@/components/common/InputSearch";
import PageHeader from "@/components/common/PageHeader";
import UserInfo from "@/components/user/UserInfo";
import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";
import AlertErrorDialog from "@/components/common/AlertErrorDialog";
import AlertSuccessDialog from "@/components/common/AlertSuccessDialog";
import ButtonNew from "@/components/common/ButtonNew";
import { PAGE_SIZE } from "@/config";
import ButtonDelete from "@/components/common/ButtonDelete";
import ButtonEdit from "@/components/common/ButtonEdit";

const title = "รายชื่อผู้ใช้";
const listItems = [{ title: title, href: "#" }];

export default function User() {
  const navigate = useNavigate();
  const userStore = useUserStore();
  const [debounce] = useDebouncedValue(userStore.txtSearch, 500);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: userStore.sortField,
    direction: userStore.sortDirection,
  });
  const setCondition = () => {
    const condition = {
      txtSearch: userStore.txtSearch,
      sortField: userStore.sortField,
      sortDirection: userStore.sortDirection,
      page: userStore.page - 1,
    };
    return condition;
  };
  const { data, isLoading, setFilter } = useUsers(setCondition());
  const mutationDelete = useUserDelete();
  const handleNew = () => {
    navigate("/user/new");
  };
  const handleUpdate = (id: string) => {
    navigate("/user/" + id);
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
    userStore.setFilter({ ...userStore, txtSearch: "", page: 1 });
  };

  useEffect(() => {
    searchData();
  }, [debounce, userStore.page, sortStatus]);
  return (
    <>
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
                placeholder="ค้นหาจากชื่อจริง, นามสกุล, ชื่อเล่น, ชื่อผู้ใช้"
                onChange={(e) =>
                  userStore.setFilter({
                    ...userStore,
                    txtSearch: e.target.value,
                    page: 1,
                  })
                }
                onClearSearch={clearSearchData}
                onSearchData={searchData}
                value={userStore.txtSearch}
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
                accessor: "firstname",
                title: <Text fw={700}>ชื่อ - นามสกุล</Text>,
                width: "45%",
                sortable: true,
                render({ firstname, surname, nickname, image }) {
                  return (
                    <UserInfo
                      firstname={firstname}
                      surname={surname}
                      nickname={nickname}
                      image={image}
                      highlight={userStore.txtSearch}
                    />
                  );
                },
              },
              {
                accessor: "username",
                title: <Text fw={700}>ชื่อผู้ใช้</Text>,
                width: "20%",
                sortable: true,
                render({ username }) {
                  return (
                    <Highlight highlight={userStore.txtSearch}>
                      {String(username)}
                    </Highlight>
                  );
                },
              },
              {
                accessor: "phone",
                title: <Text fw={700}>เบอร์โทรศัพท์</Text>,
                width: "10%",
                textAlign: "center",
                sortable: true,
              },
              {
                accessor: "last_login",
                title: <Text fw={700}>ใช้งานล่าสุด</Text>,
                sortable: true,
                width: "10%",
                textAlign: "center",
                render({ last_login }) {
                  return (
                    <Text c="dimmed">{timeFormNow(String(last_login))}</Text>
                  );
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
              userStore.setFilter({
                ...userStore,
                sortField: sort.columnAccessor,
                sortDirection: sort.direction,
              }),
            ]}
            totalRecords={data?.totalItem || 0}
            recordsPerPage={PAGE_SIZE}
            page={userStore.page}
            onPageChange={(p: number) =>
              userStore.setFilter({ ...userStore, page: p })
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
