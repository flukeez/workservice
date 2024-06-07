export type IEquip = {
  id: number;
  name: string;
  code: string | null;
  serial: string | null;
  price: number;
  shared: string;
  warranty: string | null;
  warranty_start: string | null;
  warranty_end: string | null;
  image: string | null;
  equip_status_name: string;
  category_name: string | null;
  faculty_name: string | null;
  user_name: string | null;
};

export type IEquipmentQuery = {
  txtSearch: string;
  page: number;
  sortField: string;
  sortDirection: "asc" | "desc";
  limit?: number;
  faculty_id: string | null;
  user_id: string | null;
};

export type IEquipmentForm = {
  id: number | null;
  name: string;
  code: string | null;
  serial: string | null;
  cate_id: string | null;
  price: number;
  date_start: string;
  details: string | null;
  faculty_id: string | null;
  user_id: string | null;
  warranty: string | null;
  warranty_start: string | null;
  warranty_end: string | null;
  image: unknown;
  image_old: string | null;
};
