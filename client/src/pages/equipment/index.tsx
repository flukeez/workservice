import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Button,
  Card,
  Grid,
  Group,
  Menu,
  NumberFormatter,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { useDebouncedValue } from "@mantine/hooks";
import { useEquipmentDelete, useEquipments } from "@/hooks/equipment";
import { useEquipmentStore } from "@/stores/useEquipmentStore";
import BadgeEquipStatus from "@/components/common/BadgeEquipStatus";
import InputSearch from "@/components/common/InputSearch";
import PageHeader from "@/components/common/PageHeader";
import WarrantyLabel from "@/components/equipment/WarrantyLabel";
import DropdownFaculty from "@/components/faculty/DropdownFaculty";
import DropdownUser from "@/components/user/DropdownUser";
import EquipmentLabel from "@/components/equipment/EquipmentLabel";

const title = "รายการอุปกรณ์";
const listItems = [{ title: title, href: "#" }];
const Page_size = 10;

export default function Equipment() {
  const navigate = useNavigate();
  const equipmentStore = useEquipmentStore();
  const [debounce] = useDebouncedValue(equipmentStore.txtSearch, 500);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: equipmentStore.sortField,
    direction: equipmentStore.sortDirection,
  });
  const setCondition = () => {
    const condition = {
      txtSearch: equipmentStore.txtSearch,
      page: equipmentStore.page - 1,
      limit: Page_size,
      sortField: sortStatus.columnAccessor,
      sortDirection: sortStatus.direction,
      faculty_id: equipmentStore.faculty_id,
      user_id: equipmentStore.user_id,
    };
    return condition;
  };
  const { data, isLoading, setFilter } = useEquipments(setCondition());
  const mutationDelete = useEquipmentDelete();
  const handleNew = () => {
    navigate("/equipment/create");
  };
  const handleUpdate = (id: string) => {
    navigate("/equipment/" + id);
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
    equipmentStore.setFilter({ ...equipmentStore, txtSearch: "", page: 1 });
  };

  useEffect(() => {
    searchData();
  }, [
    debounce,
    equipmentStore.page,
    sortStatus,
    equipmentStore.faculty_id,
    equipmentStore.user_id,
  ]);

  return (
    <>
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
          <Grid mx="md" mt="md" align="flex-end">
            <Grid.Col span={{ md: 4 }}>
              <InputSearch
                label="ค้นหา"
                placeholder="ค้นหาจากรหัส, ซีเรียลนัมเบอร์, ชื่ออุปกรณ์"
                onChange={(e) =>
                  equipmentStore.setFilter({
                    ...equipmentStore,
                    txtSearch: e.target.value,
                    page: 1,
                  })
                }
                onClearSearch={clearSearchData}
                onSearchData={searchData}
                value={equipmentStore.txtSearch}
              />
            </Grid.Col>
            <Grid.Col span={{ md: 4 }}>
              <DropdownFaculty
                label="หน่วยงาน"
                faculty={equipmentStore.faculty_id}
                setFaculty={(value: string | null) => [
                  equipmentStore.setFilter({
                    ...equipmentStore,
                    faculty_id: value || "",
                  }),
                ]}
              />
            </Grid.Col>
            <Grid.Col span={{ md: 4 }}>
              <DropdownUser
                label="ผู้ดูแล"
                user={equipmentStore.user_id}
                setUser={(value: string | null) =>
                  equipmentStore.setFilter({
                    ...equipmentStore,
                    user_id: value || "",
                  })
                }
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
            verticalAlign="top"
            records={data?.rows}
            columns={[
              {
                accessor: "name",
                title: "ชื่ออุปกรณ์",
                width: "45%",
                sortable: true,
                render({ code, name, serial }) {
                  return (
                    <EquipmentLabel
                      code={String(code)}
                      serial={String(serial)}
                      name={String(name)}
                      highlight={equipmentStore.txtSearch}
                    />
                  );
                },
              },
              {
                accessor: "warranty_start",
                title: "วันที่ใช้งาน",
                width: "15%",
                sortable: true,
                textAlign: "center",
                render({ warranty, warranty_end, date_start }) {
                  return (
                    <WarrantyLabel
                      warranty={String(warranty)}
                      warranty_end={String(warranty_end)}
                      date_start={String(date_start)}
                    />
                  );
                },
              },
              {
                accessor: "faculty_name",
                title: "หน่วยงาน",
                width: "15%",
                sortable: true,
                render({ faculty_name, firstname, surname }) {
                  return (
                    <Stack gap="xs">
                      {faculty_name ? (
                        <Text>หน่วยงาน : {String(faculty_name)}</Text>
                      ) : null}
                      {firstname ? (
                        <Text c="dimmed" size="sm">
                          ผู้รับผิดชอบ :
                          {" " + String(firstname) + " " + String(surname)}
                        </Text>
                      ) : null}
                    </Stack>
                  );
                },
              },
              {
                accessor: "price",
                title: "ราคา",
                width: "10%",
                sortable: true,
                textAlign: "center",
                render({ price }) {
                  return (
                    <NumberFormatter
                      thousandSeparator
                      decimalSeparator="."
                      decimalScale={2}
                      suffix=" บาท"
                      value={Number(price)}
                    />
                  );
                },
              },
              {
                accessor: "equip_status_name",
                title: "สถานะ",
                width: "10%",
                sortable: true,
                textAlign: "center",
                render({ equip_status_name }) {
                  return <BadgeEquipStatus text={String(equip_status_name)} />;
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
            onSortStatusChange={(sort) => {
              setSortStatus(sort);
              equipmentStore.setFilter({
                ...equipmentStore,
                sortField: sort.columnAccessor,
                sortDirection: sort.direction,
              });
            }}
            totalRecords={data?.totalItem || 0}
            recordsPerPage={PAGE_SIZE}
            page={equipmentStore.page}
            onPageChange={(p: number) =>
              equipmentStore.setFilter({ ...equipmentStore, page: p })
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
