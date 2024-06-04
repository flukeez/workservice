export type IPosition = {
  id: number;
  name: string;
  faculty_name: string;
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
  faculty_id: number;
  super_admin: number;
};

type PositionData = {
  faculty_name: string;
  position_name: string;
};
export type IPositionAssign = {
  id: number;
  name: string;
  position: PositionData[];
};
