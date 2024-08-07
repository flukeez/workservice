import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosAuth } from "@/utils/axios";
import { queryKeys } from "@/utils/queryKeys";
import { IConditionFilter } from "@/types/IConditionFilter";
import { IIssueFilter } from "@/types/IIssue";

const url = "/issues";
//get all
export const useIssues = (condition: IConditionFilter & IIssueFilter) => {
  const [filter, setFilter] = useState(condition);

  const findMany = async () => {
    const params = new URLSearchParams([
      ["txtSearch", filter.txtSearch || ""],
      ["sortField", filter.sortField || "name"],
      ["sortDirection", filter.sortDirection || "asc"],
      ["page", filter.page.toString()],
      ["limit", filter.limit || "20"],
      ["issue_type", filter.issueType || ""],
      ["issue_id", filter.issueId || ""],
    ]);

    const { data } = await axiosAuth.get(url, { params });
    return data;
  };

  const query = useQuery({
    queryKey: [queryKeys.issues, { ...filter }],
    queryFn: findMany,
  });

  return { ...query, setFilter };
};

// get by id
export const useIssue = (id: string) => {
  const [filter, setFilter] = useState(id);

  const findById = async () => {
    if (id === "0") {
      return {};
    }
    const { data } = await axiosAuth.get(url + "/" + filter);
    return data;
  };

  const query = useQuery({
    queryKey: [queryKeys.issue, filter],
    queryFn: findById,
  });

  return { ...query, setFilter };
};
