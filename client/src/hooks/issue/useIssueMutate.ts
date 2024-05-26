import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { axiosAuth } from "@/utils/axios";
import type { IIssueForm } from "@/types/IIssue";

const url = "/issues";
//save one
export function useIssueSave() {
  const queryClient = useQueryClient();
  const saveOne = async (formData: IIssueForm) => {
    let response;

    if (formData.id) {
      response = await axiosAuth.patch(`${url}/${formData.id}`, formData);
    } else {
      response = await axiosAuth.post(`${url}/create`, formData);
    }

    return response;
  };

  const mutation = useMutation({
    mutationFn: (formData: IIssueForm) => saveOne(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.issues] });
    },
    onError: () => {
      console.log("error");
    },
  });
  return mutation;
}
//delete
export function useIssueDelete() {
  const queryClient = useQueryClient();
  const deleteOne = async (id: string) => {
    const response = await axiosAuth.patch(`${url}/del/${id}`);
    return response;
  };
  const mutation = useMutation({
    mutationFn: (id: string) => deleteOne(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.issues] });
    },
    onError: () => {
      console.log("error");
    },
  });
  return mutation;
}
