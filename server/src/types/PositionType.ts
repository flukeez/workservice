export type IPosition = {
  id: number;
  name: string;
  super_admin: number;
};
export type IPositionQuery = {
  txtSearch: string;
  page: number;
  limit: number;
  sortField: string;
  sortDirection: string;
};

export type IPositionForm = {
  id?: number;
  name: string;
  super_admin: number;
};
