import type { IRequestForm } from "@/types/IRequest";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const url = "/requests";
export function useRequestSave() {
  const queryClient = useQueryClient();
  const saveOne = async (formData: IRequestForm) => {
    let response;
    console.log(formData);
    if (formData.id) {
      response = await axiosAuth.patch(`${url}/${formData.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      response = await axiosAuth.post(`${url}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return response;
  };
  const mutation = useMutation({
    mutationFn: (formData: IRequestForm) => saveOne(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.requests] });
    },
    onError: () => {
      console.log("error");
    },
  });
  return mutation;
}
