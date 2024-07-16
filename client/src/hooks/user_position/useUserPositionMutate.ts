import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";
import { IUserPositionForm } from "@/types/IUserPosition";

const url = "/user_positions";

//เพิ่มคนในหน่วยงาน
export function useUserPositionSave() {
  const queryClient = useQueryClient();
  const saveOne = async (formData: IUserPositionForm) => {
    let response;
    if (formData.id) {
      response = await axiosAuth.patch(`${url}/${formData.id}`, formData);
    } else {
      response = await axiosAuth.post(`${url}/create`, formData);
    }
    return response;
  };
  const mutation = useMutation({
    mutationFn: (formData: IUserPositionForm) => saveOne(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.user_positions] });
    },
    onError: () => {
      console.log("error");
    },
  });
  return mutation;
}

//ลบคนในหน่วยงาน
export function useUserPositionDelete() {
  const queryClient = useQueryClient();
  const deleteOne = async (id: string) => {
    const response = await axiosAuth.patch(`${url}/${id}`);
    return response;
  };

  const mutation = useMutation({
    mutationFn: (id: string) => deleteOne(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.user_positions] });
    },
  });
  return mutation;
}
