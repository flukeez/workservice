import { StateCreator, create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

interface IFilter {
  txtSearch: string;
  page: number;
  sortField: string;
  sortDirection: "asc" | "desc";
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
  txtSearch: "",
  page: 1,
  sortDirection: "asc",
  sortField: "firstname",
};

export const useOrgChartStore = create<FilterStore>()(
  (persist as MyPersist)(
    (set): FilterStore => ({
      ...initialState,
      setFilter: (filter: IFilter) => set(() => ({ ...filter })),
      resetFilter: () => set(() => ({ ...initialState })),
    }),
    {
      name: "org-chart-filter",
      version: 1,
    }
  )
);
