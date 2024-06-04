export interface ICategory {
  id: number;
  code: string;
  name: string;
}

export interface ICategoryForm {
  code: string;
  name: string;
  id?: number;
}

export interface ICategoryQuery {
  txtSearch: string;
  page: number;
  limit: number;
  sortField: string;
  sortDirection: string;
}
