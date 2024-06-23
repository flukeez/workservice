import { StateCreator, create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import type { IFilter } from "@/types/IFilter";

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
  txtSearch: "",
  page: 1,
  sortDirection: "asc",
  sortField: "tb_user_position.id",
};

export const useUserPositionStore = create<FilterStore>()(
  (persist as MyPersist)(
    (set): FilterStore => ({
      ...initialState,
      setFilter: (filter: IFilter) => set(() => ({ ...filter })),
      resetFilter: () => set(() => ({ ...initialState })),
    }),
    {
      name: "user-position-filter",
      version: 1,
    }
  )
);
