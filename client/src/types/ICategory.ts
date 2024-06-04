export interface ICategory {
  id: number;
  code: string | null;
  name: string;
}

export interface ICategoryForm {
  code: string | null;
  name: string;
  id?: number;
}
