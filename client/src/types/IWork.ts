export interface IWorkForm {
  request_id: number;
  status_id: string;
  details: string | null;
  image: unknown | string | null;
  total_cost: number | null;
  request_cost: number | null;
  parts_cost: number | null;
  other_cost: number | null;
  vat: number | null;
  resolution: string | null;
}
