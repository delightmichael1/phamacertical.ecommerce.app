import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface AppStore {
  cart: IProduct[];
  orders: IProduct[];
  accessToken: string;
  refreshToken: string;
  wishList: IProduct[];
  device: IDevice | undefined;
  notications: INotification[];
  showCartConfirmDialog: boolean;
}

const useAppStore = create<AppStore>()(
  immer((set, get) => ({
    cart: [],
    orders: [],
    wishList: [],
    notications: [],
    accessToken: "",
    refreshToken: "",
    device: undefined,
    showCartConfirmDialog: true,
  }))
);

export default useAppStore;
