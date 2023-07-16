import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import axios from "axios";

type TypeMoney = {
  id?: number | undefined;
  money_type: string;
  durable_goods: number;
  building: number;
};

type TypeMoneyStore = {
  typeMoney: TypeMoney[];
  fetchTypeMoney: () => Promise<void>;
  addTypeMoney: (typeMoney: TypeMoney) => Promise<void>;
  updateTypeMoney: (
    id: number,
    updateTypeMoney: Partial<TypeMoney>
  ) => Promise<void>;
  deleteTypeMoney: (id: number) => Promise<void>;
};

const baseURL: string = import.meta.env.VITE_BASE_URL as string;

const useTypeMoneyStore = create(
  devtools(
    immer<TypeMoneyStore>((set) => ({
      typeMoney: [],
      fetchTypeMoney: async () => {
        try {
          const response = await axios.get<{ rows: TypeMoney[] }>(
            `${baseURL}/api/typeMoneys`
          );
          set((state) => ({
            ...state,
            typeMoney: response.data.rows,
          }));
        } catch (error) {
          console.error("Error fetching typeMoney:", error);
        }
      },
      addTypeMoney: async (typeMoney: TypeMoney) => {
        try {
          const response = await axios.post<{ rows: TypeMoney[] }>(
            `${baseURL}/api/typeMoneys/create`,
            typeMoney
          );
          set((state) => ({
            ...state,
            typeMoney: [...state.typeMoney, response.data.rows],
          }));
        } catch (error) {
          console.error("ไม่สามารถเพิ่มข้อมูลได้", error);
        }
      },
      updateTypeMoney: async (id, updateTypeMoney) => {
        try {
          const reponse = await axios.put<{ rows: TypeMoney[] }>(
            `${baseURL}/api/typeMoneys/${id}`,
            updateTypeMoney
          );
          set((state) => ({
            ...state,
            typeMoney: [
              ...state.typeMoney.map((type) =>
                type.id == id ? { ...type, ...updateTypeMoney } : type
              ),
            ],
          }));
        } catch (error) {
          console.log("ไม่สามารถอัพเดทข้อมูลได้", error);
        }
      },

      deleteTypeMoney: async (id) => {
        try {
          await axios.delete(`${baseURL}/api/typeMoneys/${id}`);
          set((state) => ({
            ...state,
            typeMoney: state.typeMoney.filter((type) => type.id !== id),
          }));
        } catch (error) {
          console.log(error);
        }
      },
    }))
  )
);

export default useTypeMoneyStore;
