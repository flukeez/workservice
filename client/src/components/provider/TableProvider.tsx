import { useProvidersIssue } from "@/hooks/provider/useProvider";
import { IProviderQuery } from "@/types/IProvider";
import { Badge, Button, Grid, Group, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import InputSearch from "../common/InputSearch";
import { PAGE_SIZE } from "@/config";
import BadgeProviderStatus from "./BadgeProviderStatus";
import { timeFormNow } from "@/utils/mydate";

interface TableProviderProps {
  provider: string;
  setProvider: (value: { name: string; id: string }) => void;
  issue_id: string;
  provName: string;
}
export default function TableProvider({
  provider,
  setProvider,
  issue_id,
  provName,
}: TableProviderProps) {
  const [page, setPage] = useState(1);
  const [txtSearch, setTxtSearch] = useState("");
  const [debounce] = useDebouncedValue(txtSearch, 500);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "name",
    direction: "asc",
  });
  const setCondition = () => {
    const condition: IProviderQuery = {
      txtSearch: txtSearch,
      page: page - 1,
      sortField: sortStatus.columnAccessor,
      sortDirection: sortStatus.direction,
      issue_id: issue_id,
    };
    return condition;
  };

  const { data, isLoading, setFilter } = useProvidersIssue(
    setCondition(),
    provider
  );

  const searchData = () => {
    setFilter(setCondition());
  };
  const clearSearchData = () => {
    setTxtSearch("");
    setPage(1);
  };

  useEffect(() => {
    setFilter(setCondition());
  }, [issue_id]);

  useEffect(() => {
    searchData();
  }, [page, debounce, sortStatus]);

  return (
    <>
      <Grid>
        <Grid.Col>
          <InputSearch
            value={txtSearch}
            placeholder="ค้นหาจากชื่อ..."
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
        records={data?.rows || []}
        columns={[
          {
            accessor: "name",
            title: "ชื่อ",
            sortable: true,
            width: "40%",
            render({ name, sort_order }) {
              return (
                <Group wrap="nowrap">
                  <Text size="sm">{String(name)}</Text>
                  {sort_order == 1 ||
                    (sort_order == 3 && (
                      <Badge color="yellow" size="sm" radius="xs">
                        แนะนำ
                      </Badge>
                    ))}
                </Group>
              );
            },
          },
          {
            accessor: "available",
            title: "งานที่กำลังทำ",
            textAlign: "center",
            width: "13%",
            sortable: true,
          },
          {
            accessor: "available",
            title: "สถานะ",
            textAlign: "center",
            width: "13%",
            sortable: true,
            render({ status }) {
              return <BadgeProviderStatus status={String(status)} />;
            },
          },
          {
            accessor: "last_login",
            title: "เข้าใช้งานล่าสุด",
            textAlign: "center",
            width: "15%",
            sortable: true,
            render({ last_login }) {
              return <Text size="sm">{timeFormNow(String(last_login))}</Text>;
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
                  onClick={() =>
                    setProvider({ name: String(name), id: String(id) })
                  }
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
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p: number) => setPage(p)}
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
    </>
  );
}
