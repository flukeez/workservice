import InputSearch from "@/components/common/InputSearch";
import PageHeader from "@/components/common/PageHeader";
import FacultyPositionForm from "@/components/faculty/FacultyPositionForm";
import UserInfo from "@/components/user/UserInfo";
import { useOrgCharts } from "@/hooks/faculty/useFaculty";
import { useOrgChartStore } from "@/stores/useOrgCharStore";
import { convertToNumberOrZero } from "@/utils/mynumber";
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
import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const listItems = [
  { title: "หน่วยงาน", href: "/faculty" },
  { title: "แผนผังองค์กร", href: "#" },
];
const Page_size = 10;
export default function OrganizeChart() {
  const params = useParams();
  const orgChartStore = useOrgChartStore();
  const id = convertToNumberOrZero(params.id);
  const [debounce] = useDebouncedValue(orgChartStore.txtSearch, 500);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: orgChartStore.sortField,
    direction: orgChartStore.sortDirection,
  });
  const [opened, setOpened] = useState(false);
  const [rowId, setRowId] = useState("0");
  const [type, setType] = useState(0);
  const setCondition = () => {
    const condition = {
      txtSearch: orgChartStore.txtSearch,
      page: orgChartStore.page - 1,
      limit: Page_size,
      sortField: sortStatus.columnAccessor,
      sortDirection: sortStatus.direction,
    };
    return condition;
  };
  const { data, isLoading, setFilter } = useOrgCharts(id, setCondition());

  const [title, setTitle] = useState("");
  const searchData = () => {
    setFilter(setCondition());
  };
  const clearSearchData = () => {
    orgChartStore.setFilter({ ...orgChartStore, txtSearch: "" });
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
  const handleDelete = (id: string) => {};
  useEffect(() => {
    const title = data?.faculty_name
      ? `แผนผังองค์กร : ${data.faculty_name}`
      : "ไม่พบหน่วยงาน";
    setTitle(title);
  }, [data]);

  useEffect(() => {
    searchData();
  }, [debounce, orgChartStore.page, sortStatus]);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={title}
        position="right"
      >
        {opened ? (
          <FacultyPositionForm
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
                  orgChartStore.setFilter({
                    ...orgChartStore,
                    txtSearch: e.target.value,
                    page: 1,
                  })
                }
                onClearSearch={clearSearchData}
                onSearchData={searchData}
                value={orgChartStore.txtSearch}
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
                render({ firstname, surname, nickname }) {
                  return (
                    <UserInfo
                      firstname={firstname}
                      surname={surname}
                      nickname={nickname}
                      highlight={orgChartStore.txtSearch}
                    />
                  );
                },
              },
              {
                accessor: "position_name",
                title: "ตำแหน่ง",
                width: "20%",
                sortable: true,
                textAlign: "center",
                render({ position_name }) {
                  return (
                    <Highlight highlight={orgChartStore.txtSearch}>
                      {String(position_name || "")}
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
            onSortStatusChange={(sort) => {
              setSortStatus(sort);
              orgChartStore.setFilter({
                ...orgChartStore,
                sortField: sort.columnAccessor,
                sortDirection: sort.direction,
              });
            }}
            totalRecords={data?.totalItem || 0}
            recordsPerPage={Page_size}
            page={orgChartStore.page}
            onPageChange={(p: number) =>
              orgChartStore.setFilter({ ...orgChartStore, page: p })
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
