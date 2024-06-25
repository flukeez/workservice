import type { BaseFilter } from "./BaseFilter";
import type { IFile } from "./FileUploadType";

export interface IRequestQuery extends BaseFilter {}
export type IRequestForm = {
  id?: number;
  name: string;
  issue_id: string | null;
  issue_sub_id: string | null;
  priority_id: string;
  faculty_id: string;
  user_id: number;
  "equip_id[]": string[];
  details: string | null;
  "image[]": IFile[] | null | string[];
  image_old?: string[] | null;
};
export type IRequestDetails = {
  id?: number;
  name: string;
  date_start: string;
  user_name: string;
  equip_name: string;
  provider_name: string;
  status_id: string;
  status_his: string;
  status_time: string;
};
