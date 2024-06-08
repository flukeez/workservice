import { IEquipmentForm } from "@/types/IEquipment";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const url = "/equipments";
export function useEquipmentSave() {
  const queryClient = useQueryClient();
  const saveOne = async (formData: IEquipmentForm) => {
    let response;
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
    mutationFn: (formData: IEquipmentForm) => saveOne(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.equipments] });
    },
    onError: () => {
      console.log("Error");
    },
  });
  return mutation;
}
export function useEquipmentDelete() {
  const queryClient = useQueryClient();
  const deleteOne = async (id: string) => {
    const response = await axiosAuth.delete(`${url}/del/${id}`);
    return response;
  };

  const mutation = useMutation({
    mutationFn: (id: string) => deleteOne(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.equipments] });
    },
  });

  return mutation;
}
