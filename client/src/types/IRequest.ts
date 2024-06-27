export type IRequest = {
  id: number;
  name: string;
  issue_id: string;
  issue_sub_id: string | null;
  priority_id: string;
  equip_id: string[];
  details: string | null;
  image: unknown[] | null;
};

export type IRequestForm = {
  id?: number | null;
  name: string;
  issue_id: string;
  issue_sub_id: string | null;
  priority_id: string;
  equip_id: string[];
  details: string | null;
  image: unknown[] | null;
  provider?: string;
  status_id?: number | null;
};
