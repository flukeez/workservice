import type { UploadedFile } from "./ImageType";

export type IUser = {
  id: number;
  image: string;
  firstname: string;
  surname: string;
  nickname: string;
  line: string;
  phone: string;
  last_login: string;
};
export type IUserData = {
  id: number;
  id_card: string;
  firstname: string;
  surname: string;
  nickname: string;
  line: string;
  line_token: string;
  email: string;
  phone: string;
  birthday: string;
  image: string;
  sex: string;
  address: string;
  tumbol_id: number;
  amphure_id: number;
  province_id: number;
  username: string;
  password: string;
};

export type IUserForm = {
  id?: number;
  id_card: string;
  firstname: string;
  surname: string;
  nickname?: string;
  line?: string;
  line_token?: string;
  email?: string;
  phone?: string;
  birthday?: string;
  image?: UploadedFile[] | string;
  imageName?: string;
  sex: string;
  address?: string;
  tumbol_id?: number;
  amphure_id?: number;
  province_id?: number;
  username: string;
  password?: string;
  con_password?: string;
};

export type IUserQuery = {
  txtSearch: string;
  page: number;
  limit: number;
  sortField: string;
  sortDirection: string;
};
