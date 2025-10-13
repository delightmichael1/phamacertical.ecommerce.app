import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface AppStore {
  cart: IProduct[];
}

const useAppStore = create<AppStore>()(
  immer((set, get) => ({
    cart: [],
  }))
);

export default useAppStore;
