import { StateCreator, create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

interface IFilter {
  username: string;
  password: string;
  token: string;
  refresh_token: string;
  fullname: string;
  image: string | null;
}
interface Actions {
  setFilter: (filter: IFilter) => void;
  resetFilter: () => void;
}

type FilterStore = IFilter & Actions;

type MyPersist = (
  config: StateCreator<FilterStore>,
  options: PersistOptions<FilterStore>
) => StateCreator<FilterStore>;

const initialState: IFilter = {
  username: "",
  password: "",
  token: "",
  refresh_token: "",
  fullname: "",
  image: "",
};

export const useLoginStore = create<FilterStore>()(
  (persist as MyPersist)(
    (set): FilterStore => ({
      ...initialState,
      setFilter: (filter: IFilter) => set(() => ({ ...filter })),
      resetFilter: () => set(() => ({ ...initialState })),
    }),
    {
      name: "login-filter",
      version: 1,
    }
  )
);
