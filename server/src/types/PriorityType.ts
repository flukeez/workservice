export type IPriority = {
  id: number;
  name: string;
};
export type IPriorityQuery = {
  txtSearch: string;
  page: number;
  limit: number;
  sortField: string;
  sortDirection: string;
};

export type IPriorityForm = {
  id?: number;
  name: string;
};
