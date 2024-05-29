import { useQuery } from "@tanstack/react-query";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";
import { useState } from "react";

const url = "/amphures";
export function useAmphures(id: string) {
  const [filter, setFilter] = useState(id);
  const findById = async () => {
    if (id) {
      const { data } = await axiosAuth.get(url + "/" + filter);
      return data;
    }
    return {};
  };
  const query = useQuery({
    queryKey: [queryKeys.amphure, filter],
    queryFn: findById,
  });
  return { ...query, setFilter };
}
