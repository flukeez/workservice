import { useState } from "react";
import { IConditionFilter } from "@/types/IConditionFilter";
import { axiosAuth } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";

const url = "/user_positions";

// แสดงผังองค์กรทั้งหมด
export const useUserPositions = (id: number, condition: IConditionFilter) => {
  const [filter, setFilter] = useState(condition);

  const findMany = async () => {
    if (id === 0) {
      return {};
    }
    const params = new URLSearchParams([
      ["txtSearch", filter.txtSearch || ""],
      ["sortField", filter.sortField || "tb_user_position.id"],
      ["sortDirection", filter.sortDirection || "asc"],
      ["page", filter.page?.toString() || "1"],
      ["limit", filter.limit?.toString() || "20"],
    ]);

    const { data } = await axiosAuth.get(`${url}/faculty/${id}`, { params });
    return data;
  };

  const query = useQuery({
    queryKey: [queryKeys.user_positions, { ...filter }],
    queryFn: findMany,
  });

  return { ...query, setFilter };
};

// แสดงบุคคลในผังองค์กร
export const useUserPosition = (id: string) => {
  const [filter, setFilter] = useState(id);

  const findById = async () => {
    if (id === "0") {
      return {};
    }
    const { data } = await axiosAuth.get(`${url}/${filter}`);
    return data;
  };

  const query = useQuery({
    queryKey: [queryKeys.user_position, filter],
    queryFn: findById,
  });

  return { ...query, setFilter };
};
