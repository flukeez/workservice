import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";
import type { IWorkForm } from "@/types/IWork";

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

//เปลี่ยนสถานะงานซ่อม
export const useWorkUpdateMutation = () => {
  const queryClient = useQueryClient();
  const workUpdate = async (formData: IWorkForm) => {
    const response = await axiosAuth.patch(
      `${url}/update/${formData.request_id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response;
  };
  const mutation = useMutation({
    mutationFn: (formData: IWorkForm) => workUpdate(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.work_progress] });
    },
    onError: () => {
      console.log("error");
    },
  });
  return mutation;
};
