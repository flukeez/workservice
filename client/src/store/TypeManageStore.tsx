import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import axios from "axios";

type TypeManage = {
  id?: number | undefined;
  code: string;
  manage_type: string;
  durable_goods: number;
  building: number;
};

type TypeManageStore = {
  typeManage: TypeManage[];
  fetchTypeManage: () => Promise<void>;
  addTypeManage: (typeManage: TypeManage) => Promise<void>;
  updateTypeManage: (
    id: number,
    updateTypeManage: Partial<TypeManage>
  ) => Promise<void>;
  deleteTypeManage: (id: number) => Promise<void>;
};

const baseURL: string = import.meta.env.VITE_BASE_URL as string;

const useTypeManageStore = create(
  devtools(
    immer<TypeManageStore>((set) => ({
      typeManage: [],
      fetchTypeManage: async () => {
        try {
          const response = await axios.get<{ rows: TypeManage[] }>(
            `${baseURL}/api/typeManages`
          );
          set((state) => ({
            ...state,
            typeManage: response.data.rows,
          }));
        } catch (error) {
          console.error("Error fetching typeManage:", error);
        }
      },
      addTypeManage: async (typeManage: TypeManage) => {
        try {
          const response = await axios.post<{ rows: TypeManage[] }>(
            `${baseURL}/api/typeManages/create`,
            typeManage
          );
          set((state) => ({
            ...state,
            typeManage: [...state.typeManage, response.data.rows],
          }));
        } catch (error) {
          console.error("ไม่สามารถเพิ่มข้อมูลได้", error);
        }
      },
      updateTypeManage: async (id, updateTypeManage) => {
        try {
          const reponse = await axios.put<{ rows: TypeManage[] }>(
            `${baseURL}/api/typeManages/${id}`,
            updateTypeManage
          );
          set((state) => ({
            ...state,
            typeManage: [
              ...state.typeManage.map((type) =>
                type.id == id ? { ...type, ...updateTypeManage } : type
              ),
            ],
          }));
        } catch (error) {
          console.log("ไม่สามารถอัพเดทข้อมูลได้", error);
        }
      },

      deleteTypeManage: async (id) => {
        try {
          await axios.delete(`${baseURL}/api/typeManages/${id}`);
          set((state) => ({
            ...state,
            typeManage: state.typeManage.filter((type) => type.id !== id),
          }));
        } catch (error) {
          console.log(error);
        }
      },
    }))
  )
);

export default useTypeManageStore;
