import { PAGE_SIZE } from "@/config";
import { useEquipments } from "@/hooks/equipment";
import type { IEquip, IEquipmentQuery } from "@/types/IEquipment";
import { Button, Grid, Group } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import EquipmentLabel from "./EquipmentLabel";
import InputSearch from "../common/InputSearch";

interface TableEquipmentProps {
  equip: string[];
  setEquip: (value: string[]) => void;
}

export default function TableEquipment({
  equip,
  setEquip,
}: TableEquipmentProps) {
  const [page, setPage] = useState(1);
  const [txtSearch, setTxtSearch] = useState("");
  const [debounce] = useDebouncedValue(txtSearch, 500);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "name",
    direction: "asc",
  });
  const [selectRow, setSelectRow] = useState<IEquip[]>([]);
  const setCondition = () => {
    const condition: IEquipmentQuery = {
      txtSearch: txtSearch,
      page: page - 1,
      limit: PAGE_SIZE,
      sortField: sortStatus.columnAccessor,
      sortDirection: sortStatus.direction,
      user_id: "",
      faculty_id: "",
    };
    return condition;
  };
  const { data, isLoading, setFilter } = useEquipments(setCondition());

  const handleSelectRow = (selectedRecords: Record<string, unknown>[]) => {
    const selectID = selectedRecords
      .map((record) => record.id as string | undefined)
      .filter((id): id is string => id !== undefined); // กรองค่า undefined ออก
    setSelectRow(selectedRecords as IEquip[]);
    console.log(selectID);
    setEquip(selectID);
  };

  const searchData = () => {
    setFilter(setCondition());
  };
  const clearSeachData = () => {
    setTxtSearch("");
    setPage(1);
  };
  useEffect(() => {
    searchData();
  }, [page, debounce, sortStatus]);
  return (
    <>
      <Grid>
        <Grid.Col>
          <InputSearch
            value={txtSearch}
            placeholder="ค้นหาจากรหัส, ซีเรียลนัมเบอร์, ชื่ออุปกรณ์"
            onChange={(e) => [setPage(1), setTxtSearch(e.target.value)]}
            onSearchData={searchData}
            onClearSearch={clearSeachData}
          />
        </Grid.Col>
      </Grid>
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
            sortable: true,
            render({ code, name, serial }) {
              return (
                <EquipmentLabel
                  code={String(code)}
                  serial={String(serial)}
                  name={String(name)}
                  highlight={txtSearch}
                />
              );
            },
          },
          {
            accessor: "id",
            title: "...",
            textAlign: "center",
            width: "0%",
            render({ id }) {
              return <Button size="xs">เลือก</Button>;
            },
          },
        ]}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        totalRecords={data?.totalItem || 0}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p: number) => setPage(p)}
        paginationText={({ from, to, totalRecords }) =>
          `แสดงข้อมูล ${from} ถึง ${to} จากทั้งหมด ${totalRecords} รายการ`
        }
        paginationActiveBackgroundColor="gray"
        noRecordsText="ไม่พบรายการ"
        noRecordsIcon={<></>}
        minHeight={120}
        fetching={isLoading}
        selectedRecords={selectRow}
        onSelectedRecordsChange={handleSelectRow}
      />

      <Group justify="right" mt="md">
        <Button size="sm" disabled>
          เลือก {equip.length} รายการ
        </Button>
      </Group>
    </>
  );
}
