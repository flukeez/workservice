import { StateCreator, create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

interface IFilter {
  textSearch: string;
  activePage: number;
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
  textSearch: "",
  activePage: 1,
};
export const useCustomerStore = create<FilterStore>()(
  (persist as MyPersist)(
    (set): FilterStore => ({
      ...initialState,
      setFilter: (filter: IFilter) => set(() => ({ ...filter })),
      resetFilter: () => set({ ...initialState }),
    }),
    {
      name: "customer-filter",
      version: 1,
    }
  )
);
