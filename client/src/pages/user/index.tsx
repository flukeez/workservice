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
              userStore.setFilter({
                ...userStore,
                sortField: sort.columnAccessor,
                sortDirection: sort.direction,
              }),
            ]}
            totalRecords={data?.totalItem || 0}
            recordsPerPage={Page_size}
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
