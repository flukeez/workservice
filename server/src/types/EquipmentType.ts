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
  image_old?: string | null;
  equip_status_name: string;
  category_name: string | null;
  faculty_name: string | null;
  user_name: string | null;
};

export type IEquipQuery = {
  txtSearch: string;
  page: number;
  limit: number;
  sortField: string;
  sortDirection: string;
  faculty_id: string | null;
  user_id: string | null;
};

export type IEquipmentForm = {
  id: number | null;
  name: string;
  code: string;
  serial: string;
  cate_id: string | null;
  price: number;
  date_start: string;
  details: string;
  faculty_id: string | null;
  user_id: string | null;
  warranty: string;
  warranty_start: string;
  warranty_end: string;
  image: File | null | string;
  image_old?: string;
};
