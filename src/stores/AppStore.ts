import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface AppStore {
  cart: IProduct[];
  wishList: IProduct[];
}

const useAppStore = create<AppStore>()(
  immer((set, get) => ({
    cart: [],
    wishList: [],
  }))
);

export default useAppStore;
