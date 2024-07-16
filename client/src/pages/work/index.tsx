import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedValue } from "@mantine/hooks";
import { useWorks, useWorkSubmitMutation } from "@/hooks/work";

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
import { IconEdit, IconListCheck } from "@tabler/icons-react";

import AlertErrorDialog from "@/components/common/AlertErrorDialog";
import AlertSuccessDialog from "@/components/common/AlertSuccessDialog";
import ConfirmSubmitWorkDialog from "@/components/common/ConfirmSubmitWorkDialog";
import InputSearch from "@/components/common/InputSearch";
import PageHeader from "@/components/common/PageHeader";
import BadgePriority from "@/components/priority/BadgePriority";

import { useWorkStore } from "@/stores/useWorkStore";
import { dateThai } from "@/utils/mydate";
import { PAGE_SIZE } from "@/config";

const title = "งานซ่อมรอดำเนินการ";
const listItems = [{ title: title, href: "#" }];

export default function Work() {
  const navigate = useNavigate();
  const workStore = useWorkStore();
  const [debounce] = useDebouncedValue(workStore.txtSearch, 500);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: workStore.sortField,
    direction: workStore.sortDirection,
  });

  const setCondition = () => {
    const condition = {
      txtSearch: workStore.txtSearch,
      page: workStore.page - 1,
      sortField: sortStatus.columnAccessor,
      sortDirection: sortStatus.direction,
    };
    return condition;
  };
  const { data, isLoading, setFilter } = useWorks(setCondition());
  const mutation = useWorkSubmitMutation();

  const searchData = () => {
    setFilter(setCondition());
  };
  const clearSearchData = () => {
    workStore.setFilter({ ...workStore, txtSearch: "", page: 1 });
  };

  const handleSubmitWork = async (id: string, name: string) => {
    const isConfirmed = await ConfirmSubmitWorkDialog({
      html: ` <p>คุณต้องการที่จะรับงานซ่อมนี้ใช่หรือไม่ ${name}</p>`,
    });
    if (isConfirmed) {
      try {
        const { data } = await mutation.mutateAsync(id);
        if (data) {
          const isConfirmed = await AlertSuccessDialog({
            title: "ดำเนินการสำเร็จ",
          });
          if (isConfirmed)
            navigate("/work_progress", {
              state: {
                type: "workSubmit",
                mainTitle: title,
                from: "/work_wait",
              },
            });
        } else {
          await AlertErrorDialog({
            title: "ดำเนินการไม่สำเร็จ",
            html: "เนื่องจากมีบุคคลอื่นรับงานซ่อมนี้แล้ว",
          });
        }
      } catch (error) {
        await AlertErrorDialog({
          title: "ดำเนินการไม่สำเร็จ",
          html: "ดำเนินการไม่สำเร็จ เนื่องจากหมดเวลาเชื่อมต่อ ให้ออกจากระบบ แล้วเข้าใหม่",
        });
      }
    }
  };
  useEffect(() => {
    searchData();
  }, [debounce, workStore.page, sortStatus]);
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
                value={workStore.txtSearch}
                onChange={(e) => {
                  workStore.setFilter({
                    ...workStore,
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
                    <Highlight highlight={workStore.txtSearch} size="sm">
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
                  <Stack gap="xs">
                    <Text size="sm">{String(issue_name)}</Text>
                    {issue_sub_name ? (
                      <Text size="sm" c="dimmed">
                        {`(${issue_sub_name})`}
                      </Text>
                    ) : null}
                  </Stack>
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
                    <Text size="sm">{`หน่วยงาน : ${String(
                      faculty_name
                    )}`}</Text>
                    <Text size="sm" c="dimmed">
                      {`ผู้แจ้ง : ${firstname} ${surname}`}
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
              render: ({ id, name }) => (
                <Group justify="center" gap={3} wrap="nowrap">
                  <Button
                    variant="subtle"
                    size="conmpact-sm"
                    color="yellow"
                    onClick={() =>
                      navigate(`/work_wait/details/${id}`, {
                        state: { mainTitle: title, from: "/work_wait" },
                      })
                    }
                  >
                    <IconEdit size="18" color="orange" />
                  </Button>
                  <Button
                    variant="subtle"
                    size="conmpact-sm"
                    onClick={() => handleSubmitWork(String(id), String(name))}
                  >
                    <IconListCheck size="18" />
                  </Button>
                </Group>
              ),
            },
          ]}
          sortStatus={sortStatus}
          onSortStatusChange={(sort) => {
            setSortStatus(sort);
            workStore.setFilter({
              ...workStore,
              sortField: sort.columnAccessor,
              sortDirection: sort.direction,
            });
          }}
          totalRecords={data?.totalItem || 0}
          recordsPerPage={PAGE_SIZE}
          page={workStore.page}
          onPageChange={(p: number) =>
            workStore.setFilter({ ...workStore, page: p })
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
