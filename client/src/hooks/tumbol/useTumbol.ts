import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";

const url = "/tumbols";
export function useTumbols(id: string) {
  const [filter, setFilter] = useState(id);
  const findById = async () => {
    if (id) {
      const { data } = await axiosAuth.get(url + "/" + filter);
      return data;
    }
    return {};
  };
  const query = useQuery({
    queryKey: [queryKeys.tumbol, filter],
    queryFn: findById,
  });
  return { ...query, setFilter };
}
