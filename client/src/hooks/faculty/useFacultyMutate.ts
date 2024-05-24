import { IFacultyForm } from "@/types/IFaculty";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const url = "/facultys";

//save one
export function useFacultySave() {
  const queryClient = useQueryClient();
  const saveOne = async (formData: IFacultyForm) => {
    let response;
    if (formData.id) {
      response = await axiosAuth.patch(`${url}/${formData.id}`, formData);
    } else {
      response = await axiosAuth.post(`${url}/create`, formData);
    }
    return response;
  };

  const mutation = useMutation({
    mutationFn: (formData: IFacultyForm) => saveOne(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.facultys] });
    },
    onError: () => {
      console.log("error");
    },
  });

  return mutation;
}

export function useFacultyDelete() {
  const queryClient = useQueryClient();
  const deleteOne = async (id: string) => {
    const response = await axiosAuth.patch(`${url}/del/${id}`);
    return response;
  };

  const mutation = useMutation({
    mutationFn: (id: string) => deleteOne(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.facultys] });
    },
  });

  return mutation;
}
