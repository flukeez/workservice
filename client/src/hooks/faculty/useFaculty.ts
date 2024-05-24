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

//get all
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
