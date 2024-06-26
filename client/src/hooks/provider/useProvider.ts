import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { axiosAuth } from "@/utils/axios";
import { IConditionFilter } from "@/types/IConditionFilter";

const url = "/providers";

export const useProviders = (condition: IConditionFilter) => {
  const [filter, setFilter] = useState(condition);
  const findMany = async () => {
    const params = new URLSearchParams([
      ["txtSearch", filter.txtSearch || ""],
      ["sortField", filter.sortField || "name"],
      ["sortDirection", filter.sortDirection || "asc"],
      ["page", filter.page.toString()],
      ["limit", filter.limit || "20"],
    ]);
    const { data } = await axiosAuth.get(url, { params });
    return data;
  };
  const query = useQuery({
    queryKey: [queryKeys.providers, { ...filter }],
    queryFn: findMany,
  });
  return { ...query, setFilter };
};

export const useProvider = (id: number) => {
  const [filter, setFilter] = useState(id);
  const findById = async () => {
    if (id === 0) {
      return {};
    }
    const { data } = await axiosAuth.get(url + "/" + filter);
    return data;
  };
  const query = useQuery({
    queryKey: [queryKeys.provider, filter],
    queryFn: findById,
  });
  return { ...query, setFilter };
};
