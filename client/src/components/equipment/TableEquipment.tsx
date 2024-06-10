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
      page: 0,
      limit: 10,
      sortField: sortStatus.columnAccessor,
      sortDirection: sortStatus.direction,
      user_id: "",
      faculty_id: "",
    };
    return condition;
  };
  const { data, isLoading, setFilter } = useEquipments(setCondition());

  const handleSelectRow = (selectedRecords: Record<string, unknown>[]) => {
    console.log("select row add", selectedRecords);
    setSelectRow(selectedRecords as IEquip[]);
  };
  const handleSetRowID = () => {
    const selectID = selectRow.map((record) => record.code!.toString());
    setEquip(selectID);
    console.log("set equip", selectID);
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
      {JSON.stringify(equip)}
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
        recordsPerPage={1}
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
        <Button
          size="sm"
          disabled={selectRow?.length === 0}
          onClick={handleSetRowID}
          color="blue"
        >
          เลือก {selectRow?.length || 0} รายการ
        </Button>
      </Group>
    </>
  );
}
