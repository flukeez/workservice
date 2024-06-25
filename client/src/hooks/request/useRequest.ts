import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { IConditionFilter } from "@/types/IConditionFilter";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";

const url = "/requests";
export const useRequests = (condition: IConditionFilter) => {
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
    queryKey: [queryKeys.requests, { ...filter }],
    queryFn: findMany,
  });
  return { ...query, setFilter };
};

//find by id
export const useRequest = (id: number) => {
  const [filter, setFilter] = useState(id);
  const findById = async () => {
    if (id === 0) {
      return {};
    }
    const { data } = await axiosAuth.get(url + "/" + filter);
    return data;
  };
  const query = useQuery({
    queryKey: [queryKeys.request, filter],
    queryFn: findById,
  });
  return { ...query, setFilter };
};

//TODO: รายละเอียดงานซ่อม
export const useRequestDetails = (id: number) => {
  const findById = async () => {
    if (id === 0) {
      return {};
    }
    const { data } = await axiosAuth.get(url + "/details/" + id);
    return data;
  };
  const query = useQuery({
    queryKey: [queryKeys.request_details, id],
    queryFn: findById,
  });
  return { ...query };
};
