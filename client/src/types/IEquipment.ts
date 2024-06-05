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
