import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosAuth } from "@/utils/axios";

const url = "/customer";

//Save one
export function useCustomerSave() {
  const queryClient = useQueryClient();
  const saveOne = async (formData: any) => {
    const response = await axiosAuth.post(url, formData);
    return response;
  };
  const mutation = useMutation({
    mutationFn: (formData: any) => saveOne(formData),
    onSuccess: () => {
      //เปลี่ยนหน้าจะดึงใหม่หรือแไม่ก็ได้ ถ้าดึงมาตอนเซฟ เวลาเปลี่ยนหน้ากับมันจะมีข้อมูลใหม่ที่แคชไว้ จะแสดงไวกว่าการเปลี่ยนหน้ากลับไปแล้วค่อยดึงมาแสดงใหม่
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  return mutation;
}
//Delete By ID
export function useCustomerDelete() {
  const queryClient = useQueryClient();
  const deleteOne = async (customerId: string) => {
    const response = await axiosAuth.delete(`${url}/${customerId}`);
    return response;
  };

  const mutation = useMutation({
    mutationFn: (id: string) => deleteOne(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  return mutation;
}
