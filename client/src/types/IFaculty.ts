export interface IFaculty {
  id: number;
  name: string;
  faculty_name: string;
}

export interface IFacultyForm {
  id?: number;
  name: string;
  faculty_id: string | null;
}

export interface IFacultyOrg {
  position_name: string;
  firstname: string;
  surname: string;
}

export interface IFacultyPosition {
  user_id: number;
  pos_id: number | null;
  fac_id: number;
}

export interface IFacultyPositionForm {
  user_id: string;
  pos_id: string | null;
  fac_id: string;
  type?: number;
}
