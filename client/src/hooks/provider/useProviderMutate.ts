import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";
import type { IProviderForm } from "@/types/IProvider";

const url = "/providers";

export function useProviderSave() {
  const queryClient = useQueryClient();

  const saveOne = async (formData: IProviderForm) => {
    let response;
    delete formData.con_password;

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
    mutationFn: (formData: IProviderForm) => saveOne(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.providers] });
    },
    onError: () => {
      console.log("error");
    },
  });
  return mutation;
}

export function useProviderDelete() {
  const queryClient = useQueryClient();
  const deleteOne = async (id: string) => {
    const response = await axiosAuth.patch(`${url}/del/${id}`);
    return response;
  };
  const mutation = useMutation({
    mutationFn: (id: string) => deleteOne(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.providers] });
    },
    onError: () => {
      console.log("error");
    },
  });
  return mutation;
}
