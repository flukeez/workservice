import { useState } from "react";
import { IConditionFilter } from "@/types/IConditionFilter";
import { axiosAuth } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";

const url = "/facultys";
//get all
export const useFacultys = (condition: IConditionFilter) => {
  const [filter, setFilter] = useState(condition);

  const findMany = async () => {
    const params = new URLSearchParams([
      ["txtSearch", filter.txtSearch || ""],
      ["sortField", filter.sortField || "name"],
      ["sortDirection", filter.sortDirection || "asc"],
      ["page", filter.page?.toString()],
      ["limit", filter.limit.toString()],
    ]);

    const { data } = await axiosAuth.get(url, { params });
    return data;
  };

  const query = useQuery({
    queryKey: [queryKeys.facultys, { ...filter }],
    queryFn: findMany,
  });

  return { ...query, setFilter };
};

//get by id
export const useFaculty = (id: string) => {
  const [filter, setFilter] = useState(id);

  const findById = async () => {
    if (id === "0") {
      return {};
    }
    const { data } = await axiosAuth.get(url + "/" + filter);
    return data;
  };

  const query = useQuery({
    queryKey: [queryKeys.faculty, filter],
    queryFn: findById,
  });

  return { ...query, setFilter };
};
//แสดงผังองค์กรทั้งหทด
export const useOrgCharts = (id: number, condition: IConditionFilter) => {
  const [filter, setFilter] = useState(condition);
  const findMany = async () => {
    if (id == 0) {
      return {};
    }
    const params = new URLSearchParams([
      ["txtSearch", filter.txtSearch || ""],
      ["sortField", filter.sortField || "name"],
      ["sortDirection", filter.sortDirection || "asc"],
      ["page", filter.page?.toString()],
      ["limit", filter.limit.toString()],
    ]);

    const { data } = await axiosAuth.get(url + "/org_chart/" + id, {
      params,
    });
    return data;
  };
  const query = useQuery({
    queryKey: [queryKeys.org_charts, id, { ...filter }],
    queryFn: findMany,
  });
  return { ...query, setFilter };
};
//แสดงบุคคลในผังองค์กร
export const useOrgChart = (fac_id: number, id: string) => {
  const [filter, setFilter] = useState(id);
  const findById = async () => {
    if (id === "0") {
      return {};
    }
    const { data } = await axiosAuth.get(
      url + "/org_chart/" + fac_id + "/user/" + filter
    );
    return data;
  };
  const query = useQuery({
    queryKey: [queryKeys.org_chart, fac_id, filter],
    queryFn: findById,
  });
  return { ...query, setFilter };
};
