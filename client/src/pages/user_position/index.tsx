import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDebouncedValue } from "@mantine/hooks";
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
import { IconPlus } from "@tabler/icons-react";
import { convertToNumberOrZero } from "@/utils/mynumber";
import InputSearch from "@/components/common/InputSearch";
import PageHeader from "@/components/common/PageHeader";
import UserInfo from "@/components/user/UserInfo";
import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";
import AlertErrorDialog from "@/components/common/AlertErrorDialog";
import AlertSuccessDialog from "@/components/common/AlertSuccessDialog";
import ButtonDelete from "@/components/common/ButtonDelete";
import ButtonEdit from "@/components/common/ButtonEdit";
import { PAGE_SIZE } from "@/config";
import { useUserPositionDelete, useUserPositions } from "@/hooks/user_position";
import UserPositionForm from "@/components/user_position/UserPositionForm";
import { useUserPositionStore } from "@/stores/useUserPositionStore";

const title = "แผนผังองค์กร";
const listItems = [
  { title: "หน่วยงาน", href: "/faculty" },
  { title: title, href: "#" },
];
export default function UserPosition() {
  const params = useParams();
  const userPositionStore = useUserPositionStore();
  const id = convertToNumberOrZero(params.id);
  const [debounce] = useDebouncedValue(userPositionStore.txtSearch, 500);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: userPositionStore.sortField,
    direction: userPositionStore.sortDirection,
  });
  const [opened, setOpened] = useState(false);
  const [rowId, setRowId] = useState("0");
  const [type, setType] = useState(0);
  const setCondition = () => {
    const condition = {
      txtSearch: userPositionStore.txtSearch,
      page: userPositionStore.page - 1,
      sortField: sortStatus.columnAccessor,
      sortDirection: sortStatus.direction,
    };
    return condition;
  };
  const { data, isLoading, setFilter } = useUserPositions(id, setCondition());
  const mutationDelete = useUserPositionDelete();

  const searchData = () => {
    setFilter(setCondition());
  };
  const clearSearchData = () => {
    userPositionStore.setFilter({ ...userPositionStore, txtSearch: "" });
  };
  const handleNew = () => {
    setRowId("0");
    setType(0);
    setOpened(true);
  };
  const handleUpdate = (id: string) => {
    setRowId(id);
    setType(1);
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

  useEffect(() => {
    searchData();
  }, [debounce, userPositionStore.page, sortStatus]);

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
          <UserPositionForm
            onClose={() => setOpened(false)}
            id={rowId}
            fac_id={id}
            type={type}
          />
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
                placeholder="ค้นหาจากชื่อบุคคล, ตำแหน่งาน"
                onChange={(e) =>
                  userPositionStore.setFilter({
                    ...userPositionStore,
                    txtSearch: e.target.value,
                    page: 1,
                  })
                }
                onClearSearch={clearSearchData}
                onSearchData={searchData}
                value={userPositionStore.txtSearch}
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
              accessor: "firstname",
              title: <Text fw={700}>ชื่อ - นามสกุล</Text>,
              width: "45%",
              sortable: true,
              render({ firstname, surname, nickname }) {
                return (
                  <UserInfo
                    firstname={firstname}
                    surname={surname}
                    nickname={nickname}
                    highlight={userPositionStore.txtSearch}
                  />
                );
              },
            },
            {
              accessor: "name",
              title: <Text fw={700}>ตำแหน่ง</Text>,
              width: "20%",
              sortable: true,
              textAlign: "center",
              render({ name }) {
                return (
                  <Highlight size="sm" highlight={userPositionStore.txtSearch}>
                    {String(name || "")}
                  </Highlight>
                );
              },
            },
            {
              accessor: "id",
              title: <Text fw={700}>จัดการ</Text>,
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
          onSortStatusChange={(sort) => {
            setSortStatus(sort);
            userPositionStore.setFilter({
              ...userPositionStore,
              sortField: sort.columnAccessor,
              sortDirection: sort.direction,
            });
          }}
          totalRecords={data?.totalItem || 0}
          recordsPerPage={PAGE_SIZE}
          page={userPositionStore.page}
          onPageChange={(p: number) =>
            userPositionStore.setFilter({ ...userPositionStore, page: p })
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
      </Card>
    </>
  );
}
