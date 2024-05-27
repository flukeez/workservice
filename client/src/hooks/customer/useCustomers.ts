import { IConditionFilter } from "@/types/IConditionFilter";
import { axiosAuth } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

//GET ALL
export const useCustomers = (condition: IConditionFilter) => {
  const [filter, setFilter] = useState(condition);

  const findMany = async () => {
    const params = new URLSearchParams([
      ["textSearch", filter.txtSearch || ""],
      ["sortField", filter.sortField || "name"],
      ["sortDirection", filter.sortDirection || "asc"],
      ["activePage", filter.page?.toString()],
      ["limit", filter.limit.toString()],
    ]);
    const { data } = await axiosAuth.get("/customer", { params });
    return data;
  };

  const query = useQuery({
    queryKey: ["customers", { ...filter }],
    queryFn: findMany,
  });

  return { ...query, setFilter };
};
