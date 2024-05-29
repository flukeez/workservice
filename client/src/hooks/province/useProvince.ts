import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";
import { useQuery } from "@tanstack/react-query";

const url = "/provinces";
export const useProvinces = () => {
  const findMany = async () => {
    const { data } = await axiosAuth.get(url);
    return data;
  };
  const query = useQuery({
    queryKey: [queryKeys.provinces],
    queryFn: findMany,
  });
  return { ...query };
};
