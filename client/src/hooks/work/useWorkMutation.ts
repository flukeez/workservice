import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const url = "works";

//รับงานซ่อม
export const useWorkSubmitMutation = () => {
  const queryClient = useQueryClient();
  const submitWork = async (id: string) => {
    const response = await axiosAuth.get(`${url}/submit/${id}`);
    return response;
  };
  const mutation = useMutation({
    mutationFn: (id: string) => submitWork(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.works] });
    },
    onError: () => {
      console.log("error");
    },
  });
  return mutation;
};
