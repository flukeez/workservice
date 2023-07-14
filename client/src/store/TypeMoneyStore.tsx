import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import axios from "axios";

type TypeMoney = {
  id?: number;
  money_type: string;
  durable_goods: number;
  building: number;
};

type TypeMoneyStore = {
  typeMoney: TypeMoney[];
  fetchTypeMoney: () => Promise<void>;
  addTypeMoney: (typeMoney: TypeMoney) => Promise<void>;
  updateTypeMoney: (id: number, updateTypeMoney: Partial<TypeMoney>) => void;
  deleteTypeMoney: (id: number) => Promise<void>;
};

const baseURL: unknown = import.meta.env.VITE_BASE_URL;

const useTypeMoneyStore = create(
  devtools(
    immer<TypeMoneyStore>((set) => ({
      typeMoney: [],
      fetchTypeMoney: async () => {
        try {
          const response = await axios.get<TypeMoney[]>(
            `${baseURL}/api/typeMoneys`
          );
          set((state) => {
            state.typeMoney = response.data.rows;
          });
        } catch (error) {
          console.error("Error fetching typeMoney:", error);
        }
      },
      addTypeMoney: async (typeMoney: TypeMoney) => {
        try {
          const response = await axios.post(
            `${baseURL}/api/typeMoneys/create`,
            typeMoney
          );
          set((state) => {
            state.typeMoney.push(response.data.rows);
          });
        } catch (error) {
          console.error("ไม่สามารถเพิ่มข้อมูลได้", error);
        }
      },

      updateTypeMoney: (id, updateTypeMoney) =>
        set((state) => {
          state.typeMoney = state.typeMoney.map((type) =>
            type.id === id ? { ...type, ...updateTypeMoney } : type
          );
        }),
      deleteTypeMoney: async (id) => {
        try {
          const response = await axios
            .delete(`${baseURL}/api/typeMoneys/${id}`)
            .then(() => {
              set((state) => {
                state.typeMoney = state.typeMoney.filter(
                  (type) => type.id !== id
                );
              });
            });
        } catch (error) {
          console.log(error);
        }
      },
    }))
  )
);

export default useTypeMoneyStore;
