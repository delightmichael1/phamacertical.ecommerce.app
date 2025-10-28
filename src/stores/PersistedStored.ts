import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface PersistedStore {
  cart: IProduct[];
  orders: IOrder[];
  wishList: IProduct[];
}

const usePersistedStore = create<PersistedStore>()(
  persist(
    immer((set, get) => ({
      cart: [],
      orders: [],
      wishList: [],
    })),
    {
      name: "app-store",
    }
  )
);

export default usePersistedStore;
