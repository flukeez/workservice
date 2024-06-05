import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";
import type { IFacultyForm, IFacultyPositionForm } from "@/types/IFaculty";

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
//delete
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

//เพิ่มคนในหน่วยงาน
export function useFacultyPositionSave() {
  const queryClient = useQueryClient();
  const saveOne = async (formData: IFacultyPositionForm) => {
    let response;
    if (formData.type) {
      delete formData.type;
      response = await axiosAuth.put(`${url}/org_chart/update`, formData);
    } else {
      delete formData.type;
      response = await axiosAuth.post(`${url}/org_chart/create`, formData);
    }
    return response;
  };
  const mutation = useMutation({
    mutationFn: (formData: IFacultyPositionForm) => saveOne(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.org_charts] });
    },
    onError: () => {
      console.log("error");
    },
  });
  return mutation;
}

//ลบคนในหน่วยงาน
export function useFacultyPositionDelete() {
  const queryClient = useQueryClient();
  const deleteOne = async (id: number, user_id: string) => {
    const response = await axiosAuth.delete(
      `${url}/org_chart/del/${id}/user/${user_id}`
    );
    return response;
  };

  const mutation = useMutation({
    mutationFn: ({ id, user_id }: { id: number; user_id: string }) =>
      deleteOne(id, user_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.org_charts] });
    },
  });
  return mutation;
}
