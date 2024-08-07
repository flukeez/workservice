import { useEffect, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useEquipmentsRepair } from "@/hooks/equipment";

import { Button, Grid, Group } from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import EquipmentLabel from "./EquipmentLabel";
import InputSearch from "../common/InputSearch";
import type { IEquip, IEquipmentQuery } from "@/types/IEquipment";

interface TableEquipmentProps {
  equip: string[];
  setEquip: (value: string[]) => void;
  onClose: () => void;
  equipName: string[];
  setEquipName: (value: string[]) => void;
  id?: number;
}

export default function TableEquipment({
  equip,
  setEquip,
  onClose,
  equipName,
  setEquipName,
  id,
}: TableEquipmentProps) {
  const [page, setPage] = useState(1);
  const [txtSearch, setTxtSearch] = useState("");
  const [debounce] = useDebouncedValue(txtSearch, 500);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "name",
    direction: "asc",
  });
  const [selectRow, setSelectRow] = useState<IEquip[]>([]);
  const [selectRowID, setSelectRowID] = useState<string[]>([]);
  const setCondition = () => {
    const condition: IEquipmentQuery = {
      txtSearch: txtSearch,
      page: page - 1,
      limit: 10,
      sortField: sortStatus.columnAccessor,
      sortDirection: sortStatus.direction,
      user_id: "",
      faculty_id: "",
    };
    return condition;
  };
  const { data, isLoading, setFilter } = useEquipmentsRepair(
    setCondition(),
    id
  );

  const handleSelectRow = (selectedRecords: Record<string, unknown>[]) => {
    const selected = selectedRecords as IEquip[];
    setSelectRow(selected);
    if (selected.length > 0) {
      const selectedNames = selected.map((record) => record.name);
      setEquipName(selectedNames);
    }
  };
  const handleSetRowID = () => {
    setEquip(selectRowID);
    onClose();
  };

  const handleClickCheckbox = (id: string) => {
    if (selectRowID.includes(id)) {
      //ถ้ามีลบออก
      setSelectRowID(selectRowID.filter((item) => item !== id));
    } else {
      //ถ้าไม่มีเพิ่มเข้าไป
      setSelectRowID([...selectRowID, id]);
    }
  };

  const handleClickSelectAll = () => {
    if (data?.rows) {
      const allID = data.rows.map((row: IEquip) => row.id.toString());
      if (allID.every((id: string) => selectRowID.includes(id))) {
        //ลบออก
        setSelectRowID(selectRowID.filter((id) => !allID.includes(id)));
      } else {
        //เพิมไอดีที่ยังไม่มีลงไป
        const newSelectID = allID.filter(
          (id: string) => !selectRowID.includes(id)
        );
        setSelectRowID([...selectRowID, ...newSelectID]);
      }
    }
  };

  const searchData = () => {
    setFilter(setCondition());
  };
  const clearSearchData = () => {
    setTxtSearch("");
    setPage(1);
  };

  useEffect(() => {
    searchData();
  }, [page, debounce, sortStatus]);

  useEffect(() => {
    if (equip) {
      setSelectRowID(equip);
    }
  }, [equip]);

  useEffect(() => {
    if (data?.rows) {
      //กำหนดค่าแถวที่เลือก
      const initialSelect = data.rows.filter((row: IEquip) =>
        selectRowID.includes(row.id.toString())
      );
      setSelectRow(initialSelect);
      //ถ้าเป็นการแก้่ไข และชื่อยังไม่มีจะทำการกำหนดชื่อ
      if (equipName.length === 0) {
        const selectRows = data.rows.filter((record: IEquip) =>
          equip.includes(record.id.toString())
        );
        const selectedNames = selectRows.map((record: IEquip) => record.name);
        setEquipName(selectedNames);
      }
    }
  }, [data, selectRowID]);

  return (
    <>
      <Grid>
        <Grid.Col>
          <InputSearch
            value={txtSearch}
            placeholder="ค้นหาจากรหัส, ซีเรียลนัมเบอร์, ชื่ออุปกรณ์"
            onChange={(e) => [setPage(1), setTxtSearch(e.target.value)]}
            onSearchData={searchData}
            onClearSearch={clearSearchData}
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
        records={data?.rows.slice(0, 10)}
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
            render({ id, name }) {
              return (
                <Button
                  size="xs"
                  onClick={() => {
                    setEquip([String(id)]),
                      onClose(),
                      setEquipName([String(name)]);
                  }}
                >
                  เลือก
                </Button>
              );
            },
          },
        ]}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        totalRecords={data?.totalItem || 0}
        recordsPerPage={10}
        page={page}
        onPageChange={(p: number) => setPage(p)}
        paginationText={({ from, to, totalRecords }) =>
          `แสดงข้อมูล ${from} ถึง ${to} จากทั้งหมด ${totalRecords} รายการ`
        }
        noRecordsText="ไม่พบรายการ"
        noRecordsIcon={<></>}
        minHeight={120}
        fetching={isLoading}
        selectedRecords={selectRow}
        onSelectedRecordsChange={handleSelectRow}
        getRecordSelectionCheckboxProps={(record: Record<string, unknown>) => ({
          onClick: () => handleClickCheckbox(String(record.id)),
        })}
        allRecordsSelectionCheckboxProps={{
          onClick: () => handleClickSelectAll(),
        }}
        pinLastColumn
        pinFirstColumn
      />

      <Group justify="right" mt="md">
        <Button
          size="sm"
          disabled={selectRowID?.length === 0}
          onClick={handleSetRowID}
          color="blue"
        >
          เลือก {selectRowID?.length} รายการ
        </Button>
      </Group>
    </>
  );
}
