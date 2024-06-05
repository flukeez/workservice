export interface IFaculty {
  id: number;
  name: string;
  faculty_name: string;
}

export interface IFacultyForm {
  name: string;
  faculty_id: number;
  id?: number;
}

export interface IFacultyQuery {
  txtSearch: string;
  page: number;
  limit: number;
  sortField: string;
  sortDirection: string;
}

export type IFacultyOrgChart = {
  position_name?: string;
  firstname: string;
  surname: string;
};
export type IFacultyPosition = {
  user_id: number;
  fac_id: number;
  pos_id: number | null;
};
