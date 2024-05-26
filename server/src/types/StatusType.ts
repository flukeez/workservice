export type IStatus = {
  id: number;
  name: string;
};
export type IStatusQuery = {
  txtSearch: string;
  page: number;
  limit: number;
  sortField: string;
  sortDirection: string;
};
export type IStatusForm = {
  id?: number;
  name: string;
};
