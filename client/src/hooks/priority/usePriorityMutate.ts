import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";
import type { IPriorityForm } from "@/types/IPriority";

const url = "/prioritys";
export function usePrioritySave() {
  const queryClient = useQueryClient();
  const saveOne = async (formData: IPriorityForm) => {
    let response;
    if (formData.id) {
      response = await axiosAuth.patch(`${url}/${formData.id}`, formData);
    } else {
      response = await axiosAuth.post(`${url}/create`, formData);
    }
    return response;
  };
  const mutation = useMutation({
    mutationFn: (formData: IPriorityForm) => saveOne(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.prioritys] });
    },
    onError: () => {
      console.log("error");
    },
  });
  return mutation;
}
export function usePriorityDelete() {
  const queryClient = useQueryClient();
  const deleteOne = async (id: string) => {
    const response = await axiosAuth.patch(`${url}/del/${id}`);
    return response;
  };
  const mutation = useMutation({
    mutationFn: (id: string) => deleteOne(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.prioritys] });
    },
    onError: () => {
      console.log("error");
    },
  });
  return mutation;
}
