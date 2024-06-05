export type IPosition = {
  id: number;
  name: string;
  super_admin: boolean;
};

export type IPositionForm = {
  id?: number;
  name: string;
  super_admin: boolean | null;
};
