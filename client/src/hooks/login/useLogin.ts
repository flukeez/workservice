import type { ILoginFormType } from "@/types/ILogin";
import { axiosAuth } from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";

const url = "/login";
export const useLogin = () => {
  const login = async (formData: ILoginFormType) => {
    const response = await axiosAuth.post(`${url}`, formData);
    return response;
  };
  const mutation = useMutation({
    mutationFn: (formData: ILoginFormType) => login(formData),
  });
  return mutation;
};
