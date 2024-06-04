import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";
import type { EquipStatusForm } from "@/types/IEquipStatus";

const url = "/equip_statues";
export function useEquipStatusSave() {
  const queryClient = useQueryClient();
  const saveOne = async (formData: EquipStatusForm) => {
    let response;
    if (formData.id) {
      response = await axiosAuth.patch(`${url}/${formData.id}`, formData);
    } else {
      response = await axiosAuth.post(`${url}/create`, formData);
    }
    return response;
  };
  const mutation = useMutation({
    mutationFn: (formData: EquipStatusForm) => saveOne(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.equip_statues] });
    },
    onError: () => {
      console.log("error");
    },
  });
  return mutation;
}
export function useEquipStatusDelete() {
  const queryClient = useQueryClient();
  const deleteOne = async (id: string) => {
    const response = await axiosAuth.patch(`${url}/del/${id}`);
    return response;
  };
  const mutation = useMutation({
    mutationFn: (id: string) => deleteOne(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.equip_statues] });
    },
    onError: () => {
      console.log("error");
    },
  });
  return mutation;
}
