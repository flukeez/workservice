import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";
import type { IConditionFilter } from "@/types/IConditionFilter";

const url = "/works";

export const useWorks = (condition: IConditionFilter) => {
  const [filter, setFilter] = useState(condition);
  const findMany = async () => {
    const params = new URLSearchParams([
      ["txtSearch", filter.txtSearch || ""],
      ["sortField", filter.sortField || "tb_request.date_start"],
      ["sortDirection", filter.sortDirection || "asc"],
      ["page", filter.page.toString()],
      ["limit", filter.limit || "20"],
    ]);

    const { data } = await axiosAuth.get(url, { params });
    return data;
  };
  const query = useQuery({
    queryKey: [queryKeys.works, { ...filter }],
    queryFn: findMany,
  });
  return { ...query, setFilter };
};

export const useWorksAssign = (id: number) => {
  const [filter, setFilter] = useState(id);
  const findMany = async () => {
    if (id === 0) {
      return {};
    }
    const { data } = await axiosAuth.get(url + "/" + filter);
    return data;
  };
  const query = useQuery({
    queryKey: [queryKeys.work_assign, filter],
    queryFn: findMany,
  });
  return { ...query, setFilter };
};

export const useWorksByStatus = (condition: IConditionFilter, id: string) => {
  const [filter, setFilter] = useState(condition);
  const findMany = async () => {
    if (!id) {
      return {};
    }
    const params = new URLSearchParams([
      ["txtSearch", filter.txtSearch || ""],
      ["sortField", filter.sortField || "tb_request.date_start"],
      ["sortDirection", filter.sortDirection || "asc"],
      ["page", filter.page.toString()],
      ["limit", filter.limit || "20"],
    ]);
    const { data } = await axiosAuth.get(url + "/status/" + id, { params });
    return data;
  };
  const query = useQuery({
    queryKey: [queryKeys.work_status, filter, { ...filter }],
    queryFn: findMany,
  });
  return { ...query, setFilter };
};
