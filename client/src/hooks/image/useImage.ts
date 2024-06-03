import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";

const url = "/images";
export const useImage = (folderName: string, fileName: string) => {
  const [filter, setFilter] = useState(fileName);
  const getImage = async () => {
    if (filter == "") {
      return {};
    }
    const response = await axiosAuth.get(
      url + "/" + folderName + "/" + filter,
      {
        responseType: "blob",
      }
    );
    return response.data;
  };
  const query = useQuery({
    queryKey: [queryKeys.image, folderName, filter],
    queryFn: getImage,
  });
  return { ...query, setFilter };
};
