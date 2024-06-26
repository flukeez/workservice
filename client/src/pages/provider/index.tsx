import ButtonDelete from "@/components/common/ButtonDelete";
import ButtonEdit from "@/components/common/ButtonEdit";
import ButtonNew from "@/components/common/ButtonNew";
import InputSearch from "@/components/common/InputSearch";
import PageHeader from "@/components/common/PageHeader";
import { PAGE_SIZE } from "@/config";
import { useProviders } from "@/hooks/provider";
import { useProviderStore } from "@/stores/useProviderStore";
import { timeFormNow } from "@/utils/mydate";
import { Card, Grid, Group, Highlight, Rating, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const title = "รายชื่อผู้ซ่อม";
const listItems = [{ title: title, href: "#" }];

export default function Provider() {
  const navigate = useNavigate();
  const providerStore = useProviderStore();
  const [debounce] = useDebouncedValue(providerStore.txtSearch, 500);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: providerStore.sortField,
    direction: providerStore.sortDirection,
  });
  const setCondition = () => {
    const condition = {
      txtSearch: providerStore.txtSearch,
      sortField: providerStore.sortField,
      sortDirection: providerStore.sortDirection,
      page: providerStore.page - 1,
    };
    return condition;
  };
  const { data, isLoading, setFilter } = useProviders(setCondition());
  const handleNew = () => {
    navigate("/provider/new");
  };
  const handleUpdate = (id: string) => {};
  const handleDelete = (id: string, name: string) => {};
  const searchData = () => {
    setFilter(setCondition());
  };
  const clearSearchData = () => {
    providerStore.setFilter({ ...providerStore, txtSearch: "", page: 1 });
  };

  useEffect(() => {
    searchData();
  }, [debounce, providerStore.page, sortStatus]);
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
                placeholder="ค้นหาจากชื่อ..."
                onChange={(e) =>
                  providerStore.setFilter({
                    ...providerStore,
                    txtSearch: e.target.value,
                    page: 1,
                  })
                }
                onClearSearch={clearSearchData}
                onSearchData={searchData}
                value={providerStore.txtSearch}
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
              accessor: "name",
              title: <Text fw={700}>ชื่อ</Text>,
              sortable: true,
              render({ name }) {
                return (
                  <Highlight highlight={providerStore.txtSearch}>
                    {String(name)}
                  </Highlight>
                );
              },
            },
            {
              accessor: "tel",
              title: <Text fw={700}>เบอร์โทรศัพท์</Text>,
              width: "12%",
              textAlign: "center",
            },
            {
              accessor: "available",
              title: <Text fw={700}>งานที่กำลังทำ</Text>,
              width: "10%",
              textAlign: "center",
              sortable: true,
            },
            {
              accessor: "rating",
              title: <Text fw={700}>คะแนน</Text>,
              width: "10%",
              textAlign: "center",
              sortable: true,
              render({ rating }) {
                return (
                  <Group justify="center">
                    <Rating value={Number(rating)} readOnly count={5} />
                  </Group>
                );
              },
            },
            {
              accessor: "status",
              title: <Text fw={700}>สถานะ</Text>,
              width: "10%",
              textAlign: "center",
              sortable: true,
            },
            {
              accessor: "last_login",
              title: <Text fw={700}>ใช้งานล่าสุด</Text>,
              sortable: true,
              width: "12%",
              textAlign: "center",
              render({ last_login }) {
                return (
                  <Text size="sm" c="dimmed">
                    {timeFormNow(String(last_login))}
                  </Text>
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
          onSortStatusChange={(sort) => [
            setSortStatus(sort),
            providerStore.setFilter({
              ...providerStore,
              sortField: sort.columnAccessor,
              sortDirection: sort.direction,
            }),
          ]}
          totalRecords={data?.totalItem || 0}
          recordsPerPage={PAGE_SIZE}
          page={providerStore.page}
          onPageChange={(p: number) =>
            providerStore.setFilter({ ...providerStore, page: p })
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
