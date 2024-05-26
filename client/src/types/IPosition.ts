export type IPosition = {
  id: number;
  name: string;
  faculty_name: string;
  super_admin: boolean;
};

export type IPositionForm = {
  name: string;
  faculty_id: string;
  super_admin: boolean | null;
};
