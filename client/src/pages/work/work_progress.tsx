import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedValue } from "@mantine/hooks";
import { useWorksByStatus } from "@/hooks/work";

import {
  Button,
  Card,
  Grid,
  Group,
  Highlight,
  NumberFormatter,
  Stack,
  Text,
} from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { IconEdit, IconListSearch } from "@tabler/icons-react";

import InputSearch from "@/components/common/InputSearch";
import PageHeader from "@/components/common/PageHeader";
import BadgePriority from "@/components/priority/BadgePriority";

import { dateThai, timeFormNow } from "@/utils/mydate";
import { PAGE_SIZE } from "@/config";
import { useWorkProgressStore } from "@/stores/useWorkProgressStore";

const title = "งานซ่อมกำลังดำเนินการ";
const listItems = [{ title: title, href: "#" }];

export default function Work() {
  const navigate = useNavigate();
  const workProgressStore = useWorkProgressStore();
  const [debounce] = useDebouncedValue(workProgressStore.txtSearch, 500);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: workProgressStore.sortField,
    direction: workProgressStore.sortDirection,
  });

  const setCondition = () => {
    const condition = {
      txtSearch: workProgressStore.txtSearch,
      page: workProgressStore.page - 1,
      sortField: sortStatus.columnAccessor,
      sortDirection: sortStatus.direction,
    };
    return condition;
  };
  const { data, isLoading, setFilter } = useWorksByStatus(
    setCondition(),
    "4,5,6,7"
  );

  const searchData = () => {
    setFilter(setCondition());
  };
  const clearSearchData = () => {
    workProgressStore.setFilter({
      ...workProgressStore,
      txtSearch: "",
      page: 1,
    });
  };

  useEffect(() => {
    searchData();
  }, [debounce, workProgressStore.page, sortStatus]);
  return (
    <>
      <PageHeader title={title} listItems={listItems} />
      <Card shadow="sm">
        <Card.Section>
          <Grid mx="md" mt="md" align="flex-end">
            <Grid.Col span={{ md: 4 }}>
              <InputSearch
                label="ค้นหา"
                placeholder="ค้นหาชื่องานซ่อม..."
                value={workProgressStore.txtSearch}
                onChange={(e) => {
                  workProgressStore.setFilter({
                    ...workProgressStore,
                    txtSearch: e.target.value,
                    page: 1,
                  });
                }}
                onSearchData={searchData}
                onClearSearch={clearSearchData}
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
                    <Highlight
                      highlight={workProgressStore.txtSearch}
                      size="sm"
                    >
                      {String(name)}
                    </Highlight>
                    <BadgePriority text={String(priority_name)} />
                  </Group>
                );
              },
            },
            {
              accessor: "main_issue.name",
              title: (
                <Text ta={"center"} fw={700}>
                  ประเภทงาน
                </Text>
              ),
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
              accessor: "tb_faculty.name",
              title: (
                <Text ta={"center"} fw={700}>
                  หน่วยงาน
                </Text>
              ),
              width: "15%",
              sortable: true,
              textAlign: "left",
              render({ faculty_name, firstname, surname }) {
                return (
                  <Stack gap="xs">
                    <Text size="sm">{String(faculty_name)}</Text>
                    <Text size="sm" c="dimmed">
                      {`ผู้แจ้ง : ${firstname} ${surname}`}
                    </Text>
                  </Stack>
                );
              },
            },
            {
              accessor: "update_time",
              sortable: true,
              textAlign: "center",
              width: "15%",
              title: (
                <Text ta="center" fw={700}>
                  สถานะงาน
                </Text>
              ),
              render({ status_name, update_time }) {
                return (
                  <Stack gap="xs">
                    <Text size="sm">{String(status_name)}</Text>
                    <Text size="sm" c="dimmed">
                      อัพเดทเมื่อ {timeFormNow(String(update_time))}
                    </Text>
                  </Stack>
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
                  <Button
                    variant="subtle"
                    size="conmpact-md"
                    color="yellow"
                    onClick={() =>
                      navigate(`/work_progress/details/${id}`, {
                        state: { mainTitle: title, from: "/work_progress" },
                      })
                    }
                  >
                    <IconListSearch size="18" color="orange" />
                  </Button>
                  <Button
                    variant="subtle"
                    size="conmpact-md"
                    onClick={() =>
                      navigate(`/work_progress/details/${id}`, {
                        state: {
                          mainTitle: title,
                          from: "/work_progress",
                          type: "workUpdate",
                        },
                      })
                    }
                  >
                    <IconEdit size={"18"} />
                  </Button>
                </Group>
              ),
            },
          ]}
          sortStatus={sortStatus}
          onSortStatusChange={(sort) => {
            setSortStatus(sort);
            workProgressStore.setFilter({
              ...workProgressStore,
              sortField: sort.columnAccessor,
              sortDirection: sort.direction,
            });
          }}
          totalRecords={data?.totalItem || 0}
          recordsPerPage={PAGE_SIZE}
          page={workProgressStore.page}
          onPageChange={(p: number) =>
            workProgressStore.setFilter({ ...workProgressStore, page: p })
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
