export type User = {
  id: number;
  image: string;
  firstname: string;
  surname: string;
  nickname: string;
  line: string;
  phone: string;
  last_login: string;
};
export interface IUserForm {
  id: number | null;
  id_card: string;
  firstname: string;
  surname: string;
  nickname: string | null;
  sex: number | null;
  birthday: string | null;
  address: string | null;
  province_id: string | null;
  amphure_id: string | null;
  tumbol_id: string | null;
  phone: string | null;
  email: string | null;
  line: string | null;
  line_token: string | null;
  username: string;
  password: string | null;
  con_password?: string | null;
  image: string | null;
}
