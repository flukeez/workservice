import { IConditionFilter } from "@/types/IConditionFilter";
import { axiosAuth } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { URL } from "url";

const url = "/ctypes";
//GET ALL
export const useCtype = (condition: IConditionFilter) => {
  const [filter, setFilter] = useState(condition);
  const findMany = async () => {
    const params = new URLSearchParams([
      ["textSearch", filter.textSearch || ""],
      ["sortField", filter.sortField || "name"],
      ["sortDirection", filter.sortDirection || "asc"],
      ["activePage", filter.activePage?.toString()],
      ["limit", filter.limit || "20"],
    ]);

    const { data } = await axiosAuth.get(url, { params });
    return data;
  };

  const query = useQuery({
    queryKey: ["ctype", { ...filter }],
    queryFn: findMany,
  });

  return { ...query, setFilter };
};
