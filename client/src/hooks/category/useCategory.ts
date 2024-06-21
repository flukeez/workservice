import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";
import type { IConditionFilter } from "@/types/IConditionFilter";

const url = "/categories";

export const useCategories = (condition: IConditionFilter) => {
  const [filter, setFilter] = useState(condition);
  const findMany = async () => {
    const params = new URLSearchParams([
      ["txtSearch", filter.txtSearch || ""],
      ["sortField", filter.sortField || "name"],
      ["sortDirection", filter.sortDirection || "asc"],
      ["page", filter.page.toString()],
      ["limit", filter.limit?.toString() || "20"],
    ]);

    const { data } = await axiosAuth.get(url, { params });
    return data;
  };
  const query = useQuery({
    queryKey: [queryKeys.categories, { ...filter }],
    queryFn: findMany,
  });
  return { ...query, setFilter };
};

export const useCategory = (id: string) => {
  const [filter, setFilter] = useState(id);
  const findById = async () => {
    if (id === "0") {
      return {};
    }
    const { data } = await axiosAuth.get(url + "/" + filter);
    return data;
  };
  const query = useQuery({
    queryKey: [queryKeys.category, filter],
    queryFn: findById,
  });
  return { ...query, setFilter };
};
