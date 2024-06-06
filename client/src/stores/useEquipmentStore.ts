import { StateCreator, create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import type { IEquipmentQuery } from "@/types/IEquipment";

interface Actions {
  setFilter: (filter: IEquipmentQuery) => void;
  resetFilter: () => void;
}

type FilterStore = IEquipmentQuery & Actions;

type MyPersist = (
  config: StateCreator<FilterStore>,
  options: PersistOptions<FilterStore>
) => StateCreator<FilterStore>;

const initialState: IEquipmentQuery = {
  txtSearch: "",
  page: 1,
  sortDirection: "asc",
  sortField: "tb_equip.name",
  faculty_id: "",
  user_id: "",
};

export const useEquipmentStore = create<FilterStore>()(
  (persist as MyPersist)(
    (set): FilterStore => ({
      ...initialState,
      setFilter: (filter: IEquipmentQuery) => set(() => ({ ...filter })),
      resetFilter: () => set(() => ({ ...initialState })),
    }),
    {
      name: "equipment-filter",
      version: 1,
    }
  )
);
