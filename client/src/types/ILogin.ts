export type ILoginFormType = {
  username: string;
  password: string;
};

type Position = {
  fac_id: string;
  pos_id: string | null;
};
export type ILogin = {
  id: string;
  firstname: string;
  surname: string;
  image: string | null;
  position: Position[];
};

export type ILoginProvider = {
  id: string;
  name: string;
  image: string | null;
  position: Position[];
};
