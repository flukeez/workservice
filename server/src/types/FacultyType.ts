export interface IFaculty {
  id: number;
  name: string;
  faculty_name: string;
}

export interface IFacultyForm {
  name: string;
  faculty_id: number;
}

export interface IQuery {
  txtSearch: string;
  page: number;
  limit: number;
  sortField: string;
  sortDirection: string;
}
