export type IEquip = {
  id: number;
  name: string;
  code: string;
  serial: string;
  price: number;
  shared: string;
  warranty: string;
  warranty_start: string;
  warranty_end: string;
  image: string;
  equip_status_name: string;
  category_name: string;
  faculty_name: string;
  user_name: string;
};

export type IEquipQuery = {
  txtSearch: string;
  page: number;
  limit: number;
  sortField: string;
  sortDirection: string;
};
