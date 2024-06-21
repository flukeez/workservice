import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import {
  Button,
  Card,
  Grid,
  Group,
  Highlight,
  Menu,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { timeFormNow } from "@/utils/mydate";
import { useUserStore } from "@/stores/useUserStore";
import { useUserDelete, useUsers } from "@/hooks/user";
import InputSearch from "@/components/common/InputSearch";
import PageHeader from "@/components/common/PageHeader";
import UserInfo from "@/components/user/UserInfo";

const title = "รายชื่อผู้ใช้";
const listItems = [{ title: title, href: "#" }];
const Page_size = 10;

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
      limit: Page_size,
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
                title: "ชื่อ - นามสกุล",
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
                title: "ชื่อผู้ใช้ ",
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
                title: "เบอร์โทรศัพท์",
                width: "10%",
                textAlign: "center",
                sortable: true,
              },
              {
                accessor: "last_login",
                title: "ใช้งานล่าสุด",
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
