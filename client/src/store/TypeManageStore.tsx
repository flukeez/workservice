import create from "zustand";

type TypeManage = {
  id: number;
  type_manage: string;
  durable_goods: number;
  building: number;
};

type TypeManageStore = {
  typeManage: TypeManage[];
  addTypeManage: (TypeManage: TypeManage) => void;
  updateTypeManage: (id: number, updateTypeManage: Partial<TypeManage>) => void;
  deleteTypeManage: (id: number) => void;
};

const useTypeManageStore = create<TypeManageStore>((set) => ({
  typeManage: [],
  addTypeManage: (typeManage) =>
    set((state) => ({ typeManage: [...state.typeManage, typeManage] })),
  updateTypeManage: (id, updateTypeManage) =>
    set((state) => ({
      typeManage: state.typeManage.map((type) =>
        type.id === id ? { ...type, ...updateTypeManage } : type
      ),
    })),
  deleteTypeManage: (id) =>
    set((state) => ({
      typeManage: state.typeManage.filter((type) => type.id !== id),
    })),
}));

export default useTypeManageStore;
