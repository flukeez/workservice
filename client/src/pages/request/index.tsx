import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedValue } from "@mantine/hooks";
import { useRequests } from "@/hooks/request";

import {
  Button,
  Card,
  Grid,
  Group,
  Highlight,
  NumberFormatter,
  Text,
} from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { IconListSearch, IconUserEdit } from "@tabler/icons-react";

import ButtonDelete from "@/components/common/ButtonDelete";
import ButtonEdit from "@/components/common/ButtonEdit";
import ButtonNew from "@/components/common/ButtonNew";
import InputSearch from "@/components/common/InputSearch";
import PageHeader from "@/components/common/PageHeader";
import BadgePriority from "@/components/priority/BadgePriority";

import { dateThai } from "@/utils/mydate";
import { PAGE_SIZE } from "@/config";

import { useRequestStore } from "@/stores/useRequestStore";

const title = "รายการแจ้งซ่อม";
const listItems = [{ title: title, href: "#" }];

export default function Request() {
  const navigate = useNavigate();
  const requestStore = useRequestStore();
  const [debounce] = useDebouncedValue(requestStore.txtSearch, 500);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: requestStore.sortField,
    direction: requestStore.sortDirection,
  });
  const setCondition = () => {
    const condition = {
      txtSearch: requestStore.txtSearch,
      page: requestStore.page - 1,
      sortField: sortStatus.columnAccessor,
      sortDirection: sortStatus.direction,
    };
    return condition;
  };
  const { data, isLoading, setFilter } = useRequests(setCondition());

  const searchData = () => {
    setFilter(setCondition());
  };
  const clearSearchData = () => {
    requestStore.setFilter({ ...requestStore, txtSearch: "", page: 1 });
  };

  const handleNew = () => {
    navigate("/request/new");
  };

  const handleUpdate = (id: string) => {
    navigate("/request/" + id);
  };
  const handleDelete = (id: string, name: string) => {};

  useEffect(() => {
    searchData();
  }, [debounce, requestStore.page, sortStatus]);
  return (
    <>
      <PageHeader title={title} listItems={listItems} />
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="md">
          <Group justify="right">
            <ButtonNew onClick={handleNew}>แจ้งซ่อม</ButtonNew>
            <Button leftSection={<IconUserEdit size="18" />}>มอบหมายงาน</Button>
          </Group>
        </Card.Section>
        <Card.Section>
          <Grid mx="md" mt="md" align="flex-end">
            <Grid.Col span={{ md: 4 }}>
              <InputSearch
                label="ค้นหา"
                placeholder="ค้นหาจากชื่องานซ่อม"
                onChange={(e) =>
                  requestStore.setFilter({
                    ...requestStore,
                    txtSearch: e.target.value,
                    page: 1,
                  })
                }
                onClearSearch={clearSearchData}
                onSearchData={searchData}
                value={requestStore.txtSearch}
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
          verticalAlign="top"
          records={data?.rows}
          columns={[
            {
              accessor: "tb_request.date_start",
              title: (
                <Text fw={700} ml={20}>
                  วันที่แจ้งซ่อม
                </Text>
              ),
              width: "10%",
              sortable: true,
              textAlign: "center",
              render({ date_start }) {
                return <Text size="sm">{dateThai(date_start)}</Text>;
              },
            },
            {
              accessor: "tb_request_details.name",
              title: <Text fw={700}>งานซ่อม</Text>,
              sortable: true,
              render({ name, priority_name }) {
                return (
                  <Group>
                    <Highlight highlight={requestStore.txtSearch} size="sm">
                      {String(name)}
                    </Highlight>
                    <BadgePriority text={String(priority_name)} />
                  </Group>
                );
              },
            },
            {
              accessor: "main_issue.name",
              title: <Text fw={700}>ประเภทงาน</Text>,
              width: "15%",
              sortable: true,
              render({ issue_name, issue_sub_name }) {
                return (
                  <Group>
                    <Text size="sm">{String(issue_name)}</Text>
                    {issue_sub_name ? (
                      <Text size="sm" c="dimmed">
                        {`(${issue_sub_name})`}
                      </Text>
                    ) : null}
                  </Group>
                );
              },
            },
            {
              accessor: "equip_count",
              title: <Text fw={700}>จํานวนอุปกรณ์</Text>,
              width: "9%",
              textAlign: "center",
              render({ equip_count }) {
                return <NumberFormatter value={Number(equip_count)} />;
              },
            },
            {
              accessor: "provider_name",
              title: <Text fw={700}>ผู้ซ่อม</Text>,
              width: "15%",
              textAlign: "center",
              render({ provider_name }) {
                return <Text size="sm">{String(provider_name)}</Text>;
              },
            },
            {
              accessor: "status_name",
              title: <Text fw={700}>สถานะงาน</Text>,
              width: "10%",
              textAlign: "center",
              render({ status_name }) {
                return <Text size="sm">{String(status_name)}</Text>;
              },
            },
            {
              accessor: "id",
              title: <Text fw={700}>จัดการ</Text>,
              width: "0%",
              textAlign: "center",
              render: ({ id, name }) => (
                <Group justify="center" gap={3} wrap="nowrap">
                  <Button
                    variant="subtle"
                    size="conmpact-md"
                    onClick={() => navigate(`/request/details/${id}`)}
                  >
                    <IconListSearch size="18" color="orange" />
                  </Button>
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
            requestStore.setFilter({
              ...requestStore,
              sortField: sort.columnAccessor,
              sortDirection: sort.direction,
            });
          }}
          totalRecords={data?.totalItem || 0}
          recordsPerPage={PAGE_SIZE}
          page={requestStore.page}
          onPageChange={(p: number) =>
            requestStore.setFilter({ ...requestStore, page: p })
          }
          paginationText={({ from, to, totalRecords }) =>
            `แสดงข้อมูล ${from} ถึง ${to} จากทั้งหมด ${totalRecords} รายการ`
          }
          noRecordsText="ไม่พบรายการ"
          noRecordsIcon={<></>}
          minHeight={120}
          fetching={isLoading}
          pinFirstColumn
          pinLastColumn
        />
      </Card>
    </>
  );
}
