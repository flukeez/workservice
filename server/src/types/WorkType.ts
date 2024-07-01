import { BaseFilter } from "./BaseFilter";

export interface IWorkQuery extends BaseFilter {}

export interface IWorkForm {
  status_id: string;
  details: string;
  image?: File | string | null;
  total_cost?: number;
  request_cost?: number;
  parts_cost?: number;
  other_cost?: number;
  vat?: number;
  resolution?: string;
}
