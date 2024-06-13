export type IRequestForm = {
  id?: number;
  name: string;
  issue_id: string | null;
  issue_sub_id: string | null;
  priority_id: string;
  faculty_id: string;
  user_id: string;
  equip_id: string[];
  details: string | null;
  image: unknown[] | null;
};
