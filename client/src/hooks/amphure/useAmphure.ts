import { useQuery } from "@tanstack/react-query";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";

const url = "/amphures";
export function useAmphures(id: string) {
  const findById = async () => {
    if (id) {
      const { data } = await axiosAuth.get(url + "/" + id);
      return data;
    }
    return {};
  };
  const query = useQuery({
    queryKey: [queryKeys.amphure, id],
    queryFn: findById,
  });
  return { ...query };
}
