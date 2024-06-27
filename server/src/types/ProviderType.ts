import { BaseFilter } from "./BaseFilter";

export interface IProviderQuery extends BaseFilter {
  issue_id?: string;
}

export interface IProviderForm {
  id?: number;
  name: string;
  details: string | null;
  address: string;
  province_id: string;
  amphure_id: string;
  tumbol_id: string;
  spcial: string;
  "issue_id[]"?: string[];
  issue_id1?: string;
  issue_id2?: string;
  issue_id3?: string;
  issue_id4?: string;
  issue_id5?: string;
  phone: string;
  email: string;
  line: string | null;
  line_token: string | null;
  username: string;
  password: string;
  con_password?: string;
  image: File | string | null;
  image_old?: string | null;
}
