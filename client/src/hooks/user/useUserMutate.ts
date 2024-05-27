import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";
import { IUserForm } from "@/types/IUser";

const url = "/users";
export function useUserSave() {
  const queryClient = useQueryClient();
  const saveOne = async (formData: IUserForm) => {
    let response;
    if (formData.id) {
      response = await axiosAuth.patch(`${url}/${formData.id}`, formData);
    } else {
      response = await axiosAuth.post(`${url}/create`, formData);
    }
    return response;
  };
  const mutation = useMutation({
    mutationFn: (formData: IUserForm) => saveOne(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
    },
    onError: () => {
      console.log("error");
    },
  });
  return mutation;
}
export function useUserDelete() {
  const queryClient = useQueryClient();
  const deleteOne = async (id: string) => {
    const response = await axiosAuth.patch(`${url}/del/${id}`);
    return response;
  };
  const mutation = useMutation({
    mutationFn: (id: string) => deleteOne(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
    },
    onError: () => {
      console.log("error");
    },
  });
  return mutation;
}
