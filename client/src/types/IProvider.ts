import { IConditionFilter } from "./IConditionFilter";

export type Provider = {
  id: number;
  name: string;
  image: string;
  tel: string;
  rating: number;
  status: number;
  last_login: string;
  available: number;
};

export interface IProviderQuery extends IConditionFilter {
  issue_id?: string;
  status?: string[];
}

export type IProviderForm = {
  id: number | null;
  name: string;
  details: string | null;
  address: string;
  province_id: string;
  amphure_id: string;
  tumbol_id: string;
  special: string | null;
  issue_id: string[];
  phone: string;
  email: string;
  line: string | null;
  line_token: string | null;
  username: string;
  password: string | null;
  con_password?: string | null;
  image: unknown | null;
};
