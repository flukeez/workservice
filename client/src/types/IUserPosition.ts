export interface IUserPositionData {
  position_name: string;
  firstname: string;
  surname: string;
}

export interface IUserPosition {
  user_id: number;
  pos_id: number | null;
  fac_id: number;
}

export interface IUserPositionForm {
  id?: number;
  user_id: string;
  pos_id: string | null;
  fac_id: string;
}
