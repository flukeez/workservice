export interface IEquipStatus {
  id: number;
  name: string;
}

export interface IEquipStatusForm {
  name: string;
  id?: number;
}

export interface IEquipStatusQuery {
  txtSearch: string;
  page: number;
  limit: number;
  sortField: string;
  sortDirection: string;
}
