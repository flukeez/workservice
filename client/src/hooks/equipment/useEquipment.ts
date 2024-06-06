import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";
import type { IEquipmentQuery } from "@/types/IEquipment";

const url = "/equipments";
export const useEquipments = (condition: IEquipmentQuery) => {
  const [filter, setFilter] = useState(condition);
  const findMany = async () => {
    const params = new URLSearchParams([
      ["txtSearch", filter.txtSearch || ""],
      ["sortField", filter.sortField || "name"],
      ["sortDirection", filter.sortDirection || "asc"],
      ["page", filter.page?.toString()],
      ["limit", filter.limit?.toString() || "10"],
      ["faculty_id", filter.faculty_id || ""],
      ["user_id", filter.user_id || ""],
    ]);

    const { data } = await axiosAuth.get(url, { params });
    return data;
  };
  const query = useQuery({
    queryKey: [queryKeys.equipments, { ...filter }],
    queryFn: findMany,
  });
  return { ...query, setFilter };
};
export const useEquipment = (id: number) => {
  const [filter, setFilter] = useState(id);
  const findById = async () => {
    if (id === 0) {
      return {};
    }
    const { data } = await axiosAuth.get(url + "/" + filter);
    return data;
  };
  const query = useQuery({
    queryKey: [queryKeys.equipment, filter],
    queryFn: findById,
  });
  return { ...query, setFilter };
};
